/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "../components/portfolio/skr.png";

export const Route = createFileRoute("/forgot-password")({
    component: ForgotPasswordPage,
});

const API_URL =
    import.meta.env.VITE_API_URL || "https://crewholic-1-if9w.onrender.com";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [toastMessage, setToastMessage] = useState<{
        text: string;
        isError: boolean;
    } | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const showMessage = (text: string, isError = false) => {
        setToastMessage({ text, isError });
        setTimeout(() => setToastMessage(null), 4000);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            showMessage("Please enter your email address.", true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address.", true);
            return;
        }

        try {
            setLoading(true);
            
            const res = await fetch(`${API_URL}/api/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                showMessage(`Server error (${res.status}). Please try again later.`, true);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || data.error || "Failed to send OTP. Please try again.", true);
                return;
            }

            showMessage("OTP sent to your email! Please check your inbox.");
            setOtpSent(true);
            setCountdown(60);
        } catch (error: any) {
            console.error("Send OTP error:", error);
            if (error?.message?.includes("Failed to fetch")) {
                showMessage("Cannot reach server. Is the backend running?", true);
            } else {
                showMessage("Server error. Please try again later.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!otp.trim()) {
            showMessage("Please enter the OTP sent to your email.", true);
            return;
        }

        if (otp.length !== 6) {
            showMessage("Please enter a valid 6-digit OTP.", true);
            return;
        }

        if (!newPassword) {
            showMessage("Please enter a new password.", true);
            return;
        }

        if (newPassword.length < 6) {
            showMessage("Password must be at least 6 characters long.", true);
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage("Passwords do not match.", true);
            return;
        }

        try {
            setLoading(true);
            
            const res = await fetch(`${API_URL}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword: newPassword,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                showMessage(`Server error (${res.status}). Please try again later.`, true);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || data.error || "Failed to reset password. Please try again.", true);
                return;
            }

            showMessage("Password reset successful! Redirecting to login...");
            setResetComplete(true);
            
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (error: any) {
            console.error("Reset password error:", error);
            if (error?.message?.includes("Failed to fetch")) {
                showMessage("Cannot reach server. Is the backend running?", true);
            } else {
                showMessage("Server error. Please try again later.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (countdown > 0) {
            showMessage(`Please wait ${countdown} seconds before resending.`, true);
            return;
        }

        try {
            setLoading(true);
            
            const res = await fetch(`${API_URL}/api/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                showMessage(`Server error (${res.status}). Please try again later.`, true);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.msg || data.error || "Failed to resend OTP. Please try again.", true);
                return;
            }

            showMessage("New OTP sent to your email!");
            setCountdown(60);
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            showMessage("Failed to resend OTP. Please try again.", true);
        } finally {
            setLoading(false);
        }
    };

    if (resetComplete) {
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

                    .reset-container {
                        position: relative;
                        min-height: 100vh;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        background: radial-gradient(circle at 20% 30%, #0a0a1a, #000000);
                    }

                    .success-card {
                        width: 100%;
                        max-width: 460px;
                        background: rgba(8, 8, 18, 0.75);
                        backdrop-filter: blur(20px);
                        border-radius: 2rem;
                        border: 1px solid rgba(155, 81, 224, 0.2);
                        box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8);
                        padding: 2.5rem 2rem;
                        text-align: center;
                    }

                    .success-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }

                    .success-title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #F5F7FF;
                        margin-bottom: 0.5rem;
                    }

                    .success-message {
                        color: #9aa4bf;
                        font-size: 0.85rem;
                        margin-bottom: 1.5rem;
                    }

                    .login-link {
                        display: inline-block;
                        background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
                        border: none;
                        padding: 0.9rem 2rem;
                        border-radius: 60px;
                        font-weight: 700;
                        font-size: 1rem;
                        color: white;
                        text-decoration: none;
                        transition: opacity 0.2s;
                    }

                    .login-link:hover {
                        opacity: 0.9;
                    }
                `}</style>
                <div className="reset-container">
                    <div className="success-card">
                        <div className="success-icon">✓</div>
                        <h2 className="success-title">Password Reset Successful!</h2>
                        <p className="success-message">Your password has been updated. Redirecting you to login...</p>
                        <Link to="/login" className="login-link">Go to Login →</Link>
                    </div>
                </div>
            </>
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

                .forgot-container {
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

                .otp-input-group {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .otp-input {
                    flex: 1;
                }

                .resend-btn {
                    background: rgba(155, 81, 224, 0.2);
                    border: 1px solid rgba(155, 81, 224, 0.4);
                    border-radius: 44px;
                    padding: 0.9rem 1.2rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #9B51E0;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .resend-btn:hover:not(:disabled) {
                    background: rgba(155, 81, 224, 0.3);
                    border-color: #9B51E0;
                }

                .resend-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .reset-btn {
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
                    margin-top: 0.5rem;
                }

                .reset-btn:hover:not(:disabled) {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .reset-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .back-link-wrapper {
                    text-align: center;
                    margin-top: 1.5rem;
                }

                .back-link {
                    color: #9aa4bf;
                    font-size: 0.85rem;
                    text-decoration: none;
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .back-link:hover {
                    color: #F2994A;
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

                    .otp-input-group {
                        flex-direction: column;
                    }

                    .resend-btn {
                        width: 100%;
                    }

                    .toast-message {
                        white-space: normal;
                        text-align: center;
                        width: 90%;
                        bottom: 1rem;
                    }
                }
            `}</style>

            <div className="forgot-container">
                <div className="crewholic-card">
                    <div className="brand-wrapper">
                        <div className="logo-circle">
                            <img src={logo} alt="CREWHOLIC Logo" />
                        </div>
                        <h1 className="brand-title">CREWHOLIC</h1>
                        <p className="brand-tagline">Fusion-Powered Digital Agency</p>
                    </div>

                    <h2 className="form-heading">
                        {!otpSent ? "Forgot Password?" : "Reset Your Password"}
                    </h2>
                    <p className="form-subheading">
                        {!otpSent 
                            ? "Enter your email to receive a verification code" 
                            : "Enter the OTP sent to your email and create a new password"}
                    </p>

                    {!otpSent ? (
                        <form onSubmit={handleSendOTP}>
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

                            <button type="submit" className="reset-btn" disabled={loading}>
                                {loading ? "Sending..." : "Send OTP →"}
                            </button>

                            <div className="back-link-wrapper">
                                <Link to="/login" className="back-link">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div className="input-group-modern">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    className="form-control-modern"
                                    placeholder="Email address"
                                    value={email}
                                    disabled={true}
                                    style={{ opacity: 0.7 }}
                                />
                            </div>

                            <div className="input-group-modern otp-input-group">
                                <div style={{ flex: 1, position: "relative" }}>
                                    <i className="fas fa-key input-icon"></i>
                                    <input
                                        type="text"
                                        className="form-control-modern otp-input"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        required
                                        disabled={loading}
                                        maxLength={6}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="resend-btn"
                                    onClick={resendOTP}
                                    disabled={loading || countdown > 0}
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                                </button>
                            </div>

                            <div className="input-group-modern">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className="form-control-modern"
                                    placeholder="New password (min. 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <i
                                    className={`fas ${showNewPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                ></i>
                            </div>

                            <div className="input-group-modern">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-control-modern"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <i
                                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                ></i>
                            </div>

                            <button type="submit" className="reset-btn" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password →"}
                            </button>

                            <div className="back-link-wrapper">
                                <Link to="/login" className="back-link">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
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

export default ForgotPasswordPage;