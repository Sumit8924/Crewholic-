const mongoose = require("mongoose");

const productAvailabilitySchema = new mongoose.Schema(
    {
        productId: {
            type: Number,
            required: true,
            unique: true,
        },
        productName: String,
        categoryName: String,
        isAvailable: {
            type: Boolean,
            default: true,
        },
        unavailableReason: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.ProductAvailability ||
    mongoose.model("ProductAvailability", productAvailabilitySchema);