/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "../components/portfolio/skr.png";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

declare const google: any;

const API_URL =
    import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com/api";

const GOOGLE_CLIENT_ID =
    "558245818414-enstkh3b5cdrcvvdrms8njnvp7fhrch6.apps.googleusercontent.com";

const ADMIN_ROLES = [
    "main_admin",
    "event_admin",
    "finance_admin",
    "marketing_admin",
    "rental_admin",
    "web_admin",
];

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        loadGoogleScript();
    }, []);

    const showMessage = (text: string, isError = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const role = localStorage.getItem("role");
    const redirectAfterLogin = (user: any) => {
    switch (role) {
        case "main_admin":
            navigate({ to: "/admin" });
            break;

        case "event_admin":
            navigate({ to: "/event" });
            break;

        case "finance_admin":
            navigate({ to: "/finance" });
            break;

        case "marketing_admin":
            navigate({ to: "/marketing" });
            break;

        case "rental_admin":
            navigate({ to: "/rental" });
            break;

        case "web_admin":
            navigate({ to: "/webpanel" });
            break;

        default:
            navigate({ to: "/dashboard" });
    }
    };

    const loadGoogleScript = () => {
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            setTimeout(initializeGoogleOAuth, 500);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleOAuth;
        document.body.appendChild(script);
    };

    const initializeGoogleOAuth = () => {
        if (typeof google === "undefined") {
            console.error("Google Identity Services not loaded");
            return;
        }

        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        const googleBtn = document.getElementById("googleLoginBtn");

        if (googleBtn) {
            googleBtn.innerHTML = "";

            google.accounts.id.renderButton(googleBtn, {
                theme: "filled_black",
                size: "large",
                width: 300,
                text: "signin_with",
                shape: "pill",
            });
        }
    };

    const handleGoogleCredentialResponse = async (response: any) => {
        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: response.credential,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || "Google login failed", true);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token || "");
            localStorage.setItem("role", data.user?.role || "user");
            localStorage.setItem(
                "permissions",
                JSON.stringify(data.user?.permissions || [])
            );

            showMessage("Google login successful");

            setTimeout(() => {
                redirectAfterLogin(data.user);
            }, 800);
        } catch (error) {
            console.error(error);
            showMessage("Google login failed. Please try again.", true);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showMessage("Please fill in all fields", true);
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
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || "Login failed. Please check your credentials.", true);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token || "");
            localStorage.setItem("role", data.user?.role || "user");
            localStorage.setItem(
                "permissions",
                JSON.stringify(data.user?.permissions || [])
            );

            showMessage("Login successful");

            setTimeout(() => {
                redirectAfterLogin(data.user);
            }, 800);
        } catch (error) {
            console.error(error);
            showMessage("Server error. Please try again later.", true);
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
        }

        .form-control-modern:focus {
          border-color: #F2994A;
          box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.25);
        }

        .password-toggle {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(215, 226, 234, 0.6);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .forgot-link-wrapper {
          text-align: right;
          margin: -0.2rem 0 1.5rem 0;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #F2994A;
          text-decoration: none;
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
        }

        .toast-message {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          padding: 12px 28px;
          border-radius: 60px;
          font-weight: 500;
          font-size: 0.85rem;
          border-left: 4px solid #F2994A;
          color: white;
          z-index: 9999;
        }

        .toast-message.error {
          border-left-color: #ff5e5e;
        }

        @media (max-width: 480px) {
          .crewholic-card {
            padding: 1.8rem 1.5rem;
          }

          .brand-title {
            font-size: 1.75rem;
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