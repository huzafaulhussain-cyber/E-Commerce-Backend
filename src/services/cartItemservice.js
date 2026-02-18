const CartItem = require('../model/cartItemsmodel');

// Find cart item by ID and populate product
async function findCartItemById(cartItemId) {
    try {
        const cartItem = await CartItem.findById(cartItemId).populate('product');
        if (!cartItem) {
            throw new Error('Cart item not found');
        }
        return cartItem;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update a cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
    try {
        // (findCartItemById) ya top pa dekho is ko ya function sy aya ha ok.
        const item = await findCartItemById(cartItemId);

        // Authorization check
        if (item.userId.toString() !== userId.toString()) {
            throw new Error('You are not authorized to update this cart item');
        }

        // Update quantity and recalculate prices
        item.quantity = cartItemData.quantity;
        item.price = item.quantity * item.product.price;
        item.discountedPrice = item.quantity * item.product.discountedPrice;

        await item.save();
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
    try {
        const cartItem = await findCartItemById(cartItemId);

        // Authorization check
        if (cartItem.userId.toString() !== userId.toString()) {
            throw new Error('You are not authorized to remove this cart item');
        }

        await CartItem.findByIdAndDelete(cartItemId);
        return { message: 'Cart item removed successfully' };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    updateCartItem,
    removeCartItem,
    findCartItemById
};
