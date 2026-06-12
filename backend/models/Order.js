const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        orderId: {
            type: String,
        },

        service: {
            type: String,
            required: true,
        },

        serviceType: {
            type: String,
        },

        amount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "Advance Paid",
                "work_completed",
                "Fully Paid",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        // USER DETAILS
        customerName: String,
        customerEmail: String,
        customerPhone: String,

        // RENTAL
        equipmentName: String,
        dailyRate: Number,
        rentalDays: Number,
        startDate: String,
        address: String,

        // WEB DEVELOPMENT
        projectType: String,
        features: String,
        timeline: String,
        dueDate: Date,
        team: String,

        // DIGITAL MARKETING
        marketingGoal: String,
        platform: [String],
        marketingType: String,

        // EVENT
        eventType: String,
        guestCount: Number,
        eventDate: String,
        venue: String,

        // QUOTE INFO
        quotedAmount: {
            type: Number,
            default: 0,
        },

        adminNotes: {
            type: String,
            default: "",
        },

        quoteSentAt: {
            type: Date,
            default: null,
        },

        // ADVANCE PAYMENT VERIFICATION
        advancePaid: {
            type: Boolean,
            default: false,
        },

        advanceAmount: {
            type: Number,
            default: 0,
        },

        advanceTxnId: {
            type: String,
            default: "",
        },

        advancePaidAt: {
            type: Date,
            default: null,
        },

        advanceSubmittedAt: {
            type: Date,
            default: null,
        },

        advancePaymentStatus: {
            type: String,
            enum: ["not_submitted", "pending_verification", "approved", "verified", "rejected"],
            default: "not_submitted",
        },

        advanceVerified: {
            type: Boolean,
            default: false,
        },

        advanceVerifiedAt: {
            type: Date,
            default: null,
        },

        advanceRejected: {
            type: Boolean,
            default: false,
        },

        advanceRejectedAt: {
            type: Date,
            default: null,
        },

        advanceRejectionReason: {
            type: String,
            default: "",
        },

        advancePaymentMethod: {
            type: String,
            default: "",
        },

        advanceScreenshotUrl: {
            type: String,
            default: "",
        },

        advancePayerName: {
            type: String,
            default: "",
        },

        advanceUpiId: {
            type: String,
            default: "",
        },

        // FINAL PAYMENT VERIFICATION
        finalPaid: {
            type: Boolean,
            default: false,
        },

        finalAmount: {
            type: Number,
            default: 0,
        },

        finalTxnId: {
            type: String,
            default: "",
        },

        finalPaidAt: {
            type: Date,
            default: null,
        },

        finalSubmittedAt: {
            type: Date,
            default: null,
        },

        finalPaymentStatus: {
            type: String,
            enum: ["not_submitted", "pending_verification", "approved", "verified", "rejected"],
            default: "not_submitted",
        },

        finalVerified: {
            type: Boolean,
            default: false,
        },

        finalVerifiedAt: {
            type: Date,
            default: null,
        },

        finalRejected: {
            type: Boolean,
            default: false,
        },

        finalRejectedAt: {
            type: Date,
            default: null,
        },

        finalRejectionReason: {
            type: String,
            default: "",
        },

        finalPaymentMethod: {
            type: String,
            default: "",
        },

        finalScreenshotUrl: {
            type: String,
            default: "",
        },

        finalPayerName: {
            type: String,
            default: "",
        },

        finalUpiId: {
            type: String,
            default: "",
        },

        // WORK STATUS
        workCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);