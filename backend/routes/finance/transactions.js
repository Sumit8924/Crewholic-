// routes/finance/transactions.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Transaction = require("../../models/Transaction");

// GET all
router.get("/", auth, async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .lean();
        res.json({ transactions });
    } catch (e) {
        console.error("GET /transactions:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// POST create
router.post("/", auth, async (req, res) => {
    try {
        const { desc, type, amount, date, method, status, category, notes } = req.body;

        if (!desc || !type || !amount || !date) {
            return res.status(400).json({ error: "desc, type, amount, date are required" });
        }

        const tx = await Transaction.create({
            desc, type, amount: Number(amount),
            date, method, status, category, notes,
            createdBy: req.user?.id,
        });
        res.status(201).json({ transaction: tx });
    } catch (e) {
        console.error("POST /transactions:", e.message);
        res.status(400).json({ error: e.message });
    }
});

// PUT update
router.put("/:id", auth, async (req, res) => {
    try {
        const tx = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body, amount: Number(req.body.amount) },
            { new: true, runValidators: true }
        );
        if (!tx) return res.status(404).json({ error: "Transaction not found" });
        res.json({ transaction: tx });
    } catch (e) {
        console.error("PUT /transactions:", e.message);
        res.status(400).json({ error: e.message });
    }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
    try {
        const tx = await Transaction.findByIdAndDelete(req.params.id);
        if (!tx) return res.status(404).json({ error: "Transaction not found" });
        res.json({ success: true, message: "Transaction deleted" });
    } catch (e) {
        console.error("DELETE /transactions:", e.message);
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;