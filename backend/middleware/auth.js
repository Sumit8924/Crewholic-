const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

function isAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login first.",
        });
    }

    if (
        req.user.role !== "admin" &&
        req.user.role !== "main_admin" &&
        req.user.role !== "superadmin"
    ) {
        return res.status(403).json({
            success: false,
            message: "Admin only",
        });
    }

    next();
}

// supports both import styles:
// const auth = require("../middleware/auth");
// const { auth, isAdmin } = require("../middleware/auth");
module.exports = auth;
module.exports.auth = auth;
module.exports.isAdmin = isAdmin;