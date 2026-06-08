const express = require("express");
const ProductAvailability = require("../models/ProductAvailability");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const availability = await ProductAvailability.find().sort({ productId: 1 });

        res.json({
            success: true,
            data: availability,
            availability,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product availability",
            error: err.message,
        });
    }
});

router.patch("/:productId", async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        const availability = await ProductAvailability.findOneAndUpdate(
            { productId },
            {
                productId,
                productName: req.body.productName,
                categoryName: req.body.categoryName,
                isAvailable: req.body.isAvailable,
                unavailableReason: req.body.unavailableReason || "",
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Product availability updated",
            availability,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update availability",
            error: err.message,
        });
    }
});

module.exports = router;