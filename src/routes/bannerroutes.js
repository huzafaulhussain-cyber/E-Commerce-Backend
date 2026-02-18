const express = require("express");
const router = express.Router();
const bannerController = require("../Controller/bannercontroller.js");

// Carousel ke liye: GET http://localhost:5454/api/banners
router.get("/", bannerController.getBanners);

// Admin Panel ke liye: POST http://localhost:5454/api/banners
router.post("/", bannerController.updateBanners);

module.exports = router;