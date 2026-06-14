// models/Budget.js
const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    allocated: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    month: { type: String, required: true }, // "YYYY-MM"
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Budget", BudgetSchema);