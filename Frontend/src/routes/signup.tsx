/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "../components/portfolio/skr.png";

export const Route = createFileRoute("/signup")({
    component: SignupPage,
});

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://crewholic-0jht.onrender.com/api";

function SignupPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [emailVerified, setEmailVerified] = useState(false);
    const [showEmailOTP, setShowEmailOTP] = useState(false);
    const [emailOTP, setEmailOTP] = useState("");
    const [emailOTPLoading, setEmailOTPLoading] = useState(false);

    const [passwordError, setPasswordError] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(pass)) return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(pass)) return "Password must contain at least one special character (!@#$%^&*)";
        return "";
    };

    const sendEmailOTP = async () => {
        if (!email) {
            alert("Please enter email address first");
            return;
        }

        try {
            setEmailOTPLoading(true);

            const res = await fetch(`${API_BASE_URL}/otp/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to send email OTP");
                return;
            }

            setShowEmailOTP(true);
            alert("OTP sent to your email");
        } catch (error) {
            console.error(error);
            alert("Something went wrong while sending email OTP");
        } finally {
            setEmailOTPLoading(false);
        }
    };

    const verifyEmailOTP = async () => {
        if (!emailOTP) {
            alert("Please enter email OTP");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/otp/verify-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp: emailOTP,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Invalid email OTP");
                return;
            }

            setEmailVerified(true);
            setShowEmailOTP(false);
            setEmailOTP("");
            alert("Email verified successfully");
        } catch (error) {
            console.error(error);
            alert("Something went wrong while verifying email OTP");
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        const passwordStrengthError = validatePassword(password);
        if (passwordStrengthError) {
            setPasswordError(passwordStrengthError);
            return;
        }

        setPasswordError("");

        if (!emailVerified) {
            alert("Please verify your email address first");
            return;
        }

        if (!agreeTerms) {
            alert("Please agree to the Terms of Service and Privacy Policy");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    emailVerified,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            // Store user info for welcome message
            localStorage.setItem("token", data.token || "dummy-token");
            localStorage.setItem("user", JSON.stringify({ name: fullName, email }));

            // Navigate to home page with welcome message
            navigate({
            to: "/",
            search: {
                welcome: "true",
                name: fullName,
            },
            });
                    } catch (error) {
            console.error(error);
            alert("Something went wrong while creating account");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (emailVerified) setShowEmailOTP(false);
    }, [emailVerified]);

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

                .particles-signup {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                }

                .particle-signup {
                    position: absolute;
                    background: linear-gradient(135deg, #9B51E0, #F2994A);
                    border-radius: 50%;
                    opacity: 0.12;
                    animation: floatParticle linear infinite;
                }

                @keyframes floatParticle {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    15% {
                        opacity: 0.12;
                    }
                    85% {
                        opacity: 0.12;
                    }
                    100% {
                        transform: translateY(-20vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                .signup-container {
                    position: relative;
                    z-index: 10;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background: radial-gradient(circle at 20% 30%, #0a0a1a, #000000);
                }

                .crewholic-card-signup {
                    width: 100%;
                    max-width: 520px;
                    background: rgba(8, 8, 18, 0.75);
                    backdrop-filter: blur(20px);
                    border-radius: 2rem;
                    border: 1px solid rgba(155, 81, 224, 0.2);
                    box-shadow: 0 30px 50px -20px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(155,81,224,0.15) inset;
                    padding: 2rem 1.5rem;
                    transition: transform 0.2s ease;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .crewholic-card-signup::-webkit-scrollbar {
                    width: 5px;
                }

                .crewholic-card-signup::-webkit-scrollbar-track {
                    background: rgba(155, 81, 224, 0.1);
                    border-radius: 10px;
                }

                .crewholic-card-signup::-webkit-scrollbar-thumb {
                    background: rgba(155, 81, 224, 0.5);
                    border-radius: 10px;
                }

                .brand-wrapper-signup {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .logo-circle-signup {
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 0.8rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #9B51E0, #F2994A);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 24px -8px rgba(155,81,224,0.4);
                    transition: transform 0.3s ease;
                    cursor: pointer;
                }

                .logo-circle-signup:hover {
                    transform: scale(1.05);
                }

                .logo-circle-signup img {
                    width: 70%;
                    height: 70%;
                    object-fit: contain;
                }

                .brand-title-signup {
                    font-size: 1.75rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    background: linear-gradient(120deg, #FFFFFF, #D7E2EA);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                    margin-bottom: 0.25rem;
                }

                .brand-tagline-signup {
                    font-size: 0.7rem;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                    color: #9B51E0;
                    font-weight: 500;
                    opacity: 0.8;
                }

                .form-heading-signup {
                    font-size: 1.35rem;
                    font-weight: 700;
                    letter-spacing: -0.3px;
                    margin-bottom: 0.4rem;
                    color: #F5F7FF;
                }

                .form-subheading-signup {
                    color: #9aa4bf;
                    font-size: 0.8rem;
                    margin-bottom: 1.5rem;
                    border-left: 2px solid #F2994A;
                    padding-left: 10px;
                }

                .input-group-modern {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .input-group-verify {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 1rem;
                }

                .input-group-verify .input-group-modern {
                    flex: 1;
                    margin-bottom: 0;
                }

                .verify-btn {
                    background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
                    border: none;
                    padding: 0 1.2rem;
                    border-radius: 44px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .verify-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(155,81,224,0.3);
                }

                .verify-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .verified-badge {
                    position: absolute;
                    right: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4CAF50;
                    font-size: 1rem;
                    z-index: 2;
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
                    padding: 0.8rem 1rem 0.8rem 2.8rem;
                    font-size: 0.9rem;
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

                .form-control-modern.verified {
                    border-color: #4CAF50;
                    padding-right: 2.5rem;
                }

                .password-toggle-signup {
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

                .password-toggle-signup:hover {
                    color: #F2994A;
                }

                .error-message {
                    color: #ff6b6b;
                    font-size: 0.7rem;
                    margin-top: 0.25rem;
                    margin-left: 1rem;
                    margin-bottom: 0.8rem;
                }

                .terms-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 1.2rem 0;
                    color: #9aa4bf;
                    font-size: 0.75rem;
                    flex-wrap: wrap;
                }

                .terms-wrapper input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    accent-color: #9B51E0;
                }

                .terms-wrapper label {
                    cursor: pointer;
                    flex: 1;
                }

                .terms-wrapper a {
                    color: #F2994A;
                    text-decoration: none;
                }

                .signup-btn {
                    background: linear-gradient(105deg, #9B51E0 0%, #F2994A 100%);
                    border: none;
                    width: 100%;
                    padding: 0.8rem 0;
                    border-radius: 60px;
                    font-weight: 700;
                    font-size: 0.95rem;
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

                .signup-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(155,81,224,0.35);
                }

                .signup-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .signup-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .divider-modern {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #4b5575;
                    font-size: 0.65rem;
                    margin: 1.2rem 0;
                }

                .divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(155,81,224,0.4), transparent);
                }

                .login-wrapper {
                    text-align: center;
                    margin-top: 1.2rem;
                    font-size: 0.8rem;
                    color: #9aa4bf;
                }

                .login-link {
                    color: #F2994A;
                    font-weight: 700;
                    text-decoration: none;
                    margin-left: 5px;
                    border-bottom: 1px solid rgba(242,153,74,0.5);
                }

                .back-home {
                    text-align: center;
                    margin-top: 0.8rem;
                }

                .back-home-link {
                    color: rgba(215, 226, 234, 0.5);
                    text-decoration: none;
                    font-size: 0.75rem;
                    transition: color 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                .back-home-link:hover {
                    color: #F2994A;
                }

                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .crewholic-card-signup {
                        padding: 1.5rem 1.2rem;
                        margin: 0;
                        border-radius: 1.5rem;
                    }
                    
                    .brand-title-signup {
                        font-size: 1.5rem;
                    }
                    
                    .logo-circle-signup {
                        width: 60px;
                        height: 60px;
                    }

                    .form-heading-signup {
                        font-size: 1.2rem;
                    }

                    .form-subheading-signup {
                        font-size: 0.75rem;
                        margin-bottom: 1.2rem;
                    }

                    .input-group-verify {
                        flex-direction: column;
                    }
                    
                    .verify-btn {
                        padding: 0.8rem;
                        font-size: 0.8rem;
                    }

                    .form-control-modern {
                        padding: 0.7rem 1rem 0.7rem 2.5rem;
                        font-size: 0.85rem;
                    }

                    .input-icon {
                        left: 14px;
                        font-size: 0.9rem;
                    }

                    .terms-wrapper {
                        font-size: 0.7rem;
                    }

                    .signup-btn {
                        padding: 0.7rem 0;
                        font-size: 0.9rem;
                    }
                }

                /* Extra Small Devices */
                @media (max-width: 380px) {
                    .crewholic-card-signup {
                        padding: 1.2rem 1rem;
                    }

                    .brand-title-signup {
                        font-size: 1.3rem;
                    }

                    .brand-tagline-signup {
                        font-size: 0.6rem;
                    }

                    .form-heading-signup {
                        font-size: 1.1rem;
                    }

                    .form-control-modern {
                        padding: 0.65rem 1rem 0.65rem 2.3rem;
                        font-size: 0.8rem;
                    }

                    .input-icon {
                        font-size: 0.8rem;
                    }
                }

                /* Loading Spinner Animation */
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .fa-spinner {
                    animation: spin 1s linear infinite;
                }
            `}</style>

            <div className="particles-signup" id="particles">
                {Array.from({ length: 50 }).map((_, i) => {
                    const size = Math.random() * 5 + 2;
                    const left = Math.random() * 100;
                    const duration = Math.random() * 10 + 5;
                    const delay = Math.random() * 5;

                    return (
                        <div
                            key={i}
                            className="particle-signup"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${left}%`,
                                animationDuration: `${duration}s`,
                                animationDelay: `${delay}s`,
                            }}
                        />
                    );
                })}
            </div>

            <div className="signup-container">
                <div className="crewholic-card-signup">
                    <div className="brand-wrapper-signup">
                        <div className="logo-circle-signup">
                            <img
                                src={logo}
                                alt="CREWHOLIC Logo"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%239B51E0'/%3E%3Cstop offset='100%25' stop-color='%23F2994A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='50' y='68' text-anchor='middle' font-size='32' fill='white' font-weight='bold'%3EC%3C/text%3E%3C/svg%3E";
                                }}
                            />
                        </div>

                        <h1 className="brand-title-signup">CREWHOLIC</h1>
                        <p className="brand-tagline-signup">Fusion-Powered Digital Agency</p>
                    </div>

                    <h2 className="form-heading-signup">Join the crew</h2>
                    <p className="form-subheading-signup">Create your account to get started</p>

                    <form onSubmit={handleSignup}>
                        <div className="input-group-modern">
                            <i className="fas fa-user input-icon"></i>
                            <input
                                type="text"
                                className="form-control-modern"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group-verify">
                            <div className="input-group-modern" style={{ flex: 1 }}>
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    className={`form-control-modern ${emailVerified ? "verified" : ""}`}
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailVerified(false);
                                        setShowEmailOTP(false);
                                        setEmailOTP("");
                                    }}
                                    required
                                    disabled={emailVerified}
                                />
                                {emailVerified && <i className="fas fa-check-circle verified-badge"></i>}
                            </div>

                            {!emailVerified ? (
                                <button
                                    type="button"
                                    className="verify-btn"
                                    onClick={sendEmailOTP}
                                    disabled={emailOTPLoading}
                                >
                                    {emailOTPLoading ? <i className="fas fa-spinner fa-spin"></i> : "Verify"}
                                </button>
                            ) : (
                                <button type="button" className="verify-btn" style={{ background: "#4CAF50" }} disabled>
                                    <i className="fas fa-check"></i> Verified
                                </button>
                            )}
                        </div>

                        {showEmailOTP && !emailVerified && (
                            <div className="input-group-verify">
                                <div className="input-group-modern" style={{ flex: 1 }}>
                                    <i className="fas fa-key input-icon"></i>
                                    <input
                                        type="text"
                                        className="form-control-modern"
                                        placeholder="Enter email OTP"
                                        value={emailOTP}
                                        onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        maxLength={6}
                                    />
                                </div>

                                <button type="button" className="verify-btn" onClick={verifyEmailOTP}>
                                    Submit
                                </button>
                            </div>
                        )}

                        <div className="input-group-modern">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control-modern"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                required
                            />
                            <i
                                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle-signup`}
                                onClick={togglePassword}
                            ></i>
                        </div>

                        <div className="input-group-modern">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control-modern"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (passwordError) setPasswordError("");
                                }}
                                required
                            />
                            <i
                                className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle-signup`}
                                onClick={toggleConfirmPassword}
                            ></i>
                        </div>

                        {passwordError && <div className="error-message">{passwordError}</div>}

                        <div className="terms-wrapper">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                required 
                            />
                            <label htmlFor="terms">
                                I agree to the <a href="/terms">Terms of Service</a> and{" "}
                                <a href="/privacy">Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="signup-btn"
                            disabled={loading || !emailVerified}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : null}
                            {loading ? "Creating account..." : "Create Account"}
                            {!loading && <i className="fas fa-arrow-right"></i>}
                        </button>
                    </form>

                    <div className="divider-modern">
                        <span className="divider-line"></span>
                        <span>JOIN US</span>
                        <span className="divider-line"></span>
                    </div>

                    <div className="login-wrapper">
                        Already have an account?
                        <Link to="/login" className="login-link">
                            Sign In
                        </Link>
                    </div>

                    <div className="back-home">
                        <Link to="/" className="back-home-link">
                            <i className="fas fa-arrow-left"></i> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}