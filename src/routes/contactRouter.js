const express = require('express');
const router = express.Router();
const Contact = require('../model/contact');

router.post('/', async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;
        const newContact = new Contact({ fullName, email, subject, message });
        await newContact.save();
        res.status(200).json({ message: "Message sent successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin ke liye saare messages dekhne ki route
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;