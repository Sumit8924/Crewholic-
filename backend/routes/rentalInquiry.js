// routes/rentalInquiry.js
const express = require('express');
const router = express.Router();
const RentalInquiry = require('../models/RentalInquiry');

// POST - Create rental inquiry
router.post('/', async (req, res) => {
    try {
        const {
            name,
            mobile,
            email,
            productId,
            productName,
            categoryName,
            pricePerDay,
            rentalDays,
            totalPrice,
            requirements,
        } = req.body;

        // Validation
        if (!name || !mobile || !email || !productId || !rentalDays) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }

        const inquiry = new RentalInquiry({
            name,
            mobile,
            email,
            productId,
            productName,
            categoryName,
            pricePerDay,
            rentalDays,
            totalPrice,
            requirements,
            status: 'pending',
        });

        await inquiry.save();

        res.status(201).json({
            success: true,
            message: 'Rental inquiry created successfully',
            data: inquiry
        });
    } catch (error) {
        console.error('Rental inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET - Get all rental inquiries (admin)
router.get('/', async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = status ? { status } : {};

        const inquiries = await RentalInquiry.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await RentalInquiry.countDocuments(filter);

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PATCH - Update status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const inquiry = await RentalInquiry.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        );

        if (!inquiry) {
            return res.status(404).json({ success: false, message: 'Inquiry not found' });
        }

        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await RentalInquiry.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;