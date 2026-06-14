require("dotenv").config();

const path = require("path");
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
const rentalInquiryRoutes = require("./backend/routes/rentalInquiry");
const cloudinary = require("./backend/config/cloudinary");
const productAvailabilityRoutes = require("./backend/routes/productAvailability");
const transactionRoutes = require("./backend/routes/finance/transactions");
const invoiceRoutes = require("./backend/routes/finance/invoices");
const budgetRoutes = require("./backend/routes/finance/budgets");
const taxRoutes = require("./backend/routes/finance/tax");

// contactRoute = require("./backend/routes/contact");
// const serviceInquiryRoutes = require("./backend/routes/serviceInquiry");

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:8080",
            "http://localhost:5173",
            "https://crewholic.vercel.app",
            "https://crewholic-djzl6zjxv-sumit-kumar-routs-projects.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "backend", "uploads"))
);

// app.use("/api/contact", contactRoute);

app.use("/api/product-availability", productAvailabilityRoutes);
app.use("/api/rental-availability", productAvailabilityRoutes);
app.use("/api/rental-inquiry", rentalInquiryRoutes);
app.use("/api/export", exportRoutes);

// Main order workflow
app.use("/api/orders", orderRoutes);

// Admin dashboard compatibility
app.use("/api/service-inquiry", orderRoutes);
app.use("/api/service-inquiries", orderRoutes);

// ── Finance API ──
app.use("/api/finance/transactions", transactionRoutes);
app.use("/api/finance/invoices",     invoiceRoutes);
app.use("/api/finance/budgets",      budgetRoutes);
app.use("/api/finance/tax",          taxRoutes);


const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "crewholic_secret";
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

const ROLES = {
    MAIN_ADMIN: "main_admin",
    EVENT_ADMIN: "event_admin",
    FINANCE_ADMIN: "finance_admin",
    MARKETING_ADMIN: "marketing_admin",
    RENTAL_ADMIN: "rental_admin",
    WEB_ADMIN: "web_admin",
    USER: "user",
};

const ADMIN_ROLES = [
    ROLES.MAIN_ADMIN,
    ROLES.EVENT_ADMIN,
    ROLES.FINANCE_ADMIN,
    ROLES.MARKETING_ADMIN,
    ROLES.RENTAL_ADMIN,
    ROLES.WEB_ADMIN,
];

const ROLE_PERMISSIONS = {
    main_admin: [
        "dashboard",
        "website",
        "marketing",
        "rental",
        "events",
        "finance",
        "team",
        "reports",
        "settings",
    ],
    event_admin: ["dashboard", "events", "reports"],
    finance_admin: ["dashboard", "finance", "reports"],
    marketing_admin: ["dashboard", "marketing", "reports"],
    rental_admin: ["dashboard", "rental", "reports"],
    web_admin: ["dashboard", "website", "reports"],
    user: ["dashboard"],
};

function getDashboardRoute(role) {
    if (ADMIN_ROLES.includes(role)) return "/admin";
    return "/dashboard";
}

function getPermissions(role) {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;
}

async function sendEmail(to, subject, html) {
    try {
        if (!BREVO_API_KEY) {
            throw new Error("BREVO_API_KEY is missing in .env");
        }

        if (!BREVO_SENDER_EMAIL) {
            throw new Error("BREVO_SENDER_EMAIL is missing in .env");
        }

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
            required: true,
        },
        password: String,
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
    );
}

function cleanUser(user) {
    return {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        dashboardRoute: getDashboardRoute(user.role),
        permissions: getPermissions(user.role),
    };
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No token" });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
}

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "No token" });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!ADMIN_ROLES.includes(decoded.role)) {
            return res.status(403).json({ msg: "Admin only" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ msg: "No token" });
        }

        const token = authHeader.split(" ")[1] || authHeader;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ msg: "Access denied" });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ msg: "Invalid token" });
        }
    };
}

async function createMainAdmin() {
    const adminEmail = "admin@crewholic.com";
    const exist = await User.findOne({ email: adminEmail });

    if (!exist) {
        const hashed = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Main Admin",
            email: adminEmail,
            password: hashed,
            authProvider: "local",
            role: ROLES.MAIN_ADMIN,
        });

        console.log("👑 Main Admin Created");
        await safeGenerateExcel();
    }
}

app.get("/", (req, res) => {
    res.send("🚀 Backend Running Successfully");
});

app.get("/api/check-env", (req, res) => {
    res.json({
        mongo: !!process.env.MONGO_URI,
        jwt: !!process.env.JWT_SECRET,
        brevoApiKey: !!process.env.BREVO_API_KEY,
        brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || null,
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    });
});

