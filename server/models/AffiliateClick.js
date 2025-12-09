const mongoose = require('mongoose');

const AffiliateClickSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Can be null for non-logged users
    },
    source: {
        type: String,
        enum: ['floating-button', 'header', 'end-book-popup', 'book-card', 'other'],
        default: 'other'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    // Track conversion if they tell us
    converted: {
        type: Boolean,
        default: false
    },
    // Session info for analytics
    userAgent: String,
    referrer: String
});

// Index for analytics queries
AffiliateClickSchema.index({ bookId: 1, timestamp: -1 });
AffiliateClickSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AffiliateClick', AffiliateClickSchema);
