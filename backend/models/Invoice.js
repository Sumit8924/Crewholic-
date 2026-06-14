// models/Invoice.js
const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    client: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    issued: { type: String, required: true },
    due: { type: String, required: true },
    status: { type: String, enum: ["Unpaid", "Paid", "Overdue"], default: "Unpaid" },
    items: { type: String, default: "", trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);