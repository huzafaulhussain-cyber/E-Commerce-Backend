const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  // Logic wahi hai jo aap keh rahe hain
  images: [{ type: String, required: true }], 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Banner", bannerSchema);