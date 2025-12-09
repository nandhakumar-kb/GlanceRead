const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const updateFreeBooks = async () => {
    await connectDB();
    try {
        const books = await Book.find().limit(5); // Get first 5 books
        for (const book of books) {
            book.isFree = true;
            await book.save();
            console.log(`Updated ${book.title} to be FREE`);
        }
        console.log('Done!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateFreeBooks();
