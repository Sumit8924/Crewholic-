require("dotenv").config();

const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const cron = require("node-cron");

const exportRoutes = require("./backend/routes/export");
const Order = require("./backend/models/Order");
const orderRoutes = require("./backend/routes/orderRoutes");
const generateExcelFile = require("./backend/utils/generateExcel");

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://crewholic.vercel.app",
        ],
        credentials: true,
    })
);

app.use("/api/export", exportRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL =
    process.env.BREVO_SENDER_EMAIL || "officialcrewholic@gmail.com";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(to, subject, html) {
    try {
        const sendSmtpEmail = {
            sender: {
                name: "CREWHOLIC",
                email: BREVO_SENDER_EMAIL,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        };

        const result = await emailApi.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent:", result);
        return result;
    } catch (err) {
        console.log("❌ Email failed:", err.response?.body || err.message);
        throw err;
    }
}

async function safeGenerateExcel() {
    try {
        await generateExcelFile();
    } catch (error) {
        console.log("❌ Excel update failed:", error.message);
    }
}

let otpStore = {};

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        role: {
            type: String,
            enum: [
                "super_admin",
                "rental_admin",
                "finance_admin",
                "webdev_admin",
                "marketing_admin",
                "event_admin",
                "user",
            ],
            default: "user",
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
    const adminEmail = "admin@crewholic.com";

    const exist = await User.findOne({ email: adminEmail });

    if (!exist) {
        const hashed = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Main Admin",
            email: adminEmail,
            password: hashed,
            authProvider: "local",
            role: "super_admin",
        });

        console.log("👑 Super Admin Created");
        await safeGenerateExcel();
    }
}

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");

        await createAdmin();
        await safeGenerateExcel();

        cron.schedule("* * * * *", async () => {
            console.log("⏰ Auto updating Excel...");
            await safeGenerateExcel();
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ DB Error:", err);
    });

app.get("/", (req, res) => {
    res.send("🚀 Backend Running Successfully with Brevo API + Google Login + Auto Excel");
});

app.post("/api/service-inquiry", async (req, res) => {
    try {
        const {
            service,
            timeline,
            name,
            mobile,
            email,
            requirements,
        } = req.body;

        if (!service || !name || !mobile || !email || !requirements) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        await sendEmail(
            "officialcrewholic@gmail.com",
            `📩 New Service Inquiry - ${service}`,
            `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color:#9B51E0;">New Service Inquiry</h2>

                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>

                <hr/>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Requirements:</strong></p>
                <p style="background:#f2f2f2; padding:15px; border-radius:10px;">
                    ${requirements}
                </p>

                <br/>
                <p>Admin please review and approve this inquiry.</p>
            </div>
            `
        );

        await sendEmail(
            email,
            "✅ Your CREWHOLIC Inquiry Received",
            `
            <div style="font-family: Arial, sans-serif; background:#0a0a2a; padding:30px; color:#fff;">
                <div style="max-width:600px; margin:auto; background:#111328; border-radius:20px; padding:30px; text-align:center;">
                    <h1 style="color:#F2994A;">Thank You, ${name}!</h1>
                    <p>Your inquiry for <b>${service}</b> has been received.</p>
                    <p>Our admin team will review and contact you soon.</p>
                </div>
            </div>
            `
        );

        res.json({
            msg: "Inquiry sent successfully",
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to send inquiry",
            error: err.response?.body || err.message,
        });
    }
});

app.get("/api/generate-excel", async (req, res) => {
    await safeGenerateExcel();

    res.json({
        message: "Excel generated successfully",
        path: "E:/lb/exports/crewholic_database.xlsx",
    });
});

