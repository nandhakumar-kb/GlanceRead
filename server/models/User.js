const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    savedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    readingProgress: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        progress: {
            type: Number,
            default: 0
        },
        lastRead: {
            type: Date,
            default: Date.now
        }
    }],
    totalReadTime: {
        type: Number,
        default: 0
    },
    transactionId: {
        type: String,
        default: ''
    },
    subscriptionExpiry: {
        type: Date,
        default: null
    },
    planType: {
        type: String,
        enum: ['free', 'trial', 'monthly', 'annual', 'lifetime'],
        default: 'free'
    },
    // Referral System
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: String, // Store the referral code of the inviter
        default: null
    },
    referralCount: {
        type: Number,
        default: 0
    },
    // Free Trial Logic
    isTrialUsed: {
        type: Boolean,
        default: false
    },
    // Payment Verification
    transactionId: {
        type: String,
        default: null
    },
    paymentScreenshot: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'none'],
        default: 'none'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
