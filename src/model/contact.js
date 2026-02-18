const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" }, // "Pending" ya "Resolved"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('contacts', contactSchema);