app.get("/api/test-email", async (req, res) => {
    try {
        const result = await sendEmail(
            "srout2023@gift.edu.in",
            "✅ CREWHOLIC Test Email",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h1>Email Working Successfully 🚀</h1>
                <p>Brevo API configured correctly.</p>
            </div>
            `
        );

        res.json({
            msg: "Email Sent",
            result,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Email Failed",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/otp/send-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email required",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000,
    };

    try {
        await sendEmail(
            email,
            "🔐 Your CREWHOLIC OTP",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Your OTP is: ${otp}</h2>
                <p>This OTP is valid for 5 minutes.</p>
                <p>Do not share this OTP with anyone.</p>
            </div>
            `
        );

        res.json({
            message: "Email OTP sent successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to send email OTP",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/otp/verify-email", (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
        return res.status(400).json({
            message: "No OTP found",
        });
    }

    if (Date.now() > record.expires) {
        delete otpStore[email];
        return res.status(400).json({
            message: "OTP expired",
        });
    }

    if (record.otp != otp) {
        return res.status(400).json({
            message: "Invalid OTP",
        });
    }

    delete otpStore[email];

    res.json({
        message: "Email verified successfully",
    });
});

app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            msg: "Email required",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000,
    };

    try {
        await sendEmail(
            email,
            "🔐 Your OTP Code",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Your OTP: ${otp}</h2>
                <p>This OTP is valid for 5 minutes.</p>
            </div>
            `
        );

        res.json({
            msg: "OTP sent successfully",
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to send OTP",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
        return res.status(400).json({
            msg: "No OTP found",
        });
    }

    if (Date.now() > record.expires) {
        delete otpStore[email];
        return res.status(400).json({
            msg: "OTP expired",
        });
    }

    if (record.otp != otp) {
        return res.status(400).json({
            msg: "Invalid OTP",
        });
    }

    delete otpStore[email];

    res.json({
        msg: "OTP verified successfully",
    });
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, fullName, email, password, emailVerified } = req.body;

        const finalName = name || fullName;

        if (!finalName || !email || !password) {
            return res.status(400).json({
                msg: "Name, email and password required",
                message: "Name, email and password required",
            });
        }

        if (emailVerified === false) {
            return res.status(400).json({
                msg: "Please verify your email first",
                message: "Please verify your email first",
            });
        }

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                msg: "User already exists",
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: finalName,
            email,
            password: hashedPassword,
            authProvider: "local",
        });

        await safeGenerateExcel();

        sendEmail(
            email,
            "🎉 Welcome to CREWHOLIC",
            `
            <div style="font-family: Arial, sans-serif; background: #0a0a2a; padding: 30px; color: #fff;">
                <div style="max-width: 600px; margin: auto; background: #111328; border-radius: 20px; padding: 30px; text-align: center;">
                    <h1 style="color: #9B51E0; margin-bottom: 10px;">
                        Welcome, ${finalName} 🚀
                    </h1>
                    <p style="font-size: 16px; color: #ccc;">
                        Your account has been successfully created at <b style="color:#F2994A;">CREWHOLIC</b>.
                    </p>
                    <p style="font-size: 12px; color: #777;">
                        CREWHOLIC Team 🚀
                    </p>
                </div>
            </div>
            `
        ).catch((err) => {
            console.log("⚠️ Welcome email failed:", err.response?.body || err.message);
        });

        res.status(201).json({
            msg: "Registered successfully",
            message: "Registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                msg: "User already exists",
                message: "User already exists",
            });
        }

        res.status(500).json({
            msg: "Server error",
            message: "Server error",
            error: err.message,
        });
    }
});

app.post("/api/auth/signup", async (req, res) => {
    try {
        const { fullName, name, email, password, emailVerified } = req.body;

        const finalName = fullName || name;

        if (!finalName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required",
            });
        }

        if (!emailVerified) {
            return res.status(400).json({
                message: "Please verify your email first",
            });
        }

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: finalName,
            email,
            password: hashedPassword,
            authProvider: "local",
        });

        await safeGenerateExcel();

        sendEmail(
            email,
            "🎉 Welcome to CREWHOLIC",
            `
            <div style="font-family: Arial, sans-serif; background: #0a0a2a; padding: 30px; color: #fff;">
                <div style="max-width: 600px; margin: auto; background: #111328; border-radius: 20px; padding: 30px; text-align: center;">
                    <h1 style="color: #9B51E0;">Welcome, ${finalName} 🚀</h1>
                    <p>Your account has been successfully created at CREWHOLIC.</p>
                    <p style="font-size: 12px; color: #777;">CREWHOLIC Team 🚀</p>
                </div>
            </div>
            `
        ).catch((err) => {
            console.log("⚠️ Welcome email failed:", err.response?.body || err.message);
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
});

app.post("/api/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                msg: "Google Client ID missing in backend environment",
            });
        }

        if (!credential) {
            return res.status(400).json({
                msg: "Google credential missing",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({
                msg: "Google account email not found",
            });
        }

        const name = payload.name || "Google User";
        const email = payload.email;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: "",
                authProvider: "google",
                role: "user",
            });

            await safeGenerateExcel();
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            msg: "Google login successful",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Google login failed",
            error: err.message,
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        if (user.authProvider === "google" && !user.password) {
            return res.status(401).json({
                msg: "This account uses Google login. Please sign in with Google.",
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                msg: "Wrong password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            msg: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error",
            error: err.message,
        });
    }
});

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            msg: "No token",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (
            ![
                "super_admin",
                "rental_admin",
                "finance_admin",
                "webdev_admin",
                "marketing_admin",
                "event_admin",
            ].includes(decoded.role)
        ) {
            return res.status(403).json({
                msg: "Admin only",
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            msg: "Invalid token",
        });
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                msg: "No token",
            });
        }

        const token = authHeader.split(" ")[1] || authHeader;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    msg: "Access denied",
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({
                msg: "Invalid token",
            });
        }
    };
}

app.post("/api/admin/approve-order", verifyAdmin, async (req, res) => {
    try {
        const { email, name, service } = req.body;

        if (!email || !name || !service) {
            return res.status(400).json({
                msg: "Missing data",
            });
        }

        const result = await sendEmail(
            email,
            "✅ Request Approved",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2 style="color:#4CAF50;">Congratulations ${name}! 🎉</h2>
                <p>Your request for "${service}" has been approved by our team.</p>
                <p>Our team will contact you shortly.</p>
            </div>
            `
        );

        await safeGenerateExcel();

        res.json({
            msg: `${service} approved & email sent`,
            result,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to approve order",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                msg: "All fields required",
            });
        }

        await sendEmail(
            BREVO_SENDER_EMAIL,
            `📬 New Contact Message from ${name}`,
            `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #9B51E0;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Service:</strong> ${service || "Not specified"}</p>
                <p><strong>Message:</strong></p>
                <p style="background: #f0f0f0; padding: 15px; border-radius: 10px;">${message}</p>
            </div>
            `
        );

        await sendEmail(
            email,
            "✅ We've Received Your Message!",
            `
            <div style="font-family: Arial, sans-serif; background: #0a0a2a; padding: 30px; color: #fff;">
                <div style="max-width: 600px; margin: auto; background: #111328; border-radius: 20px; padding: 30px; text-align: center;">
                    <h1 style="color: #9B51E0;">Thank You, ${name}! 🙏</h1>
                    <p>We have received your message and our team will get back to you within 24 hours.</p>
                </div>
            </div>
            `
        );

        res.json({
            msg: "Message sent successfully",
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to send message",
            error: err.response?.body || err.message,
        });
    }
});

