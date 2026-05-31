/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "../components/portfolio/skr.png"; 

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userName, setUserName] = useState("");
    const [redirectUrl, setRedirectUrl] = useState("");
    const [toastMessage, setToastMessage] = useState<{ text: string; isError: boolean } | null>(null);

    const API_URL = "https://crewholic-2.onrender.com/api";
    const GOOGLE_CLIENT_ID = "558245818414-enstkh3b5cdrcvvdrms8njnvp7fhrch6.apps.googleusercontent.com";

    useEffect(() => {
        createParticles();
        checkExistingSession();
        loadGoogleScript();
    }, []);

    const loadGoogleScript = () => {
        if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            initializeGoogleOAuth();
            return;
        }

        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => initializeGoogleOAuth();
        document.body.appendChild(script);
    };

    const initializeGoogleOAuth = () => {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true
            });

            const googleBtn = document.getElementById("googleLoginBtn");
            if (googleBtn) {
                google.accounts.id.renderButton(
                    googleBtn,
                    {
                        theme: "filled_black",
                        size: "large",
                        width: 300,
                        text: "signin_with",
                        shape: "pill"
                    }
                );
            }
        } else {
            console.error("Google Identity Services not loaded");
            setTimeout(initializeGoogleOAuth, 500);
        }
    };

    const handleGoogleCredentialResponse = async (response: any) => {
        setLoading(true);

        try {
            const backendResponse = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: response.credential,
                    client_id: GOOGLE_CLIENT_ID
                })
            });

            const data = await backendResponse.json();

            if (backendResponse.ok && data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));

                let redirectPage = "user-dashboard.html";
                let roleTitle = "User";

                if (data.user.role === "super_admin" || data.user.role === "admin") {
                    redirectPage = "admin-dashboard.html";
                    roleTitle = "Admin";
                } else if (data.user.role === "rental_admin") {
                    redirectPage = "rental-admin.html";
                    roleTitle = "Rental Admin";
                } else if (data.user.role === "finance_admin") {
                    redirectPage = "finance-dashboard.html";
                    roleTitle = "Finance Admin";
                } else if (data.user.role === "webdev_admin") {
                    redirectPage = "web-admin.html";
                    roleTitle = "Web Dev Admin";
                } else if (data.user.role === "marketing_admin") {
                    redirectPage = "marketing-admin.html";
                    roleTitle = "Marketing Admin";
                } else if (data.user.role === "event_admin") {
                    redirectPage = "event-admin.html";
                    roleTitle = "Event Admin";
                }

                showSuccessAndRedirect(`Welcome ${roleTitle}!`, data.user.name, redirectPage);
            } else {
                throw new Error(data.msg || "Google authentication failed");
            }
        } catch (error: any) {
            console.error("Google OAuth Error:", error);
            showMessage(error.message || "Google Sign-In failed. Please try again.", true);
            setLoading(false);
        }
    };

    const showSuccessAndRedirect = (message: string, name: string, redirect: string) => {
        setSuccessMessage(message);
        setUserName(name);
        setRedirectUrl(redirect);
        setShowSuccess(true);

        setTimeout(() => {
            window.location.href = redirect;
        }, 2000);
    };

    const showMessage = (message: string, isError: boolean = false) => {
        setToastMessage({ text: message, isError });
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const checkExistingSession = () => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            const userData = JSON.parse(user);
            let redirectPage = "user-dashboard.html";

            if (userData.role === "super_admin") redirectPage = "admin-dashboard.html";
            else if (userData.role === "rental_admin") redirectPage = "rental-admin.html";
            else if (userData.role === "finance_admin") redirectPage = "finance-dashboard.html";
            else if (userData.role === "webdev_admin") redirectPage = "web-admin.html";
            else if (userData.role === "marketing_admin") redirectPage = "marketing-admin.html";
            else if (userData.role === "event_admin") redirectPage = "event-admin.html";
            else if (userData.role === "admin") redirectPage = "admin-dashboard.html";

            window.location.href = redirectPage;
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showMessage('Please fill in all fields', true);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));

                let redirectPage = "user-dashboard.html";
                let roleTitle = "";

                if (data.user.role === "super_admin") {
                    redirectPage = "admin-dashboard.html";
                    roleTitle = "Super Admin";
                }
                else if (data.user.role === "rental_admin") {
                    redirectPage = "rental-admin.html";
                    roleTitle = "Rental Admin";
                }
                else if (data.user.role === "finance_admin") {
                    redirectPage = "finance-dashboard.html";
                    roleTitle = "Finance Admin";
                }
                else if (data.user.role === "webdev_admin") {
                    redirectPage = "web-admin.html";
                    roleTitle = "Web Development Admin";
                }
                else if (data.user.role === "marketing_admin") {
                    redirectPage = "marketing-admin.html";
                    roleTitle = "Marketing Admin";
                }
                else if (data.user.role === "event_admin") {
                    redirectPage = "event-admin.html";
                    roleTitle = "Event Admin";
                }
                else if (data.user.role === "admin") {
                    redirectPage = "admin-dashboard.html";
                    roleTitle = "Admin";
                }
                else {
                    redirectPage = "user-dashboard.html";
                    roleTitle = "User";
                }

                const message = `Welcome ${roleTitle}!`;
                showSuccessAndRedirect(message, data.user.name, redirectPage);
            } else {
                showMessage(data.msg || 'Login failed. Please check your credentials.', true);
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            showMessage('Server error. Please try again later.', true);
            setLoading(false);
        }
    };

    const createParticles = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;

            particlesContainer.appendChild(particle);
        }
    };

    if (showSuccess) {
        return (
            <div className="success-overlay">
                <div className="success-card">
                    <div className="success-check">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h2>{successMessage}</h2>
                    <p>Welcome back, {userName}! Redirecting you to CREWHOLIC...</p>
                    <div className="success-spinner"></div>
                </div>
            </div>
        );
    }

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

                /* Particles Animation */
                .particles {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                }

                .particle {
                    position: absolute;
                    background: linear-gradient(135deg, #9B51E0, #F2994A);
                    border-radius: 50%;
                    opacity: 0.15;
                    animation: floatParticle linear infinite;
                }

                @keyframes floatParticle {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    15% {
                        opacity: 0.15;
                    }
                    85% {
                        opacity: 0.15;
                    }
                    100% {
                        transform: translateY(-20vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                /* Main Container */
                .login-container {
                    position: relative;
                    z-index: 10;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: radial-gradient(circle at 20% 30%, #0a0a1a, #000000);
                }

                /* Glass Card */
                .crewholic-card {
                    width: 100%;
                    max-width: 460px;
                    background: rgba(8, 8, 18, 0.75);
                    backdrop-filter: blur(20px);
                    border-radius: 2rem;
                    border: 1px solid rgba(155, 81, 224, 0.2);
                    box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(155,81,224,0.15) inset;
                    padding: 2.5rem 2rem;
                    transition: transform 0.2s ease;
                }

                /* Brand Section */
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
                    transition: transform 0.3s ease;
                }

                .logo-circle:hover {
                    transform: scale(1.05);
                }

                .logo-circle img {
                    width: 70%;
                    height: 70%;
                    object-fit: contain;
                }

                .brand-title {
                    font-size: 2rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    background: linear-gradient(120deg, #FFFFFF, #D7E2EA);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    margin-bottom: 0.25rem;
                }

                .brand-tagline {
                    font-size: 0.75rem;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                    color: #9B51E0;
                    font-weight: 500;
                    opacity: 0.8;
                }

                /* Form Headings */
                .form-heading {
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: -0.3px;
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

                /* Input Fields */
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
                    transition: all 0.2s;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                }

                .form-control-modern:focus {
                    border-color: #F2994A;
                    box-shadow: 0 0 0 3px rgba(242, 153, 74, 0.25);
                    background: rgba(15, 17, 32, 0.9);
                }

                .form-control-modern::placeholder {
                    color: rgba(215, 226, 234, 0.45);
                    font-weight: 400;
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
                    z-index: 2;
                }

                .password-toggle:hover {
                    color: #F2994A;
                }

                /* Forgot Password */
                .forgot-link-wrapper {
                    text-align: right;
                    margin: -0.2rem 0 1.5rem 0;
                }

                .forgot-link {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #F2994A;
                    text-decoration: none;
                    border-bottom: 1px dashed rgba(242,153,74,0.4);
                }

                /* Login Button */
                .login-btn {
                    background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
                    border: none;
                    width: 100%;
                    padding: 0.9rem 0;
                    border-radius: 60px;
                    font-weight: 700;
                    font-size: 1rem;
                    color: white;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.25s ease;
                    cursor: pointer;
                    box-shadow: 0 6px 14px rgba(155,81,224,0.25);
                }

                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(155,81,224,0.35);
                }

                .login-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Divider */
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

                /* Google Button */
                .google-btn-wrapper {
                    margin: 0 0 1rem 0;
                }

                .google-btn {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(215, 226, 234, 0.2);
                    border-radius: 60px;
                    padding: 0.7rem 0;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-weight: 600;
                    color: #D7E2EA;
                    transition: all 0.2s;
                    cursor: pointer;
                    min-height: 46px;
                }

                .google-btn:hover {
                    background: rgba(155, 81, 224, 0.2);
                    border-color: #9B51E0;
                }

                /* Signup Link */
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
                    border-bottom: 1px solid rgba(242,153,74,0.5);
                }

                /* Toast Message */
                .toast-message {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(16px);
                    padding: 12px 28px;
                    border-radius: 60px;
                    font-weight: 500;
                    font-size: 0.85rem;
                    border-left: 4px solid #F2994A;
                    color: white;
                    z-index: 200;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
                    letter-spacing: 0.2px;
                    white-space: nowrap;
                }

                /* Success Overlay */
                .success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(24px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.4s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; backdrop-filter: blur(0); }
                    to { opacity: 1; backdrop-filter: blur(24px); }
                }

                .success-card {
                    text-align: center;
                    background: rgba(8, 8, 18, 0.9);
                    backdrop-filter: blur(20px);
                    border-radius: 2rem;
                    border: 1px solid rgba(155,81,224,0.3);
                    padding: 3rem 2rem;
                    max-width: 400px;
                    animation: slideUp 0.5s ease;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .success-check {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: linear-gradient(135deg, #9B51E0, #F2994A);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .success-check i {
                    font-size: 3rem;
                    color: white;
                }

                .success-card h2 {
                    color: white;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                }

                .success-card p {
                    color: #b7bee8;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }

                .success-spinner {
                    width: 40px;
                    height: 40px;
                    margin: 0 auto;
                    border: 3px solid rgba(155,81,224,0.3);
                    border-top-color: #F2994A;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .crewholic-card {
                        padding: 1.8rem 1.5rem;
                        margin: 0 1rem;
                    }
                    
                    .brand-title {
                        font-size: 1.75rem;
                    }
                    
                    .toast-message {
                        white-space: normal;
                        text-align: center;
                        max-width: 90%;
                    }
                }
            `}</style>

            <div className="particles" id="particles"></div>

            <div className="login-container">
                <div className="crewholic-card">
                    <div className="brand-wrapper">
                        <div className="logo-circle">
                            <img
                                src={logo}
                                alt="CREWHOLIC Logo"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%239B51E0'/%3E%3Cstop offset='100%25' stop-color='%23F2994A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='50' y='68' text-anchor='middle' font-size='32' fill='white' font-weight='bold'%3EC%3C/text%3E%3C/svg%3E";
                                }}
                            />
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
                                onClick={togglePassword}
                            ></i>
                        </div>

                        <div className="forgot-link-wrapper">
                            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : null}
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <i className="fas fa-arrow-right"></i>}
                        </button>
                    </form>

                    <div className="divider-modern">
                        <span className="divider-line"></span>
                        <span>OR</span>
                        <span className="divider-line"></span>
                    </div>

                    <div className="google-btn-wrapper">
                        <div id="googleLoginBtn" className="google-btn">
                            <i className="fab fa-google"></i> Continue with Google
                        </div>
                    </div>

                    <div className="signup-wrapper">
                        Don't have an account?
                        <Link to="/signup" className="signup-link">Sign Up</Link>
                    </div>
                </div>
            </div>

            {toastMessage && (
                <div className="toast-message" style={toastMessage.isError ? { borderLeftColor: '#ff5e5e' } : {}}>
                    <i className={`fas ${toastMessage.isError ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i>
                    {toastMessage.text}
                </div>
            )}
        </>
    );
}