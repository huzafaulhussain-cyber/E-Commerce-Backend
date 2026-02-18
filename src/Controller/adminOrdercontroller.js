const orderService = require('../services/orderservice');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const ConfirmOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Added this line
        const order = await orderService.ConfirmOrder(orderId);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const ShipOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Added this line
        const order = await orderService.ShipOrder(orderId);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const DeliveredOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Added this line
        const order = await orderService.DeliveredOrder(orderId);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const CancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId; // Added this line
        const order = await orderService.CancelOrder(orderId);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderService.deleteOrder(orderId);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



module.exports = { getAllOrders, ConfirmOrder, ShipOrder, DeliveredOrder, CancelOrder, deleteOrder }