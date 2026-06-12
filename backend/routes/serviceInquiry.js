// backend/routes/inquiry.js
const express = require("express");
const router = express.Router();
const SibApiV3Sdk = require("sib-api-v3-sdk");
const Order = require("../models/Order");

// ─── BREVO EMAIL SETUP ─────────────────────────────────────────────────────
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const BREVO_SENDER_EMAIL =
    process.env.BREVO_SENDER_EMAIL || "officialcrewholic@gmail.com";

async function sendEmail(to, subject, html) {
    try {
        await emailApi.sendTransacEmail({
            sender: {
                name: "CREWHOLIC",
                email: BREVO_SENDER_EMAIL,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        });
    } catch (err) {
        console.log("❌ Inquiry email failed:", err.response?.body || err.message);
    }
}

// ─── HELPERS ───────────────────────────────────────────────────────────────
const calcAdvance = (total) => Math.round((Number(total || 0) * 30) / 100);

const calcFinal = (total, advance) =>
    Number(total || 0) - Number(advance || calcAdvance(total));

const formatInquiry = (item) => {
    const quotedAmount = item.quotedAmount || item.amount || 0;
    const advanceAmount = item.advanceAmount || calcAdvance(quotedAmount);
    const finalAmount = item.finalAmount || calcFinal(quotedAmount, advanceAmount);

    return {
        _id: item._id,
        id: item._id,

        name: item.customerName,
        mobile: item.customerPhone,
        email: item.customerEmail,

        service: item.service,
        timeline: item.timeline || "",
        requirements: item.features || "",

        status: item.status || "pending",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,

        quotedAmount,
        adminNotes: item.adminNotes || "",
        quoteSentAt: item.quoteSentAt || null,

        advancePaid: item.advancePaid || false,
        advanceAmount,
        advanceTxnId: item.advanceTxnId || "",
        advancePaidAt: item.advancePaidAt || null,
        advanceSubmittedAt: item.advanceSubmittedAt || null,
        advancePaymentStatus: item.advancePaymentStatus || "not_submitted",
        advanceVerified: item.advanceVerified || false,
        advanceVerifiedAt: item.advanceVerifiedAt || null,
        advanceRejected: item.advanceRejected || false,
        advanceRejectedAt: item.advanceRejectedAt || null,
        advanceRejectionReason: item.advanceRejectionReason || "",
        advancePaymentMethod: item.advancePaymentMethod || "",
        advanceScreenshotUrl: item.advanceScreenshotUrl || "",
        advancePayerName: item.advancePayerName || "",
        advanceUpiId: item.advanceUpiId || "",

        finalPaid: item.finalPaid || false,
        finalAmount,
        finalTxnId: item.finalTxnId || "",
        finalPaidAt: item.finalPaidAt || null,
        finalSubmittedAt: item.finalSubmittedAt || null,
        finalPaymentStatus: item.finalPaymentStatus || "not_submitted",
        finalVerified: item.finalVerified || false,
        finalVerifiedAt: item.finalVerifiedAt || null,
        finalRejected: item.finalRejected || false,
        finalRejectedAt: item.finalRejectedAt || null,
        finalRejectionReason: item.finalRejectionReason || "",
        finalPaymentMethod: item.finalPaymentMethod || "",
        finalScreenshotUrl: item.finalScreenshotUrl || "",
        finalPayerName: item.finalPayerName || "",
        finalUpiId: item.finalUpiId || "",

        workCompleted: item.workCompleted || false,
    };
};

// ─── GET ALL INQUIRIES ─────────────────────────────────────────────────────
router.get("/", async (req, res) => {
    try {
        const inquiries = await Order.find({
            service: { $exists: true, $ne: null },
        })
            .sort({ createdAt: -1 })
            .lean();

        res.json(inquiries.map(formatInquiry));
    } catch (err) {
        console.error("GET inquiries error:", err);
        res.status(500).json({
            msg: "Failed to fetch service inquiries",
            error: err.message,
        });
    }
});

// ─── GET ONE INQUIRY ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
    try {
        const inquiry = await Order.findById(req.params.id).lean();

        if (!inquiry) {
            return res.status(404).json({ msg: "Inquiry not found" });
        }

        res.json(formatInquiry(inquiry));
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// ─── CREATE INQUIRY ────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        const { service, timeline, name, mobile, email, requirements } = req.body;

        if (!service || !name || !mobile || !email) {
            return res.status(400).json({
                msg: "Service, name, mobile and email are required",
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

            quotedAmount: 0,
            adminNotes: "",
            quoteSentAt: null,

            advancePaid: false,
            advanceAmount: 0,
            advanceTxnId: "",
            advancePaidAt: null,
            advanceSubmittedAt: null,
            advancePaymentStatus: "not_submitted",
            advanceVerified: false,
            advanceVerifiedAt: null,
            advanceRejected: false,
            advanceRejectedAt: null,
            advanceRejectionReason: "",

            finalPaid: false,
            finalAmount: 0,
            finalTxnId: "",
            finalPaidAt: null,
            finalSubmittedAt: null,
            finalPaymentStatus: "not_submitted",
            finalVerified: false,
            finalVerifiedAt: null,
            finalRejected: false,
            finalRejectedAt: null,
            finalRejectionReason: "",

            workCompleted: false,
        });

        sendEmail(
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
                    ${requirements || "—"}
                </p>
            </div>
            `
        );

        sendEmail(
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

        res.status(201).json({
            msg: "Inquiry submitted successfully",
            data: formatInquiry(order),
        });
    } catch (err) {
        console.error("POST inquiry error:", err);
        res.status(500).json({
            msg: "Failed to submit inquiry",
            error: err.message,
        });
    }
});

// ─── UPDATE INQUIRY / SEND QUOTATION / VERIFY PAYMENT ─────────────────────
router.patch("/:id", async (req, res) => {
    try {
        const {
            status,
            notes,
            assignedTo,

            quotedAmount,
            amount,
            adminNotes,
            quoteSentAt,

            advancePaid,
            advanceAmount,
            advanceTxnId,
            advancePaidAt,
            advanceSubmittedAt,
            advancePaymentStatus,
            advanceVerified,
            advanceVerifiedAt,
            advanceRejected,
            advanceRejectedAt,
            advanceRejectionReason,
            advancePaymentMethod,
            advanceScreenshotUrl,
            advancePayerName,
            advanceUpiId,

            finalPaid,
            finalAmount,
            finalTxnId,
            finalPaidAt,
            finalSubmittedAt,
            finalPaymentStatus,
            finalVerified,
            finalVerifiedAt,
            finalRejected,
            finalRejectedAt,
            finalRejectionReason,
            finalPaymentMethod,
            finalScreenshotUrl,
            finalPayerName,
            finalUpiId,

            workCompleted,
        } = req.body;

        const updateData = {};

        if (status !== undefined) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

        if (quotedAmount !== undefined) {
            updateData.quotedAmount = Number(quotedAmount);
            updateData.amount = Number(quotedAmount);
            updateData.advanceAmount = calcAdvance(Number(quotedAmount));
            updateData.finalAmount = calcFinal(Number(quotedAmount));
            updateData.status = "approved";
            updateData.quoteSentAt = quoteSentAt || new Date();
        }

        if (amount !== undefined) updateData.amount = Number(amount);
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (quoteSentAt !== undefined) updateData.quoteSentAt = quoteSentAt;

        if (advancePaid !== undefined) updateData.advancePaid = advancePaid;
        if (advanceAmount !== undefined) updateData.advanceAmount = Number(advanceAmount);
        if (advanceTxnId !== undefined) updateData.advanceTxnId = advanceTxnId;
        if (advancePaidAt !== undefined) updateData.advancePaidAt = advancePaidAt;
        if (advanceSubmittedAt !== undefined) updateData.advanceSubmittedAt = advanceSubmittedAt;
        if (advancePaymentStatus !== undefined) updateData.advancePaymentStatus = advancePaymentStatus;
        if (advanceVerified !== undefined) updateData.advanceVerified = advanceVerified;
        if (advanceVerifiedAt !== undefined) updateData.advanceVerifiedAt = advanceVerifiedAt;
        if (advanceRejected !== undefined) updateData.advanceRejected = advanceRejected;
        if (advanceRejectedAt !== undefined) updateData.advanceRejectedAt = advanceRejectedAt;
        if (advanceRejectionReason !== undefined) updateData.advanceRejectionReason = advanceRejectionReason;
        if (advancePaymentMethod !== undefined) updateData.advancePaymentMethod = advancePaymentMethod;
        if (advanceScreenshotUrl !== undefined) updateData.advanceScreenshotUrl = advanceScreenshotUrl;
        if (advancePayerName !== undefined) updateData.advancePayerName = advancePayerName;
        if (advanceUpiId !== undefined) updateData.advanceUpiId = advanceUpiId;

        if (finalPaid !== undefined) updateData.finalPaid = finalPaid;
        if (finalAmount !== undefined) updateData.finalAmount = Number(finalAmount);
        if (finalTxnId !== undefined) updateData.finalTxnId = finalTxnId;
        if (finalPaidAt !== undefined) updateData.finalPaidAt = finalPaidAt;
        if (finalSubmittedAt !== undefined) updateData.finalSubmittedAt = finalSubmittedAt;
        if (finalPaymentStatus !== undefined) updateData.finalPaymentStatus = finalPaymentStatus;
        if (finalVerified !== undefined) updateData.finalVerified = finalVerified;
        if (finalVerifiedAt !== undefined) updateData.finalVerifiedAt = finalVerifiedAt;
        if (finalRejected !== undefined) updateData.finalRejected = finalRejected;
        if (finalRejectedAt !== undefined) updateData.finalRejectedAt = finalRejectedAt;
        if (finalRejectionReason !== undefined) updateData.finalRejectionReason = finalRejectionReason;
        if (finalPaymentMethod !== undefined) updateData.finalPaymentMethod = finalPaymentMethod;
        if (finalScreenshotUrl !== undefined) updateData.finalScreenshotUrl = finalScreenshotUrl;
        if (finalPayerName !== undefined) updateData.finalPayerName = finalPayerName;
        if (finalUpiId !== undefined) updateData.finalUpiId = finalUpiId;

        if (workCompleted !== undefined) updateData.workCompleted = workCompleted;

        const inquiry = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!inquiry) {
            return res.status(404).json({ msg: "Inquiry not found" });
        }

        const formatted = formatInquiry(inquiry);

        if (quotedAmount !== undefined) {
            sendEmail(
                inquiry.customerEmail,
                `💼 CREWHOLIC Quotation for ${inquiry.service}`,
                `
                <div style="font-family: Arial, sans-serif; background:#0a0a2a; padding:30px; color:#fff;">
                    <div style="max-width:650px; margin:auto; background:#111328; border-radius:20px; padding:30px;">
                        <h1 style="color:#F2994A;">Your Project Quotation</h1>
                        <p>Hello <b>${inquiry.customerName}</b>,</p>
                        <p>Your quotation for <b>${inquiry.service}</b> has been approved.</p>
                        <div style="background:#1b1d35; padding:20px; border-radius:12px; margin:20px 0;">
                            <p><b>Total Project Cost:</b> ₹${formatted.quotedAmount.toLocaleString("en-IN")}</p>
                            <p><b>Advance Payment 30%:</b> ₹${formatted.advanceAmount.toLocaleString("en-IN")}</p>
                            <p><b>Final Payment 70%:</b> ₹${formatted.finalAmount.toLocaleString("en-IN")}</p>
                        </div>
                        ${
                            formatted.adminNotes
                                ? `<p><b>Admin Notes:</b> ${formatted.adminNotes}</p>`
                                : ""
                        }
                        <p>Please login to your dashboard to view and pay the advance amount.</p>
                        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard"
                           style="display:inline-block;background:#9B51E0;color:white;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">
                           Open Dashboard
                        </a>
                    </div>
                </div>
                `
            );
        }

        if (advancePaymentStatus === "approved" || advancePaymentStatus === "verified") {
            sendEmail(
                inquiry.customerEmail,
                "✅ Advance Payment Verified",
                `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#4CAF50;">Advance Payment Verified</h2>
                    <p>Hello ${inquiry.customerName},</p>
                    <p>Your advance payment for <b>${inquiry.service}</b> has been verified.</p>
                    <p>Our team will start your work shortly.</p>
                </div>
                `
            );
        }

        if (advancePaymentStatus === "rejected") {
            sendEmail(
                inquiry.customerEmail,
                "❌ Advance Payment Rejected",
                `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#FF6B6B;">Advance Payment Rejected</h2>
                    <p>Hello ${inquiry.customerName},</p>
                    <p>Your advance payment for <b>${inquiry.service}</b> was rejected.</p>
                    <p><b>Reason:</b> ${advanceRejectionReason || "Invalid payment details"}</p>
                </div>
                `
            );
        }

        if (workCompleted === true) {
            sendEmail(
                inquiry.customerEmail,
                `✅ CREWHOLIC Work Completed - ${inquiry.service}`,
                `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#4CAF50;">Work Completed</h2>
                    <p>Hello ${inquiry.customerName},</p>
                    <p>Your project <b>${inquiry.service}</b> has been marked as completed.</p>
                    <p>Please login to your dashboard and complete the final payment.</p>
                </div>
                `
            );
        }

        if (finalPaymentStatus === "approved" || finalPaymentStatus === "verified") {
            sendEmail(
                inquiry.customerEmail,
                "✅ Final Payment Verified",
                `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#4CAF50;">Final Payment Verified</h2>
                    <p>Hello ${inquiry.customerName},</p>
                    <p>Your final payment for <b>${inquiry.service}</b> has been verified.</p>
                    <p>Thank you for choosing CREWHOLIC.</p>
                </div>
                `
            );
        }

        res.json({
            msg: "Inquiry updated successfully",
            data: formatted,
        });
    } catch (err) {
        console.error("PATCH inquiry error:", err);
        res.status(400).json({ msg: err.message });
    }
});

// ─── PUT FALLBACK ──────────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
    try {
        const inquiry = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).lean();

        if (!inquiry) return res.status(404).json({ msg: "Not found" });

        res.json({
            msg: "Updated",
            data: formatInquiry(inquiry),
        });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// ─── DELETE INQUIRY ────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
    try {
        const inquiry = await Order.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ msg: "Not found" });
        }

        res.json({ msg: "Inquiry deleted" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;