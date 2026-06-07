/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
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
    import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com/api";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const googleInitialized = useRef(false);
    const googleScriptLoaded = useRef(false);

    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        // FIX: Add meta tag for Cross-Origin-Opener-Policy compatibility
        const existingMeta = document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]');
        if (!existingMeta) {
            const meta = document.createElement("meta");
            meta.setAttribute("http-equiv", "Cross-Origin-Opener-Policy");
            meta.setAttribute("content", "same-origin-allow-popups");
            document.head.appendChild(meta);
        }

        const timer = setTimeout(() => {
            loadGoogleScript();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const showMessage = (text: string, isError = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const getRedirectPath = (user: any) => {
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
        window.location.href = getRedirectPath(user);
    };

    const loadGoogleScript = () => {
        if (!GOOGLE_CLIENT_ID) {
            showMessage("Google Client ID missing. Check Frontend .env file.", true);
            return;
        }

        // FIX: Prevent duplicate script loading
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
            showMessage("Google script failed to load. Check your internet connection.", true);
        };

        document.body.appendChild(script);
    };

    const waitForGoogleAndInitialize = () => {
        let count = 0;

        const interval = setInterval(() => {
            count++;

            if (window.google?.accounts?.id) {
                clearInterval(interval);
                initializeGoogleOAuth();
            }

            if (count > 30) {
                clearInterval(interval);
                showMessage(
                    "Google Sign-In failed to load. Please refresh the page.",
                    true
                );
            }
        }, 200);
    };

    const initializeGoogleOAuth = () => {
        if (googleInitialized.current) return;

        const googleBtn = document.getElementById("googleLoginBtn");

        if (!googleBtn) {
            showMessage("Google button container not found", true);
            return;
        }

        googleInitialized.current = true;
        googleBtn.innerHTML = "";

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                // FIX: Use "popup" UX mode to avoid COOP/postMessage issues
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
            showMessage(
                "Google Sign-In could not initialize. Make sure localhost:3000 is added in Google Cloud Console.",
                true
            );
        }
    };

    const saveLoginData = (data: any) => {
        const user = data.user || {};
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("role", user?.role || "user");
        localStorage.setItem("permissions", JSON.stringify(user?.permissions || []));
    };

    const handleGoogleCredentialResponse = async (response: any) => {
        try {
            setLoading(true);

            if (!response?.credential) {
                showMessage("Google credential missing. Please try again.", true);
                return;
            }

            const res = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: response.credential,
                }),
            });

            // FIX: Handle non-JSON responses gracefully (e.g. 500 HTML error pages)
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
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
            console.error("Google login error:", error);
            if (error?.message?.includes("NetworkError") || error?.message?.includes("Failed to fetch")) {
                showMessage("Network error. Check your connection or backend server.", true);
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

            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                }),
            });

            // FIX: Safe JSON parsing
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
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
            console.error("Login error:", error);
            if (error?.message?.includes("Failed to fetch")) {
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

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
          box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(155,81,224,0.15) inset;
          padding: 2.5rem 2rem;
        }

        .brand-wrapper {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-circle {
          width: 88px;
          height: 88px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #9B51E0, #F2994A);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 24px -8px rgba(155,81,224,0.4);
        }

        .logo-circle img {
          width: 70%;
          height: 70%;
          object-fit: contain;
        }

        .brand-title {
          font-size: 2rem;
          font-weight: 800;
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

        .form-heading {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #F5F7FF;
        }

        .form-subheading {
          color: #9aa4bf;
          font-size: 0.85rem;
          margin-bottom: 1.8rem;
          border-left: 2px solid #F2994A;
          padding-left: 12px;
        }

        .input-group-modern {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #9B51E0;
          font-size: 1rem;
          z-index: 2;
          opacity: 0.7;
        }

        .form-control-modern {
          width: 100%;
          background: rgba(20, 22, 40, 0.7);
          border: 1px solid rgba(155, 81, 224, 0.3);
          border-radius: 44px;
          padding: 0.9rem 1rem 0.9rem 2.8rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-control-modern::placeholder {
          color: rgba(154, 164, 191, 0.6);
        }

        .form-control-modern:focus {
          border-color: #F2994A;
          box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.25);
        }

        .form-control-modern:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(215, 226, 234, 0.6);
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #F2994A;
        }

        .forgot-link-wrapper {
          text-align: right;
          margin: -0.2rem 0 1.5rem 0;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #F2994A;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .forgot-link:hover {
          opacity: 0.75;
        }

        .login-btn {
          background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
          border: none;
          width: 100%;
          padding: 0.9rem 0;
          border-radius: 60px;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .divider-modern {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #4b5575;
          font-size: 0.7rem;
          margin: 1.5rem 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(155,81,224,0.4), transparent);
        }

        .google-btn-wrapper {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          min-height: 44px;
          align-items: center;
        }

        /* FIX: Notice banner for Google Cloud Console setup */
        .google-notice {
          background: rgba(155, 81, 224, 0.08);
          border: 1px solid rgba(155, 81, 224, 0.25);
          border-radius: 12px;
          padding: 10px 14px;
          margin-bottom: 1rem;
          font-size: 0.75rem;
          color: #9aa4bf;
          line-height: 1.5;
          display: none;
        }

        .signup-wrapper {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #9aa4bf;
        }

        .signup-link {
          color: #F2994A;
          font-weight: 700;
          text-decoration: none;
          margin-left: 6px;
          transition: opacity 0.2s;
        }

        .signup-link:hover {
          opacity: 0.75;
        }

        .toast-message {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(10, 10, 25, 0.95);
          padding: 12px 28px;
          border-radius: 60px;
          font-weight: 500;
          font-size: 0.85rem;
          border-left: 4px solid #F2994A;
          color: white;
          z-index: 9999;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: slideUp 0.3s ease;
        }

        .toast-message.error {
          border-left-color: #ff5e5e;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 480px) {
          .crewholic-card {
            padding: 1.8rem 1.5rem;
          }

          .brand-title {
            font-size: 1.75rem;
          }

          .toast-message {
            white-space: normal;
            text-align: center;
            width: 90%;
            bottom: 1rem;
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
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                className="form-control-modern"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group-modern">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control-modern"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <i
                                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        <div className="forgot-link-wrapper">
                            <a href="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </form>

                    <div className="divider-modern">
                        <span className="divider-line"></span>
                        <span>OR</span>
                        <span className="divider-line"></span>
                    </div>

                    <div className="google-btn-wrapper">
                        <div id="googleLoginBtn"></div>
                    </div>

                    <div className="signup-wrapper">
                        Don't have an account?
                        <Link to="/signup" className="signup-link">
                            Sign Up
                        </Link>
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