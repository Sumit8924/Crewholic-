const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                msg: "Name, email and message are required",
            });
        }

        if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
            return res.status(500).json({
                msg: "Brevo SMTP credentials missing in .env",
            });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Crewholic Website" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: subject || "New Contact Message from Crewholic Website",
            html: `
        <h2>New Contact Message From Website</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "Not provided"}</p>
        <p><b>Subject:</b> ${subject || "No subject"}</p>
        <hr />
        <p><b>Message:</b></p>
        <p>${message}</p>
        `,
        });

        return res.status(200).json({
            msg: "Message sent successfully",
        });
    } catch (error) {
        console.error("Brevo contact email error:", error);

        return res.status(500).json({
            msg: "Email failed",
            error: error.message,
        });
    }
});

module.exports = router;