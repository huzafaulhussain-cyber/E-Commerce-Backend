require("dotenv").config(); // local aur Railway me kaam karega
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../model/ordermodel");


const createPaymentLink = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    // console.log("Order Data from DB:", JSON.stringify(order, null, 2));


    const actualPrice = order.totalDiscountPrice || order.totalDiscountedPrice || order.totalPrice;

    if (!actualPrice) {
      console.error("Price Missing inside Order object");
      return res.status(400).send({ error: "Price not found in Order" });
    }

    const amount = Math.round(actualPrice * 100);
    // console.log("Final Amount to Charge:", amount);

    // Stripe Call
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "pkr",
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      success: true
    });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).send({ error: error.message });
  }
};

const updatePaymentInformation = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;
    // console.log("Updating Payment for Order:", orderId);  

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // 🛡️ SAFETY CHECK: Agar paymentDetails object exist nahi karta to naya banao
    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }

    // Ab values set karo
    order.paymentDetails.paymentId = paymentId;
    order.paymentDetails.paymentStatus = "COMPLETED";
    order.orderStatus = "CONFIRMED";

    await order.save();
    // console.log("Database Updated Successfully!");

    res.status(200).send({ message: "Order Placed & Payment Verified", success: true });
  } catch (error) {
    console.error("Update DB Error:", error.message); // Terminal mein error dekho
    res.status(500).send({ error: error.message });
  }
}


module.exports = { createPaymentLink, updatePaymentInformation };