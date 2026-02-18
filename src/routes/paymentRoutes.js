// routes/paymentRoutes.js

const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/paymentController");
const { authenticate } = require("../middleware/authenticate");

// 👇👇 IMPORTANT FIX: Ye "/update" wali line ko SABSE UPAR rakho 👇👇
router.post("/update", authenticate, paymentController.updatePaymentInformation);

// 👇👇 Phir ye "/:orderId" wali line aani chahiye 👇👇
// Agar ye upar hui, to ye "/update" ko bhi ID samajh legi aur crash karegi
router.post("/:orderId", authenticate, paymentController.createPaymentLink);

module.exports = router;