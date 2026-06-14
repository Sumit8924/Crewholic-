// routes/finance/budgets.js
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Budget = require("../../models/Budget");

router.get("/", auth, async (req, res) => {
    try {
        const budgets = await Budget.find().sort({ month: -1 }).lean();
        res.json({ budgets });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { category, allocated, spent, month } = req.body;
        if (!category || !allocated || !month) {
            return res.status(400).json({ error: "category, allocated, month are required" });
        }
        const b = await Budget.create({
            category,
            allocated: Number(allocated),
            spent: Number(spent || 0),
            month,
            createdBy: req.user?.id,
        });
        res.status(201).json({ budget: b });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const b = await Budget.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                allocated: Number(req.body.allocated),
                spent: Number(req.body.spent || 0),
            },
            { new: true, runValidators: true }
        );
        if (!b) return res.status(404).json({ error: "Budget not found" });
        res.json({ budget: b });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const b = await Budget.findByIdAndDelete(req.params.id);
        if (!b) return res.status(404).json({ error: "Budget not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;