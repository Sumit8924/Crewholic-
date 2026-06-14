// routes/finance/invoices.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Invoice = require("../../models/Invoice");

router.get("/", auth, async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
        res.json({ invoices });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { client, amount, issued, due, status, items } = req.body;
        if (!client || !amount || !issued || !due) {
            return res.status(400).json({ error: "client, amount, issued, due are required" });
        }
        const inv = await Invoice.create({
            client, amount: Number(amount),
            issued, due, status, items,
            createdBy: req.user?.id,
        });
        res.status(201).json({ invoice: inv });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const inv = await Invoice.findByIdAndUpdate(
            req.params.id,
            { ...req.body, amount: Number(req.body.amount) },
            { new: true, runValidators: true }
        );
        if (!inv) return res.status(404).json({ error: "Invoice not found" });
        res.json({ invoice: inv });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const inv = await Invoice.findByIdAndDelete(req.params.id);
        if (!inv) return res.status(404).json({ error: "Invoice not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;