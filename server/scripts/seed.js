const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Book = require('../models/Book');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const books = [
    {
        title: 'The 5 AM Club',
        author: 'Robin Sharma',
        coverImage: '/assets/The 5 AM Club.jpg',
        infographicImage: '/assets/The 5 AM Club.jpg',
        category: 'Productivity',
        isPremium: true
    },
    {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: '/assets/The Psychology of Money.jpg',
        infographicImage: '/assets/The Psychology of Money.jpg',
        category: 'Finance',
        isPremium: false
    },
    {
        title: 'Zero to One',
        author: 'Peter Thiel',
        coverImage: '/assets/Zero to One.jpg',
        infographicImage: '/assets/Zero to One.jpg',
        category: 'Business',
        isPremium: true
    },
    {
        title: 'The Compound Effect',
        author: 'Darren Hardy',
        coverImage: '/assets/The Compound Effect.jpg',
        infographicImage: '/assets/The Compound Effect.jpg',
        category: 'Productivity',
        isPremium: false
    },
    {
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        coverImage: '/assets/Rich Dad Poor Dad.jpg',
        infographicImage: '/assets/Rich Dad Poor Dad.jpg',
        category: 'Finance',
        isPremium: true
    },
    {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        coverImage: '/assets/The Alchemist.jpg',
        infographicImage: '/assets/The Alchemist.jpg',
        category: 'Psychology',
        isPremium: false
    },
    {
        title: 'Dopamine Detox',
        author: 'Thibaut Meurisse',
        coverImage: '/assets/Dopamine Detox.jpg',
        infographicImage: '/assets/Dopamine Detox.jpg',
        category: 'Psychology',
        isPremium: true
    },
    {
        title: 'Start With Why',
        author: 'Simon Sinek',
        coverImage: '/assets/Start With Why.jpg',
        infographicImage: '/assets/Start With Why.jpg',
        category: 'Business',
        isPremium: true
    },
    {
        title: 'Wings of Fire',
        author: 'A.P.J. Abdul Kalam',
        coverImage: '/assets/Wings of Fire.jpg',
        infographicImage: '/assets/Wings of Fire.jpg',
        category: 'Biography',
        isPremium: false
    },
    {
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        coverImage: '/assets/Think and Grow Rich.jpg',
        infographicImage: '/assets/Think and Grow Rich.jpg',
        category: 'Finance',
        isPremium: true
    },
    {
        title: 'Coffee Can Investing',
        author: 'Saurabh Mukherjea',
        coverImage: '/assets/Coffee Can Investing.jpg',
        infographicImage: '/assets/Coffee Can Investing.jpg',
        category: 'Finance',
        isPremium: true
    },
    {
        title: 'The 4-Hour Workweek',
        author: 'Tim Ferriss',
        coverImage: '/assets/The 4-Hour Workweek.jpg',
        infographicImage: '/assets/The 4-Hour Workweek.jpg',
        category: 'Productivity',
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
