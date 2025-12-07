const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const books = [
    {
        title: 'The Art of Focus',
        author: 'Dan Koe',
        coverImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80',
        category: 'Productivity',
        isPremium: true
    },
    {
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80',
        category: 'Productivity',
        isPremium: false
    },
    {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?w=1200&q=80',
        category: 'Wealth',
        isPremium: true
    },
    {
        title: 'Deep Work',
        author: 'Cal Newport',
        coverImage: 'https://images.unsplash.com/photo-1506784365371-1634bf5fe5e4?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1456324504439-367cee13d6a6?w=1200&q=80',
        category: 'Productivity',
        isPremium: true
    },
    {
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        coverImage: 'https://images.unsplash.com/photo-1565514020176-ade3f0402b8b?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=1200&q=80',
        category: 'Wealth',
        isPremium: false
    },
    {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        coverImage: 'https://images.unsplash.com/photo-1555449378-bd4632462e92?w=600&q=80',
        infographicImage: 'https://images.unsplash.com/photo-1550529882-a311899a61e3?w=1200&q=80',
        category: 'Psychology',
        isPremium: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await Book.deleteMany({});
        console.log('Cleared existing books...');

        await Book.insertMany(books);
        console.log('Books Seeded Successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
