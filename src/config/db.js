const mongoose = require('mongoose');

const mongooseURL = process.env.MONGO_URI;

const connectdb = () => {
    return mongoose
        .connect(mongooseURL)
        .then(() => {
            console.log('✅ MongoDB Connected Successfully');
        })
        .catch((err) => {
            console.log('❌ MongoDB Connection Failed');
            console.log(err.message);
        });
};

module.exports = { connectdb };
