const express = require('express');
const router = express.Router();
const Subscriber = require('../model/subscriber');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'huzafaulhussain@gmail.com',
        pass: 'ypjn tdgm akxl ayjb'
    }
});

// 1. Naya User Subscribe karega (Homepage Footer ke liye)
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ message: "Email zaroori hai!" });

        const exists = await Subscriber.findOne({ email });
        if (exists) return res.status(400).send({ message: "Aap pehle hi subscribe hain!" });

        const newSub = new Subscriber({ email });
        await newSub.save();
        res.status(200).send({ message: "Mubarak ho! Subscribe ho gaya." });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 2. Admin saaray subscribers dekh sakta hai
router.get('/', async (req, res) => {
    try {
        const subs = await Subscriber.find().sort({ createdAt: -1 });
        res.status(200).send(subs);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// 3. Sab ko aik saath Promotion bhejne ki API
router.post('/send-bulk-email', async (req, res) => {
    try {
        const { subject, title, message, bannerUrl, buttonLink } = req.body;

        const subscribers = await Subscriber.find();
        const emailList = subscribers.map(sub => sub.email);

        if (emailList.length === 0) return res.status(400).send({ message: "Koi subscriber nahi mila!" });

        // Khoobsurat HTML Email Template
        const htmlContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 15px; overflow: hidden; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
                <img src="${bannerUrl}" alt="Promotion" style="width: 100%; height: auto;" />
                <div style="padding: 30px; text-align: center; background-color: #ffffff;">
                    <h1 style="color: #9155FD; margin-bottom: 20px;">${title}</h1>
                    <p style="color: #444; font-size: 16px; line-height: 1.6;">${message}</p>
                    <a href="${buttonLink}" style="display: inline-block; padding: 15px 30px; background-color: #9155FD; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 25px; box-shadow: 0px 4px 10px rgba(145, 85, 253, 0.3);">
                        SHOP NOW
                    </a>
                </div>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777;">
                    Aap hamari website par subscribed hain. <br> © 2024 Your Premium Store
                </div>
            </div>
        `;

        const mailOptions = {
            from: `"Premium Store" <${process.env.EMAIL_USER}>`,
            bcc: emailList, // BCC is safer for privacy
            subject: subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: "Email sab ko chali gayi!" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Subscriber delete karne ki API
router.delete('/:id', async (req, res) => {
    try {
        const sub = await Subscriber.findByIdAndDelete(req.params.id);
        if (!sub) return res.status(404).send({ message: "Subscriber nahi mila!" });
        res.status(200).send({ message: "Subscriber delete ho gaya!" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;