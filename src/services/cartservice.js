const Cart = require('../model/cartmodel')
const CartItem = require('../model/cartItemsmodel')
const Product = require('../model/productmodel')

async function createCart(user) {
    try {
        const cart = new Cart({ user })
        const createdcart = await cart.save();
        return createdcart;
    } catch (error) {
        throw new Error(error.message)
    }
}

async function findUserCart(userId) {
    try {
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = await createCart(userId)
        }
        const cartItems = await CartItem.find({ cart: cart._id }).populate('product');

        if (cart.toObject) {
            cart = cart.toObject();
        }
        cart.cartItems = cartItems;

        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (const CartItem of cart.cartItems) {
            totalPrice += CartItem.price;
            totalDiscountedPrice += CartItem.discountedPrice;
            totalItem += CartItem.quantity;
        }
        cart.totalPrice = totalPrice;
        cart.totalDiscountedPrice = totalDiscountedPrice;
        cart.totalItem = totalItem;
        cart.discounte = totalPrice - totalDiscountedPrice;
        return cart

    } catch (error) {
        throw new Error(error.message)
    }
}
async function addItemToCart(userId, req) {
    try {
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = await createCart(userId)
        }
        const product = await Product.findById(req.productId)
        const ispresent = await CartItem.findOne({ cart: cart._id, product: product._id, userId })
        if (!ispresent) {
            const cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                userId,
                quantity: 1,
                price: product.price,
                discountedPrice: product.discountedPrice,
                size: req.size,
            })
            const savedCartItem = await cartItem.save();
            cart.cartItems.push(savedCartItem);
            await cart.save();
            return savedCartItem;
        }
        return ispresent;
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { createCart, findUserCart, addItemToCart }