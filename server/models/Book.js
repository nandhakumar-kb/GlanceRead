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
    affiliateClicks: {
        type: Number,
        default: 0,
    },
    isPremium: {
        type: Boolean,
        default: true,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
