const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    author: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    infographicImage: {
        type: String,
        required: false,
    },
    infographicImages: [{
        type: String,
        required: true,
    }],
    category: {
        type: String,
        required: true,
    },
    affiliateLink: {
        type: String,
        required: false,
    },
    isPremium: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
