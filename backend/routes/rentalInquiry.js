const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const RentalInquiry = require("../models/RentalInquiry");

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder = "crewholic/rentals/others";

        if (file.fieldname === "productImages") {
            folder = "crewholic/rentals/product-images";
        }

        if (file.fieldname === "aadhar") {
            folder = "crewholic/rentals/aadhar";
        }

        if (file.fieldname === "agreement") {
            folder = "crewholic/rentals/agreements";
        }

        return {
            folder,
            resource_type: "auto",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
        };
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 20,
    },
});

// CREATE RENTAL ORDER
router.post("/", async (req, res) => {
    try {
        const rental = await RentalInquiry.create(req.body);

        res.status(201).json({
            message: "Rental inquiry saved successfully",
            rental,
        });
    } catch (err) {
        console.error("CREATE RENTAL ERROR:", err);

        res.status(500).json({
            message: "Failed to save rental inquiry",
            error: err.message,
        });
    }
});

// GET ALL RENTAL ORDERS
router.get("/", async (req, res) => {
    try {
        const rentals = await RentalInquiry.find().sort({ createdAt: -1 });

        res.json({
            rentals,
        });
    } catch (err) {
        console.error("GET RENTALS ERROR:", err);

        res.status(500).json({
            message: "Failed to fetch rental inquiries",
            error: err.message,
        });
    }
});

// UPDATE STATUS
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        const rental = await RentalInquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!rental) {
            return res.status(404).json({
                message: "Rental order not found",
            });
        }

        res.json({
            message: "Status updated successfully",
            rental,
        });
    } catch (err) {
        console.error("UPDATE STATUS ERROR:", err);

        res.status(500).json({
            message: "Failed to update status",
            error: err.message,
        });
    }
});

// UPDATE RENTAL ORDER
router.patch("/:id", async (req, res) => {
    try {
        const rental = await RentalInquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!rental) {
            return res.status(404).json({
                message: "Rental order not found",
            });
        }

        res.json({
            message: "Rental order updated successfully",
            rental,
        });
    } catch (err) {
        console.error("UPDATE RENTAL ERROR:", err);

        res.status(500).json({
            message: "Failed to update rental order",
            error: err.message,
        });
    }
});

// UPLOAD DOCUMENTS TO CLOUDINARY
router.post(
    "/:id/documents",
    upload.fields([
        { name: "productImages", maxCount: 10 },
        { name: "aadhar", maxCount: 1 },
        { name: "agreement", maxCount: 1 },
        { name: "otherDocs", maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            console.log("UPLOAD ID:", req.params.id);
            console.log("CLOUDINARY FILES:", req.files);

            const rental = await RentalInquiry.findById(req.params.id);

            if (!rental) {
                return res.status(404).json({
                    message: "Rental order not found",
                });
            }

            const productImages =
                req.files?.productImages?.map((file) => file.path) || [];

            const newAadharUrl = req.files?.aadhar?.[0]?.path || null;
            const newAgreementUrl = req.files?.agreement?.[0]?.path || null;

            const otherDocs =
                req.files?.otherDocs?.map((file) => file.path) || [];

            const documents = [];

            productImages.forEach((url) => {
                documents.push({
                    label: "Product Image",
                    url,
                    uploadedAt: new Date(),
                    type: "product_image",
                });
            });

            if (newAadharUrl) {
                documents.push({
                    label: "Customer Aadhar",
                    url: newAadharUrl,
                    uploadedAt: new Date(),
                    type: "aadhar",
                });
            }

            if (newAgreementUrl) {
                documents.push({
                    label: "Rental Agreement",
                    url: newAgreementUrl,
                    uploadedAt: new Date(),
                    type: "agreement",
                });
            }

            otherDocs.forEach((url) => {
                documents.push({
                    label: "Other Document",
                    url,
                    uploadedAt: new Date(),
                    type: "other",
                });
            });

            rental.productImages = [
                ...(rental.productImages || []),
                ...productImages,
            ];

            if (newAadharUrl) {
                rental.customerAadhar = newAadharUrl;
            }

            if (newAgreementUrl) {
                rental.agreementDoc = newAgreementUrl;
            }

            rental.documents = [
                ...(rental.documents || []),
                ...documents,
            ];

            await rental.save();

            res.json({
                success: true,
                message: "Documents uploaded to Cloudinary successfully",
                rental,
            });
        } catch (err) {
            console.error("CLOUDINARY UPLOAD ERROR:", err);

            res.status(500).json({
                success: false,
                message: "Cloudinary document upload failed",
                error: err.message,
                fullError: err.errors || null,
            });
        }
    }
);

// DELETE RENTAL ORDER
router.delete("/:id", async (req, res) => {
    try {
        const rental = await RentalInquiry.findByIdAndDelete(req.params.id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental order not found",
            });
        }

        res.json({
            message: "Rental order deleted successfully",
        });
    } catch (err) {
        console.error("DELETE RENTAL ERROR:", err);

        res.status(500).json({
            message: "Failed to delete rental order",
            error: err.message,
        });
    }
});

module.exports = router;