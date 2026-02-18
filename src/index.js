const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const authrouter = require('./routes/authrouter.js')
app.use('/auth', authrouter)

const userrouter = require('./routes/userrouter.js')
app.use('/api/users', userrouter)

const productrouter = require('./routes/productrouter.js')
app.use('/api/products', productrouter)

// app.js mein check karein
const adminProductRouter = require('./routes/admiProductrouter.js'); // Spelling: admi -> admin
app.use('/api/admin/products', adminProductRouter);

const cartrouter = require('./routes/cartrouter.js')
app.use('/api/cart', cartrouter)

const cartItemrouter = require('./routes/cartItemrouter.js')
app.use('/api/cart_item', cartItemrouter)

const orderrouter = require('./routes/orderrouter.js')
app.use('/api/orders', orderrouter)

const adminorderrouter = require('./routes/adminOrderrouter.js')
app.use('/api/admin/order', adminorderrouter)

const reviewRouter = require('./routes/reviewrouter.js'); 
app.use('/api/reviews', reviewRouter); 

const paymentRouter = require("./routes/paymentRoutes.js"); // Path check karlena
app.use("/api/payments", paymentRouter);


const bannerRouter = require('./routes/bannerroutes.js'); // <-- Yeh line add karen
app.use("/api/banners", bannerRouter);                     // <-- Yeh line ab kaam karegi

const subscriberRouter = require('./routes/subscriberRouter');
app.use('/api/subscribers', subscriberRouter);

 const contactRouter = require('./routes/contactRouter'); // Path sahi check karna
app.use('/api/contacts', contactRouter);

const categoryRouter = require('./routes/categoryRouter');
app.use('/api/categories', categoryRouter);

 app.use('/api/settings', categoryRouter);

module.exports = app;