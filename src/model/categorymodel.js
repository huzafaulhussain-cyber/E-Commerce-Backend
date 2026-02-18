const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  level: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3] // 0: Settings/Logo, 1: Top, 2: Second, 3: Third
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', default: null },
  image: { type: String, default: "" },
  featured: [{
    title: { type: String },
    image: { type: String }
  }],

  // ✅ JO AAPNE MANGI THIN (LOGO & SITENAME)
  logo: { type: String, default: "" },
  siteName: { type: String, default: "Premium Store" },

  createdAt: { type: Date, default: Date.now }
});

categorySchema.index({ slug: 1 });
module.exports = mongoose.model('categories', categorySchema);