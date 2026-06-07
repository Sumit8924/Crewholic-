const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    label: String,
    url: String,
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ["product_image", "aadhar", "agreement", "other"],
    },
});

const rentalInquirySchema = new mongoose.Schema(
    {
        name: String,
        mobile: String,
        email: String,

        productId: Number,
        productName: String,
        categoryName: String,
        pricePerDay: Number,
        rentalDays: Number,
        totalPrice: Number,
        requirements: String,

        status: {
            type: String,
            enum: ["pending", "Pending", "Confirmed", "Active", "Completed", "Cancelled"],
            default: "Pending",
        },

        productImages: [String],
        customerAadhar: String,
        agreementDoc: String,
        documents: [documentSchema],
    },
    { timestamps: true }
);

const RentalInquiry =
    mongoose.models.RentalInquiry ||
    mongoose.model("RentalInquiry", rentalInquirySchema);

module.exports = RentalInquiry;