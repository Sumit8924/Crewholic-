/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "../components/portfolio/skr.png";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

declare global {
    interface Window {
        google?: any;
    }
}

const API_URL =
    import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// ── Fetch with timeout to prevent indefinite hanging ──
const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeoutMs = 15000
): Promise<Response> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
};

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverWaking, setServerWaking] = useState(false); // NEW: cold start UX

    const googleInitialized = useRef(false);
    const googleScriptLoaded = useRef(false);

    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isError: boolean;
    } | null>(null);

    // ── Ping backend on mount to wake Render free-tier server ──
    useEffect(() => {
        const wakeServer = async () => {
            try {
                await fetchWithTimeout(
                    `${API_URL}/api/health`, // add a /health route on backend
                    { method: "GET" },
                    8000
                );
            } catch {
                // Silent — just a warm-up ping
            }
        };
        wakeServer();
    }, []);

    // ── Load Google script immediately (removed 500ms delay) ──
    useEffect(() => {
        const existingMeta = document.querySelector(
            'meta[http-equiv="Cross-Origin-Opener-Policy"]'
        );
        if (!existingMeta) {
            const meta = document.createElement("meta");
            meta.setAttribute("http-equiv", "Cross-Origin-Opener-Policy");
            meta.setAttribute("content", "same-origin-allow-popups");
            document.head.appendChild(meta);
        }

        // FIX 1: Removed setTimeout 500ms delay — load immediately
        loadGoogleScript();
    }, []);
    useEffect(() => {
        const checkLoginExpiry = () => {
            const expiry = localStorage.getItem("loginExpiry");

            if (!expiry) return;

            const expiryTime = Number(expiry);

            if (Date.now() > expiryTime) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("permissions");
                localStorage.removeItem("loginExpiry");

                showMessage("Session expired. Please login again.", true);
            }
        };

        checkLoginExpiry();
    }, []);

    const showMessage = (text: string, isError = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const getRedirectPath = (user: any): string => {
        const role = user?.role || "user";
        switch (role) {
            case "superadmin":
            case "main_admin":
                return "/admin";
            case "rental_admin":
                return "/rental";
            case "event_admin":
                return "/event";
            case "finance_admin":
                return "/finance";
            case "marketing_admin":
                return "/marketing";
            case "web_admin":
                return "/webpanel";
            default:
                return "/dashboard";
        }
    };

    const redirectAfterLogin = (user: any) => {
        const path = getRedirectPath(user);
        navigate({ to: path as any });
    };

    const loadGoogleScript = () => {
        if (!GOOGLE_CLIENT_ID) return;

        if (googleScriptLoaded.current) {
            waitForGoogleAndInitialize();
            return;
        }

        const existingScript = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]'
        );

        if (existingScript) {
            googleScriptLoaded.current = true;
            waitForGoogleAndInitialize();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            googleScriptLoaded.current = true;
            waitForGoogleAndInitialize();
        };
        script.onerror = () => {
            showMessage("Google Sign-In failed to load.", true);
        };

        document.head.appendChild(script); // FIX 2: head loads faster than body
    };

    const waitForGoogleAndInitialize = () => {
        // FIX 3: Check immediately first before starting interval
        if (window.google?.accounts?.id) {
            initializeGoogleOAuth();
            return;
        }

        let count = 0;
        // FIX 4: Reduced interval from 200ms to 100ms
        const interval = setInterval(() => {
            count++;
            if (window.google?.accounts?.id) {
                clearInterval(interval);
                initializeGoogleOAuth();
            }
            if (count > 50) { // 50 * 100ms = 5s max
                clearInterval(interval);
                showMessage("Google Sign-In failed to load. Please refresh.", true);
            }
        }, 100);
    };

    const initializeGoogleOAuth = () => {
        if (googleInitialized.current) return;

        const googleBtn = document.getElementById("googleLoginBtn");
        if (!googleBtn) return;

        googleInitialized.current = true;
        googleBtn.innerHTML = "";

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                ux_mode: "popup",
            });

            window.google.accounts.id.renderButton(googleBtn, {
                theme: "filled_black",
                size: "large",
                width: 300,
                text: "signin_with",
                shape: "pill",
            });
        } catch (err: any) {
            console.error("Google OAuth init error:", err);
        }
    };

    const saveLoginData = (data: any) => {
        const user = data.user || {};

        // 1 day expiry time
        const oneDay = 24 * 60 * 60 * 1000;
        const expiryTime = Date.now() + oneDay;

        const items: [string, string][] = [
            ["user", JSON.stringify(user)],
            ["token", data.token || ""],
            ["role", user?.role || "user"],
            ["permissions", JSON.stringify(user?.permissions || [])],
            ["loginExpiry", expiryTime.toString()],
        ];

        items.forEach(([key, val]) => localStorage.setItem(key, val));
    };

    const handleGoogleCredentialResponse = async (response: any) => {
        if (!response?.credential) {
            showMessage("Google credential missing. Please try again.", true);
            return;
        }

        try {
            setLoading(true);

            const res = await fetchWithTimeout(
                `${API_URL}/api/auth/google`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential: response.credential }),
                },
                15000 // 15s timeout
            );

            const contentType = res.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                showMessage(`Server error (${res.status}). Please try again later.`, true);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || data.error || "Google login failed.", true);
                return;
            }

            saveLoginData(data);
            redirectAfterLogin(data.user);
        } catch (error: any) {
            if (error?.name === "AbortError") {
                showMessage("Request timed out. Server may be waking up — try again.", true);
            } else if (error?.message?.includes("Failed to fetch")) {
                showMessage("Network error. Check your connection.", true);
            } else {
                showMessage("Google login failed. Please try again.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            showMessage("Please fill in all fields.", true);
            return;
        }

        try {
            setLoading(true);

            // FIX 6: Show server wake message if it takes too long
            const wakeTimer = setTimeout(() => {
                setServerWaking(true);
            }, 4000);

            const res = await fetchWithTimeout(
                `${API_URL}/api/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password.trim(),
                    }),
                },
                30000 // 30s — Render cold start can be slow
            );

            clearTimeout(wakeTimer);
            setServerWaking(false);

            const contentType = res.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                showMessage(`Server error (${res.status}). Please try again later.`, true);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                showMessage(
                    data.msg || data.error || "Login failed. Please check your credentials.",
                    true
                );
                return;
            }

            saveLoginData(data);
            redirectAfterLogin(data.user);
        } catch (error: any) {
            setServerWaking(false);
            if (error?.name === "AbortError") {
                showMessage(
                    "Request timed out. The server is waking up — please try again in 30 seconds.",
                    true
                );
            } else if (error?.message?.includes("Failed to fetch")) {
                showMessage("Cannot reach server. Is the backend running?", true);
            } else {
                showMessage("Server error. Please try again later.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: #010103;
                    overflow-x: hidden;
                }

                .login-container {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: radial-gradient(circle at 20% 30%, #0a0a1a, #000000);
                }

                .crewholic-card {
                    width: 100%;
                    max-width: 460px;
                    background: rgba(8, 8, 18, 0.75);
                    backdrop-filter: blur(20px);
                    border-radius: 2rem;
                    border: 1px solid rgba(155, 81, 224, 0.2);
                    box-shadow:
                        0 30px 50px -20px rgba(0,0,0,0.8),
                        0 0 0 0.5px rgba(155,81,224,0.15) inset;
                    padding: 2.5rem 2rem;
                }

                .brand-wrapper { text-align: center; margin-bottom: 2rem; }

                .logo-circle {
                    width: 88px; height: 88px;
                    margin: 0 auto 1rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #9B51E0, #F2994A);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 24px -8px rgba(155,81,224,0.4);
                }

                .logo-circle img { width: 70%; height: 70%; object-fit: contain; }

                .brand-title {
                    font-size: 2rem; font-weight: 800;
                    background: linear-gradient(120deg, #FFFFFF, #D7E2EA);
                    -webkit-background-clip: text;
                    color: transparent;
                    margin-bottom: 0.25rem;
                }

                .brand-tagline {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #9B51E0;
                    font-weight: 500;
                    opacity: 0.8;
                }

                .form-heading { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #F5F7FF; }

                .form-subheading {
                    color: #9aa4bf; font-size: 0.85rem;
                    margin-bottom: 1.8rem;
                    border-left: 2px solid #F2994A;
                    padding-left: 12px;
                }

                .input-group-modern { position: relative; margin-bottom: 1.25rem; }

                .input-icon {
                    position: absolute; left: 18px; top: 50%;
                    transform: translateY(-50%);
                    color: #9B51E0; font-size: 1rem;
                    z-index: 2; opacity: 0.7; pointer-events: none;
                }

                .form-control-modern {
                    width: 100%;
                    background: rgba(20, 22, 40, 0.7);
                    border: 1px solid rgba(155, 81, 224, 0.3);
                    border-radius: 44px;
                    padding: 0.9rem 3rem 0.9rem 2.8rem;
                    font-size: 0.95rem; font-weight: 500;
                    color: white; outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .form-control-modern::placeholder { color: rgba(154, 164, 191, 0.6); }

                .form-control-modern:focus {
                    border-color: #F2994A;
                    box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.25);
                }

                .form-control-modern:disabled { opacity: 0.5; cursor: not-allowed; }

                .password-toggle-btn {
                    position: absolute; right: 16px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none;
                    padding: 4px 6px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; transition: background 0.2s; z-index: 3;
                }

                .password-toggle-btn:hover { background: rgba(242, 153, 74, 0.12); }

                .password-toggle-btn svg {
                    width: 18px; height: 18px;
                    color: rgba(154, 164, 191, 0.6);
                    transition: color 0.2s; display: block;
                }

                .password-toggle-btn:hover svg { color: #F2994A; }

                .forgot-link-wrapper { text-align: right; margin: -0.2rem 0 1.5rem 0; }

                .forgot-link { font-size: 0.75rem; color: #F2994A; text-decoration: none; transition: opacity 0.2s; }
                .forgot-link:hover { opacity: 0.75; }

                .login-btn {
                    background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
                    border: none; width: 100%; padding: 0.9rem 0;
                    border-radius: 60px; font-weight: 700; font-size: 1rem; color: white;
                    display: flex; align-items: center; justify-content: center;
                    gap: 8px; cursor: pointer;
                    transition: opacity 0.2s, transform 0.1s;
                }

                .login-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
                .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* FIX 7: Server waking banner */
                .server-waking-banner {
                    margin-top: 0.75rem;
                    padding: 10px 16px;
                    background: rgba(242, 153, 74, 0.1);
                    border: 1px solid rgba(242, 153, 74, 0.3);
                    border-radius: 12px;
                    font-size: 0.78rem;
                    color: #F2994A;
                    text-align: center;
                    line-height: 1.5;
                }

                .divider-modern {
                    display: flex; align-items: center;
                    gap: 12px; color: #4b5575;
                    font-size: 0.7rem; margin: 1.5rem 0;
                }

                .divider-line {
                    flex: 1; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(155,81,224,0.4), transparent);
                }

                .google-btn-wrapper {
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                    min-height: 44px;
                    align-items: center;
                }

                .signup-wrapper { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #9aa4bf; }

                .signup-link {
                    color: #F2994A; font-weight: 700;
                    text-decoration: none; margin-left: 6px;
                    transition: opacity 0.2s;
                }

                .signup-link:hover { opacity: 0.75; }

                .toast-message {
                    position: fixed; bottom: 2rem; left: 50%;
                    transform: translateX(-50%);
                    background: rgba(10, 10, 25, 0.95);
                    padding: 12px 28px; border-radius: 60px;
                    font-weight: 500; font-size: 0.85rem;
                    border-left: 4px solid #F2994A;
                    color: white; z-index: 9999;
                    white-space: nowrap;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    animation: slideUp 0.3s ease;
                }

                .toast-message.error { border-left-color: #ff5e5e; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .crewholic-card { padding: 1.8rem 1.5rem; }
                    .brand-title { font-size: 1.75rem; }
                    .toast-message {
                        white-space: normal; text-align: center;
                        width: 90%; bottom: 1rem;
                    }
                }
            `}</style>

            <div className="login-container">
                <div className="crewholic-card">

                    <div className="brand-wrapper">
                        <div className="logo-circle">
                            <img src={logo} alt="CREWHOLIC Logo" />
                        </div>
                        <h1 className="brand-title">CREWHOLIC</h1>
                        <p className="brand-tagline">Fusion-Powered Digital Agency</p>
                    </div>

                    <h2 className="form-heading">Welcome back</h2>
                    <p className="form-subheading">Sign in to continue your journey</p>

                    <form onSubmit={handleLogin}>

                        <div className="input-group-modern">
                            <i className="fas fa-envelope input-icon" />
                            <input
                                type="email"
                                className="form-control-modern"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="input-group-modern">
                            <i className="fas fa-lock input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control-modern"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="forgot-link-wrapper">
                            <a href="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <svg style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    {serverWaking ? "Waking server..." : "Signing in..."}
                                </>
                            ) : (
                                "Sign In →"
                            )}
                        </button>

                        {/* FIX 7: Friendly cold-start message */}
                        {serverWaking && (
                            <div className="server-waking-banner">
                                ⏳ Server is starting up (free tier).
                                <br />This may take up to 30 seconds on first login.
                            </div>
                        )}
                    </form>

                    <div className="divider-modern">
                        <span className="divider-line" />
                        <span>OR</span>
                        <span className="divider-line" />
                    </div>

                    <div className="google-btn-wrapper">
                        <div id="googleLoginBtn" />
                    </div>

                    <div className="signup-wrapper">
                        Don&apos;t have an account?
                        <Link to="/signup" className="signup-link">Sign Up</Link>
                    </div>
                </div>
            </div>

            {toastMessage && (
                <div className={`toast-message ${toastMessage.isError ? "error" : ""}`}>
                    {toastMessage.text}
                </div>
            )}
        </>
    );
}

export default LoginPage;