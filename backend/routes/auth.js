const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error.message,
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET || "crewholic_secret",
            {
                expiresIn: "1d",
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "user",
                permissions: user.permissions || [],
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
});

// FORGOT PASSWORD - GENERATE OTP
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address",
            });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(email, {
            otp,
            expiresAt,
        });

        console.log("=================================");
        console.log("CREWHOLIC PASSWORD RESET OTP");
        console.log("EMAIL:", email);
        console.log("OTP:", otp);
        console.log("EXPIRES IN: 10 minutes");
        console.log("=================================");

        res.json({
            success: true,
            message: "OTP generated successfully. Check backend terminal.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate OTP",
            error: error.message,
        });
    }
});

// RESEND OTP
router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address",
            });
        }

        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(email, {
            otp,
            expiresAt,
        });

        console.log("=================================");
        console.log("CREWHOLIC RESEND PASSWORD RESET OTP");
        console.log("EMAIL:", email);
        console.log("OTP:", otp);
        console.log("EXPIRES IN: 10 minutes");
        console.log("=================================");

        res.json({
            success: true,
            message: "New OTP generated successfully. Check backend terminal.",
        });
    } catch (error) {
        console.error("Resend OTP error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
            error: error.message,
        });
    }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new OTP.",
            });
        }

        if (String(storedData.otp) !== String(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                authProvider: "local",
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        otpStore.delete(email);

        res.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error: error.message,
        });
    }
});

module.exports = router;