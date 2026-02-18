const express = require('express');
const router = express.Router();

const adminOrdercontroller = require('../Controller/adminOrdercontroller.js');
const ordercontroller = require("../Controller/ordercontroller.js"); // 👈 Import check karo
const { authenticate } = require('../middleware/authenticate.js');

// Get All Orders
router.get('/', authenticate, adminOrdercontroller.getAllOrders);

// 👇 Specific User Orders (Customer Details Page ke liye)
router.get("/user/:userId", authenticate, ordercontroller.getOrdersByUserId);

// Order Status Updates
router.put('/:orderId/confirm', authenticate, adminOrdercontroller.ConfirmOrder);
router.put('/:orderId/ship', authenticate, adminOrdercontroller.ShipOrder);
router.put('/:orderId/deliver', authenticate, adminOrdercontroller.DeliveredOrder);
router.put('/:orderId/cancel', authenticate, adminOrdercontroller.CancelOrder);
router.delete('/:orderId/delete', authenticate, adminOrdercontroller.deleteOrder);

module.exports = router;