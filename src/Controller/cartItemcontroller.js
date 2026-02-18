const cartItemService = require('../services/cartItemservice');

const updateCartItem = async (req, res) => {
    const user = await req.user;
    try {
        const cartItem = await cartItemService.updateCartItem(user._id, req.params.id, req.body);
        res.status(200).send(cartItem);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const removeCartItem = async (req, res) => {
    const user = await req.user;
    try {
        await cartItemService.removeCartItem(user._id, req.params.id);
        res.status(200).send({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { updateCartItem, removeCartItem }