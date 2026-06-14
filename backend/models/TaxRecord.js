// models/TaxRecord.js
const mongoose = require("mongoose");

const TaxRecordSchema = new mongoose.Schema({
    quarter: { type: String, enum: ["Q1", "Q2", "Q3", "Q4"], required: true },
    type: { type: String, enum: ["GST", "TDS", "Income Tax", "Professional Tax", "Other"], required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Filed", "Overdue"], default: "Pending" },
    notes: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("TaxRecord", TaxRecordSchema);