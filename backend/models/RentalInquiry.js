// models/RentalInquiry.js
const mongoose = require('mongoose');

const rentalInquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    productId: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    rentalDays: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    requirements: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('RentalInquiry', rentalInquirySchema);