const ordermodel = require('../model/ordermodel');
const orderService = require('../services/orderservice');


const createorder = async (req, res) => {
    const user = await req.user;
    try {
        const createorder = await orderService.createorder(user, req.body);
        res.status(200).send(createorder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const findOrderById = async (req, res) => {
    const user = await req.user;
    try {
        const createorder = await orderService.findOrderById(req.params.id);
        res.status(200).send(createorder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
const userOrderHistory = async (req, res) => {
    try {
        const user = await req.user;
        const createorder = await orderService.usersOrderHistory(user._id);
            // console.log("Fetching orders for User ID:", user._id);   

        res.status(200).send(createorder);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

 
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // URL se UserID milegi

    const orders = await ordermodel.find({ user: userId })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress") // Address bhi mil jayega
      .sort({ createdAt: -1 }); // Latest pehle

    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

 

  module.exports = { createorder, findOrderById, userOrderHistory ,getOrdersByUserId} 