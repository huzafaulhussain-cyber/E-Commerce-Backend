const Address = require('../model/addressmodel')
const CartService = require('../services/cartservice')
const Order = require('../model/ordermodel')
const OrderItem = require('../model/orderItemmodel')

async function createorder(user, shippingAddress) {
    let address;
    if (shippingAddress._id) {
        let isExistAddresses = await Address.findById(shippingAddress._id)
        address = isExistAddresses;
    } else {
        address = new Address(shippingAddress)
        address.user = user._id;
        await address.save()

        user.address.push(address);
        await user.save()
    }

    const cart = await CartService.findUserCart(user._id);
    const orderItems = [];
    for (const item of cart.cartItems) {
        const orderItem = new OrderItem({
            product: item.product,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            discountedPrice: item.discountedPrice,
            userId: item.userId,
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7))
        })
        const createdOrderItem = await orderItem.save();
        orderItems.push(createdOrderItem);
    }
    const createdOrder = new Order({
        user: user._id,
        orderItems: orderItems,
        totalPrice: cart.totalPrice,
        totalDiscountPrice: cart.totalDiscountedPrice,
        discount: cart.discounte,
        totalItems: cart.totalItem,
        shippingAddress: address,
    })
    const saveOrder = await createdOrder.save()
    return saveOrder
}

async function PlacedOrder(orderId) {
    const order = await findOrderById(orderId)
    order.orderStatus = 'PLACED';
    order.paymentDetails.paymentStatus = 'COMPLETED';
    return await order.save();
}
// ... other functions like createorder, PlacedOrder ...

async function ConfirmOrder(orderId) {
    const order = await findOrderById(orderId);
    order.orderStatus = 'CONFIRMED';
    return await order.save(); // Fixed: save and return the updated order
}

async function ShipOrder(orderId) {
    const order = await findOrderById(orderId);
    order.orderStatus = 'SHIPPED';
    return await order.save(); // Fixed: save and return the updated order
}

async function DeliveredOrder(orderId) {
    const order = await findOrderById(orderId);
    order.orderStatus = 'DELIVERED';
    return await order.save(); // Fixed: save and return the updated order
}

async function CancelOrder(orderId) {
    const order = await findOrderById(orderId);
    order.orderStatus = 'CANCELLED';
    return await order.save(); // Fixed: save and return the updated order
}

// ... other functions like findOrderById, getAllOrders, deleteOrder ...
async function findOrderById(orderId) {
    const order = await Order.findById(orderId)
        .populate('user')
        .populate({ path: 'orderItems', populate: { path: 'product' } })
        .populate('shippingAddress')
    return order;
}
async function usersOrderHistory(userId) {
  try {
    // 👇 Yahan check karo: hum 'user' field dhoond rahe hain jo userId se match kare
    const orders = await Order.find({ user: userId, orderStatus: { $ne: "PENDING" } }) 
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress")
      .sort({ createdAt: -1 }); // Latest order sabse upar

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
    return await Order.find()
        .populate("user")
        .populate({
            path: "orderItems",
            populate: {
                path: "product",
            },
        })
        .populate("shippingAddress");
}
async function deleteOrder(orderId) {
    const order = await findOrderById(orderId)
    await Order.findByIdAndDelete(order._id)
}



module.exports = { createorder, PlacedOrder, ConfirmOrder, ShipOrder, DeliveredOrder, CancelOrder, findOrderById, usersOrderHistory, getAllOrders, deleteOrder }
