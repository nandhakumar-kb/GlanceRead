const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // console.log('Server continuing without DB connection...');
    // process.exit(1); 
  }
};

module.exports = connectDB;
