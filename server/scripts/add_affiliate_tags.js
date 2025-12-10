// Script to bulk add Amazon affiliate tags to book links
// Usage: node add_affiliate_tags.js

const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config({ path: '../.env' });

// Your Amazon Associate tag
const AFFILIATE_TAG = 'glanceread-21'; // Replace with your actual tag after approval

// Function to add affiliate tag to Amazon URL
function addAffiliateTag(url, tag) {
    if (!url) return url;

    // Check if it's an Amazon link
    if (!url.includes('amazon')) {
        return url;
    }

    // Check if tag already exists
    if (url.includes('tag=')) {
        console.log('Tag already exists in URL');
        return url;
    }

    // Add tag parameter
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tag=${tag}`;
}

// Main function
async function addAffiliateTags() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all books with affiliate links
        const books = await Book.find({ affiliateLink: { $exists: true, $ne: '' } });
        console.log(`\n📚 Found ${books.length} books with affiliate links`);

        let updatedCount = 0;

        for (const book of books) {
            const originalLink = book.affiliateLink;
            const newLink = addAffiliateTag(originalLink, AFFILIATE_TAG);

            if (originalLink !== newLink) {
                book.affiliateLink = newLink;
                await book.save();
                updatedCount++;
                console.log(`✓ Updated: ${book.title}`);
                console.log(`  Before: ${originalLink}`);
                console.log(`  After:  ${newLink}\n`);
            } else {
                console.log(`- Skipped: ${book.title} (already has tag or not Amazon link)`);
            }
        }

        console.log(`\n✅ Complete! Updated ${updatedCount} out of ${books.length} books`);

        // Show summary
        const booksWithoutLinks = await Book.countDocuments({
            $or: [
                { affiliateLink: { $exists: false } },
                { affiliateLink: '' }
            ]
        });

        console.log(`\n📊 Summary:`);
        console.log(`   Books with affiliate links: ${books.length}`);
        console.log(`   Books without affiliate links: ${booksWithoutLinks}`);
        console.log(`   Total books: ${books.length + booksWithoutLinks}`);

        if (booksWithoutLinks > 0) {
            console.log(`\n💡 Tip: Add affiliate links to ${booksWithoutLinks} more books to maximize revenue!`);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
    }
}

// Run the script
addAffiliateTags();