app.get("/api/test-email", async (req, res) => {
    try {
        const result = await sendEmail(
            BREVO_SENDER_EMAIL,
            "✅ CREWHOLIC Test Email",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h1>Email Working Successfully 🚀</h1>
                <p>Brevo API configured correctly.</p>
            </div>
            `
        );

        res.json({
            success: true,
            msg: "Email Sent",
            result,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Email Failed",
            error: err.response?.body || err.message,
        });
    }
});

app.get("/api/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({
            user: cleanUser(user),
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to load profile",
            error: err.message,
        });
    }
});

app.get("/api/admin/dashboard", verifyAdmin, async (req, res) => {
    try {
        const role = req.user.role;
        const orderFilter = {};

        if (role === ROLES.EVENT_ADMIN) {
            orderFilter.service = { $regex: "event", $options: "i" };
        }

        if (role === ROLES.MARKETING_ADMIN) {
            orderFilter.service = { $regex: "marketing", $options: "i" };
        }

        if (role === ROLES.RENTAL_ADMIN) {
            orderFilter.service = { $regex: "rental", $options: "i" };
        }

        if (role === ROLES.WEB_ADMIN) {
            orderFilter.service = { $regex: "web|website|software", $options: "i" };
        }

        const [
            totalUsers,
            totalOrders,
            pendingOrders,
            approvedOrders,
            completedOrders,
            cancelledOrders,
            users,
            recentOrders,
            revenueByService,
            weeklyOrders,
        ] = await Promise.all([
            User.countDocuments(),
            Order.countDocuments(orderFilter),
            Order.countDocuments({ ...orderFilter, status: "pending" }),
            Order.countDocuments({ ...orderFilter, status: "approved" }),
            Order.countDocuments({ ...orderFilter, status: "completed" }),
            Order.countDocuments({ ...orderFilter, status: "cancelled" }),
            role === ROLES.MAIN_ADMIN
                ? User.find({})
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .lean()
                : [],
            Order.find(orderFilter).sort({ createdAt: -1 }).limit(50).lean(),
            Order.aggregate([
                { $match: orderFilter },
                {
                    $group: {
                        _id: "$service",
                        totalRevenue: { $sum: "$amount" },
                        totalOrders: { $sum: 1 },
                    },
                },
                { $sort: { totalRevenue: -1 } },
            ]),
            Order.aggregate([
                {
                    $match: {
                        ...orderFilter,
                        createdAt: {
                            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                            },
                        },
                        count: { $sum: 1 },
                        revenue: { $sum: "$amount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        const totalRevenueResult = await Order.aggregate([
            { $match: orderFilter },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]);

        res.json({
            msg: "Admin dashboard data loaded",
            role,
            permissions: getPermissions(role),
            metrics: {
                totalUsers: role === ROLES.MAIN_ADMIN ? totalUsers : null,
                totalOrders,
                pendingOrders,
                approvedOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue: totalRevenueResult[0]?.total || 0,
            },
            users,
            recentOrders,
            revenueByService,
            weeklyOrders,
            lastUpdated: new Date(),
        });
    } catch (err) {
        res.status(500).json({
            msg: "Error loading admin dashboard",
            error: err.message,
        });
    }
});

app.patch("/api/admin/orders/:id/status", verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "approved", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        await safeGenerateExcel();

        res.json({
            msg: "Order status updated",
            order,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to update order status",
            error: err.message,
        });
    }
});

app.post(
    "/api/admin/create-sub-admin",
    authorizeRoles(ROLES.MAIN_ADMIN),
    async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const allowedSubRoles = [
                ROLES.EVENT_ADMIN,
                ROLES.FINANCE_ADMIN,
                ROLES.MARKETING_ADMIN,
                ROLES.RENTAL_ADMIN,
                ROLES.WEB_ADMIN,
            ];

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    msg: "Name, email, password and role required",
                });
            }

            if (!allowedSubRoles.includes(role)) {
                return res.status(400).json({
                    msg: "Invalid sub-admin role",
                    allowedRoles: allowedSubRoles,
                });
            }

            const exist = await User.findOne({ email });

            if (exist) {
                return res.status(400).json({
                    msg: "User already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const subAdmin = await User.create({
                name,
                email,
                password: hashedPassword,
                authProvider: "local",
                role,
            });

            await safeGenerateExcel();

            res.status(201).json({
                msg: "Sub-admin created successfully",
                user: cleanUser(subAdmin),
            });
        } catch (err) {
            res.status(500).json({
                msg: "Failed to create sub-admin",
                error: err.message,
            });
        }
    }
);

app.patch(
    "/api/admin/users/:id/role",
    authorizeRoles(ROLES.MAIN_ADMIN),
    async (req, res) => {
        try {
            const { role } = req.body;

            if (!Object.values(ROLES).includes(role)) {
                return res.status(400).json({
                    msg: "Invalid role",
                    allowedRoles: Object.values(ROLES),
                });
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true }
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    msg: "User not found",
                });
            }

            await safeGenerateExcel();

            res.json({
                msg: "User role updated successfully",
                user: cleanUser(user),
            });
        } catch (err) {
            res.status(500).json({
                msg: "Failed to update user role",
                error: err.message,
            });
        }
    }
);

app.get("/api/test-cloudinary", async (req, res) => {
    try {
        const result = await cloudinary.api.ping();

        res.json({
            success: true,
            result,
        });
    } catch (err) {
        console.error("Cloudinary error:", err);

        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

app.post("/api/service-inquiry", async (req, res) => {
    try {
        const { service, timeline, name, mobile, email, requirements } = req.body;

        if (!service || !name || !mobile || !email || !requirements) {
            return res.status(400).json({
                msg: "All fields are required",
            });
        }

        const order = await Order.create({
            userId: req.user?.id || null,
            orderId: `ORD-${Date.now()}`,
            service,
            serviceType: service,
            amount: 0,
            status: "pending",
            customerName: name,
            customerEmail: email,
            customerPhone: mobile,
            timeline,
            features: requirements,
            projectType: service,
        });

        await sendEmail(
            BREVO_SENDER_EMAIL,
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

        await safeGenerateExcel();

        res.json({
            msg: "Inquiry saved and sent successfully",
            order,
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

app.get("/api/service-inquiry", async (req, res) => {
    try {
        const inquiries = await Order.find({
            amount: 0,
            service: { $exists: true },
        })
            .sort({ createdAt: -1 })
            .lean();

        const formatted = inquiries.map((item) => ({
            _id: item._id,
            id: item._id,
            name: item.customerName,
            mobile: item.customerPhone,
            email: item.customerEmail,
            service: item.service,
            timeline: item.timeline || "",
            requirements: item.features || "",
            status: item.status || "Pending",
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));

        res.json({
            inquiries: formatted,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to fetch service inquiries",
            error: err.message,
        });
    }
});

app.post("/api/otp/send-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
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

        res.json({ message: "Email OTP sent successfully" });
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

    if (!record) return res.status(400).json({ message: "No OTP found" });

    if (Date.now() > record.expires) {
        delete otpStore[email];
        return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];

    res.json({ message: "Email verified successfully" });
});

app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email required" });

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

        res.json({ msg: "OTP sent successfully" });
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

    if (!record) return res.status(400).json({ msg: "No OTP found" });

    if (Date.now() > record.expires) {
        delete otpStore[email];
        return res.status(400).json({ msg: "OTP expired" });
    }

    if (record.otp != otp) {
        return res.status(400).json({ msg: "Invalid OTP" });
    }

    delete otpStore[email];

    res.json({ msg: "OTP verified successfully" });
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
            role: ROLES.USER,
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
                </div>
            </div>
            `
        ).catch((err) => {
            console.log("⚠️ Welcome email failed:", err.response?.body || err.message);
        });

        res.status(201).json({
            msg: "Registered successfully",
            message: "Registered successfully",
            user: cleanUser(newUser),
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

app.post("/api/forgot-password", async (req, res) => {
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

        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000,
        };

        console.log("=================================");
        console.log("CREWHOLIC PASSWORD RESET OTP");
        console.log("EMAIL:", email);
        console.log("OTP:", otp);
        console.log("=================================");

        await sendEmail(
            email,
            "🔐 CREWHOLIC Password Reset OTP",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Password Reset OTP</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 5px; color: #F2994A;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
            </div>
            `
        );

        res.json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (err) {
        console.log("Forgot password email error:", err.response?.body || err.message);

        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/resend-otp", async (req, res) => {
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

        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000,
        };

        console.log("=================================");
        console.log("CREWHOLIC RESEND PASSWORD RESET OTP");
        console.log("EMAIL:", email);
        console.log("OTP:", otp);
        console.log("=================================");

        await sendEmail(
            email,
            "🔐 CREWHOLIC Password Reset OTP",
            `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Password Reset OTP</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 5px; color: #F2994A;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
            </div>
            `
        );

        res.json({
            success: true,
            message: "New OTP sent to your email",
        });
    } catch (err) {
        console.log("Resend OTP email error:", err.response?.body || err.message);

        res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
            error: err.response?.body || err.message,
        });
    }
});

app.post("/api/reset-password", async (req, res) => {
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
                message: "Password must be at least 6 characters",
            });
        }

        const record = otpStore[email];

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new OTP.",
            });
        }

        if (Date.now() > record.expires) {
            delete otpStore[email];

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new OTP.",
            });
        }

        if (String(record.otp) !== String(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                authProvider: "local",
                isActive: true,
            }
        );

        delete otpStore[email];

        res.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
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
            role: ROLES.USER,
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
                </div>
            </div>
            `
        ).catch((err) => {
            console.log("⚠️ Welcome email failed:", err.response?.body || err.message);
        });

        res.status(201).json({
            message: "Account created successfully",
            user: cleanUser(newUser),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "User already exists" });
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
            return res.status(400).json({ msg: "Google credential missing" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ msg: "Google account email not found" });
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
                role: ROLES.USER,
            });

            await safeGenerateExcel();
        }

        const token = createToken(user);

        res.json({
            msg: "Google login successful",
            user: cleanUser(user),
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
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.isActive === false) {
            return res.status(403).json({ msg: "Your account is disabled" });
        }

        if (user.authProvider === "google" && !user.password) {
            return res.status(401).json({
                msg: "This account uses Google login. Please sign in with Google.",
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ msg: "Wrong password" });
        }

        const token = createToken(user);

        res.json({
            msg: "Login successful",
            user: cleanUser(user),
            token,
        });
    } catch (err) {
        res.status(500).json({
            msg: "Server error",
            error: err.message,
        });
    }
});

app.post("/api/admin/approve-order", verifyAdmin, async (req, res) => {
    try {
        const { email, name, service } = req.body;

        if (!email || !name || !service) {
            return res.status(400).json({ msg: "Missing data" });
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
            return res.status(400).json({ msg: "All fields required" });
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
            ADMIN_EMAIL,
            `📬 New Contact Message from ${name}`,
            `
            <div style="font-family: Arial, sans-serif; background: #0a0a2a; padding: 30px; color: #fff;">
                <div style="max-width: 600px; margin: auto; background: #111328; border-radius: 20px; padding: 30px; text-align: center;">
                    <h1 style="color: #9B51E0;">Thank You, ${name}! 🙏</h1>
                    <p>We have received your message and our team will get back to you within 24 hours.</p>
                </div>
            </div>
            `
        );

        res.json({ msg: "Message sent successfully" });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to send message",
            error: err.response?.body || err.message,
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
                    total: { $sum: "$amount" },
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
app.get("/api/orders/my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { userId: req.user.id },
                { customerEmail: req.user.email }
            ]
        }).sort({ createdAt: -1 });

        const formattedOrders = orders.map((order) => ({
            id: order._id,
            orderNumber: order.orderId || `ORD-${String(order._id).slice(-6).toUpperCase()}`,
            date: order.createdAt,
            status: order.status || "pending",
            items: [
                {
                    id: 1,
                    name: order.service || order.serviceType || "Service Order",
                    quantity: 1,
                    price: order.amount || 0,
                    image: "🛠️",
                },
            ],
            totalAmount: order.amount || 0,
            paymentMethod: "Pending",
            shippingAddress: {
                name: order.customerName || "Customer",
                address: order.address || "Not provided",
                city: "Bhubaneswar",
                state: "Odisha",
                pincode: "000000",
                phone: order.customerPhone || "Not provided",
            },
        }));

        res.json({ orders: formattedOrders });
    } catch (err) {
        res.status(500).json({
            msg: "Failed to fetch user orders",
            error: err.message,
        });
    }
});

