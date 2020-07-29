const mongoose = require('mongoose');
const config = require('config');
const MONGODB_URL = config.get('mongourl');

const connectDB = async () => {
 try {
    await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    console.log('MongoDB Connected');
 } catch (e) {
    console.error(e.message);
    process.exit(1);
 }
};

module.exports = connectDB;