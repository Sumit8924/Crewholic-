// routes/finance/tax.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const TaxRecord = require("../../models/TaxRecord");

router.get("/", auth, async (req, res) => {
    try {
        const records = await TaxRecord.find().sort({ createdAt: -1 }).lean();
        res.json({ records });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { quarter, type, amount, dueDate, status, notes } = req.body;
        if (!quarter || !type || !amount || !dueDate) {
            return res.status(400).json({ error: "quarter, type, amount, dueDate are required" });
        }
        const r = await TaxRecord.create({
            quarter, type,
            amount: Number(amount),
            dueDate, status, notes,
            createdBy: req.user?.id,
        });
        res.status(201).json({ record: r });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const r = await TaxRecord.findByIdAndUpdate(
            req.params.id,
            { ...req.body, amount: Number(req.body.amount) },
            { new: true, runValidators: true }
        );
        if (!r) return res.status(404).json({ error: "Tax record not found" });
        res.json({ record: r });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const r = await TaxRecord.findByIdAndDelete(req.params.id);
        if (!r) return res.status(404).json({ error: "Tax record not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;