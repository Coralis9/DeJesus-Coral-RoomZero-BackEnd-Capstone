const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('MongoDB connection was successful');
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}`);
    }
};

module.exports = connectDB;