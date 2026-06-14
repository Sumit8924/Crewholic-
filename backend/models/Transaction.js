// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    desc: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Income", "Expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    method: { type: String, default: "UPI", trim: true },
    status: { type: String, enum: ["Completed", "Pending", "Failed"], default: "Completed" },
    category: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);