app.get("/api/test-order", async (req, res) => {
    try {
        const order = await Order.create({
            service: "rental",
            amount: 2000,
            status: "pending",
        });

        await safeGenerateExcel();

        res.json(order);
    } catch (err) {
        res.status(500).json({
            msg: "Error creating order",
        });
    }
});

app.get("/api/admin/analytics", verifyAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const approvedOrders = await Order.countDocuments({ status: "approved" });

        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: "$service",
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        res.json({
            totalOrders,
            pendingOrders,
            approvedOrders,
            revenueData,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error fetching analytics",
            error: err.message,
        });
    }
});

app.get(
    "/api/rental-dashboard",
    authorizeRoles("rental_admin", "super_admin"),
    (req, res) => {
        res.json({ msg: "📦 Rental Dashboard Data" });
    }
);

app.get(
    "/api/finance-dashboard",
    authorizeRoles("finance_admin", "super_admin"),
    (req, res) => {
        res.json({ msg: "💰 Finance Dashboard Data" });
    }
);

app.get(
    "/api/webdev-dashboard",
    authorizeRoles("webdev_admin", "super_admin"),
    (req, res) => {
        res.json({ msg: "💻 Web Development Dashboard Data" });
    }
);

app.get(
    "/api/marketing-dashboard",
    authorizeRoles("marketing_admin", "super_admin"),
    (req, res) => {
        res.json({ msg: "📈 Marketing Dashboard Data" });
    }
);

app.get(
    "/api/event-dashboard",
    authorizeRoles("event_admin", "super_admin"),
    (req, res) => {
        res.json({ msg: "🎉 Event Management Dashboard Data" });
    }
);

app.get("/api/super-dashboard", authorizeRoles("super_admin"), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({
            msg: "👑 Super Admin Dashboard",
            totalUsers,
            totalOrders,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error loading dashboard",
            error: err.message,
        });
    }
});

app.get("/api/admin-data", verifyAdmin, (req, res) => {
    res.json({
        msg: "🔥 Admin access granted",
    });
});

app.get("/api/excel-data", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const users = await db.collection("users").find({}).toArray();
        const orders = await db.collection("orders").find({}).toArray();

        res.json({
            users,
            orders,
            lastUpdated: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});