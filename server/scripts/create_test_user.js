const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'test@glanceread.com';
        const password = 'password123';
        const username = 'TestUser';

        let user = await User.findOne({ email });
        if (user) {
            console.log('Test user already exists. Overwriting password...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log('Password reset to: password123');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                username,
                email,
                password: hashedPassword,
                role: 'admin' // Make them admin for testing
            });
            await user.save();
            console.log('Test user created successfully');
        }

        console.log('Credentials:');
        console.log('Email: test@glanceread.com');
        console.log('Password: password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
