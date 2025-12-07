const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const checkLatest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const book = await Book.findOne().sort({ _id: -1 }); // Get last created book
        if (book) {
            console.log("--- LATEST BOOK ---");
            console.log(`Title: ${book.title}`);
            console.log(`Link:  '${book.affiliateLink}'`);
            console.log(`Premium: ${book.isPremium}`);
        } else {
            console.log("No books found.");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLatest();
