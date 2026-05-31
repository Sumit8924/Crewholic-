// routes/inquiry.js

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
    try {
        const {
            service,
            timeline,
            name,
            mobile,
            email,
            requirements,
        } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "officialcrewholic@gmail.com",
            subject: `New Service Inquiry - ${service}`,
            html: `
                <h2>New Service Inquiry</h2>

                <p><b>Service:</b> ${service}</p>
                <p><b>Timeline:</b> ${timeline}</p>

                <hr/>

                <p><b>Name:</b> ${name}</p>
                <p><b>Mobile:</b> ${mobile}</p>
                <p><b>Email:</b> ${email}</p>

                <p><b>Requirements:</b></p>
                <p>${requirements}</p>

                <br/>
                <h3>Admin Action Required</h3>
                <p>Please review this inquiry.</p>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Inquiry sent successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to send inquiry",
        });
    }
});

module.exports = router;