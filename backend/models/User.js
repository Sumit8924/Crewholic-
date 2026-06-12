const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            default: "",
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        role: {
            type: String,
            enum: [
                "main_admin",
                "event_admin",
                "finance_admin",
                "marketing_admin",
                "rental_admin",
                "web_admin",
                "user",

                // old roles kept only so old database users do not break
                "admin",
                "client",
            ],
            default: "user",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        permissions: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);