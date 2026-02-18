const cartService = require('../services/cartservice');

const findUserCart = async (req, res) => {
    const user = req.user;
    try {
        const order = await cartService.findUserCart(user._id);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}
const addItemToCart = async (req, res) => {
    const user = req.user;
    try {
        const order = await cartService.addItemToCart(user._id, req.body);
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { findUserCart, addItemToCart }