app.get(
    "/api/rental-dashboard",
    authorizeRoles(ROLES.RENTAL_ADMIN, ROLES.MAIN_ADMIN),
    (req, res) => {
        res.json({ msg: "📦 Rental Dashboard Data" });
    }
);

app.get(
    "/api/finance-dashboard",
    authorizeRoles(ROLES.FINANCE_ADMIN, ROLES.MAIN_ADMIN),
    (req, res) => {
        res.json({ msg: "💰 Finance Dashboard Data" });
    }
);

app.get(
    "/api/webdev-dashboard",
    authorizeRoles(ROLES.WEB_ADMIN, ROLES.MAIN_ADMIN),
    (req, res) => {
        res.json({ msg: "💻 Web Development Dashboard Data" });
    }
);

app.get(
    "/api/marketing-dashboard",
    authorizeRoles(ROLES.MARKETING_ADMIN, ROLES.MAIN_ADMIN),
    (req, res) => {
        res.json({ msg: "📈 Marketing Dashboard Data" });
    }
);

app.get(
    "/api/event-dashboard",
    authorizeRoles(ROLES.EVENT_ADMIN, ROLES.MAIN_ADMIN),
    (req, res) => {
        res.json({ msg: "🎉 Event Management Dashboard Data" });
    }
);

app.get("/api/main-dashboard", authorizeRoles(ROLES.MAIN_ADMIN), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        res.json({
            msg: "👑 Main Admin Dashboard",
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
        role: req.user.role,
        permissions: getPermissions(req.user.role),
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

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected");

        await createMainAdmin();
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