const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Order = require("../models/Order");

const getUserFromToken = (req) => {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

        if (!token) return null;

        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

const requireLogin = (req, res, next) => {
    const user = getUserFromToken(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please login again.",
        });
    }

    req.user = user;
    next();
};

const generateOrderId = () => {
    return `CW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

const normalizeOrderResponse = (order) => {
    const o = order.toObject ? order.toObject() : order;

    return {
        ...o,
        id: o._id,
        orderNumber: o.orderId || `CW-${String(o._id).slice(-6).toUpperCase()}`,
        date: o.createdAt,
        totalAmount: o.quotedAmount || o.amount || 0,
        paymentMethod: "UPI",
        items: [
            {
                id: 1,
                name: o.service || o.serviceType || o.projectType || o.equipmentName || "Service",
                quantity: 1,
                price: o.quotedAmount || o.amount || 0,
                image: "🛠️",
            },
        ],
        shippingAddress: {
            name: o.customerName || "Customer",
            address: o.address || "N/A",
            city: "N/A",
            state: "N/A",
            pincode: "N/A",
            phone: o.customerPhone || "N/A",
        },
    };
};

// CREATE ORDER / SERVICE INQUIRY
router.post("/", async (req, res) => {
    try {
        const user = getUserFromToken(req);

        const order = new Order({
            ...req.body,
            userId: req.body.userId || user?.id || user?._id || null,
            orderId: req.body.orderId || generateOrderId(),
            customerName: req.body.customerName || req.body.name || req.body.fullName || "",
            customerEmail: req.body.customerEmail || req.body.email || "",
            customerPhone: req.body.customerPhone || req.body.mobile || req.body.phone || "",
            service: req.body.service || req.body.serviceType || "Service Inquiry",
            status: req.body.status || "pending",
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: "Order saved successfully",
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating order",
            error: error.message,
        });
    }
});

// GET ALL ORDERS / ADMIN
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders.map(normalizeOrderResponse),
            inquiries: orders.map(normalizeOrderResponse),
            data: orders.map(normalizeOrderResponse),
        });
    } catch (error) {
        console.error("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching orders",
        });
    }
});

// USER DASHBOARD: MY ORDERS
router.get("/my-orders", requireLogin, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const orders = await Order.find({
            $or: [
                { userId },
                { customerEmail: req.user.email },
            ],
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders.map(normalizeOrderResponse),
        });
    } catch (error) {
        console.error("MY ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching your orders",
        });
    }
});

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("GET SINGLE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
// MARK WORK COMPLETE
router.patch("/:id/work-complete", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    workCompleted: true,
                    status: "work_completed",
                },
            },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Work marked completed",
            order,
        });
    } catch (error) {
        console.error("WORK COMPLETE ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Server error while marking work complete",
            error: error.message,
        });
    }
});

// USER SUBMITS PAYMENT
router.post("/:id/payment", requireLogin, async (req, res) => {
    try {
        const { type, amount, txnId, paidAt, paymentMethod, screenshotUrl, payerName, upiId } = req.body;

        if (!["advance", "final"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Payment type must be advance or final",
            });
        }

        if (!txnId || txnId.trim().length < 6) {
            return res.status(400).json({
                success: false,
                message: "Valid transaction ID is required",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const now = paidAt ? new Date(paidAt) : new Date();

        if (type === "advance") {
            order.advanceAmount = Number(amount) || 0;
            order.advanceTxnId = txnId.trim();
            order.advancePaidAt = now;
            order.advanceSubmittedAt = now;
            order.advancePaymentStatus = "pending_verification";
            order.advanceVerified = false;
            order.advanceRejected = false;
            order.advanceRejectionReason = "";
            order.advancePaymentMethod = paymentMethod || "UPI";
            order.advanceScreenshotUrl = screenshotUrl || "";
            order.advancePayerName = payerName || "";
            order.advanceUpiId = upiId || "";
            order.status = "approved";
        }

        if (type === "final") {
            order.finalAmount = Number(amount) || 0;
            order.finalTxnId = txnId.trim();
            order.finalPaidAt = now;
            order.finalSubmittedAt = now;
            order.finalPaymentStatus = "pending_verification";
            order.finalVerified = false;
            order.finalRejected = false;
            order.finalRejectionReason = "";
            order.finalPaymentMethod = paymentMethod || "UPI";
            order.finalScreenshotUrl = screenshotUrl || "";
            order.finalPayerName = payerName || "";
            order.finalUpiId = upiId || "";
            order.status = "work_completed";
        }

        await order.save();

        res.json({
            success: true,
            message: `${type} payment submitted for verification`,
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("PAYMENT SUBMIT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while submitting payment",
            error: error.message,
        });
    }
});

// ADMIN UPDATE: QUOTE / STATUS / WORK COMPLETE
router.patch("/:id", async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.quotedAmount || updateData.amount) {
            updateData.quotedAmount = Number(updateData.quotedAmount || updateData.amount);
            updateData.amount = updateData.quotedAmount;
            updateData.status = updateData.status || "approved";
            updateData.quoteSentAt = updateData.quoteSentAt || new Date();
        }

        if (updateData.workCompleted === true) {
            updateData.status = "work_completed";
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order updated successfully",
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating order",
            error: error.message,
        });
    }
});

// SAME AS PATCH because admin smartUpdate tries PATCH and PUT
router.put("/:id", async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.quotedAmount || updateData.amount) {
            updateData.quotedAmount = Number(updateData.quotedAmount || updateData.amount);
            updateData.amount = updateData.quotedAmount;
            updateData.status = updateData.status || "approved";
            updateData.quoteSentAt = updateData.quoteSentAt || new Date();
        }

        if (updateData.workCompleted === true) {
            updateData.status = "work_completed";
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order updated successfully",
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("PUT ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating order",
            error: error.message,
        });
    }
});

// ADMIN VERIFY PAYMENT
router.patch("/:id/payment/verify", async (req, res) => {
    try {
        const { type, action, reason } = req.body;

        if (!["advance", "final"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Payment type must be advance or final",
            });
        }

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be approve or reject",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const now = new Date();

        if (type === "advance") {
            if (action === "approve") {
                order.advancePaid = true;
                order.advanceVerified = true;
                order.advanceVerifiedAt = now;
                order.advancePaymentStatus = "verified";
                order.advanceRejected = false;
                order.advanceRejectionReason = "";
                order.status = "processing";
            } else {
                order.advancePaid = false;
                order.advanceVerified = false;
                order.advancePaymentStatus = "rejected";
                order.advanceRejected = true;
                order.advanceRejectedAt = now;
                order.advanceRejectionReason = reason || "Payment rejected by admin";
                order.status = "approved";
            }
        }

        if (type === "final") {
            if (action === "approve") {
                order.finalPaid = true;
                order.finalVerified = true;
                order.finalVerifiedAt = now;
                order.finalPaymentStatus = "verified";
                order.finalRejected = false;
                order.finalRejectionReason = "";
                order.status = "completed";
            } else {
                order.finalPaid = false;
                order.finalVerified = false;
                order.finalPaymentStatus = "rejected";
                order.finalRejected = true;
                order.finalRejectedAt = now;
                order.finalRejectionReason = reason || "Payment rejected by admin";
                order.status = "work_completed";
            }
        }

        await order.save();

        res.json({
            success: true,
            message: `${type} payment ${action === "approve" ? "verified" : "rejected"}`,
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("VERIFY PAYMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error while verifying payment",
            error: error.message,
        });
    }
});

// ADMIN DIRECT ACTION ENDPOINTS
router.patch("/:id/approve", async (req, res) => {
    try {
        const { quotedAmount, adminNotes } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: "approved",
                    quotedAmount: Number(quotedAmount) || 0,
                    amount: Number(quotedAmount) || 0,
                    adminNotes: adminNotes || "",
                    quoteSentAt: new Date(),
                },
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order approved and quote sent",
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("APPROVE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

router.patch("/:id/work-complete", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    workCompleted: true,
                    status: "work_completed",
                },
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Work marked as completed",
            order: normalizeOrderResponse(order),
        });
    } catch (error) {
        console.error("WORK COMPLETE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;