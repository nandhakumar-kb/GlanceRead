const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const checkLinks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        const books = await Book.find({});
        console.log(`Found ${books.length} books.`);

        books.forEach(b => {
            console.log(`Title: ${b.title}`);
            console.log(`Link:  ${b.affiliateLink || 'UNDEFINED'}`);
            console.log('---');
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkLinks();
