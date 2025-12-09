const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
    try {
        const { username, email, password, referralCode } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique referral code: First 3 chars of username + random hex
        let baseCode = username.slice(0, 3).toUpperCase();
        if (baseCode.length < 3) baseCode = "USR";
        const newReferralCode = baseCode + crypto.randomBytes(2).toString('hex').toUpperCase();

        // Free Trial Logic: 7 Days
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 7);

        user = new User({
            username,
            email,
            password: hashedPassword,
            referralCode: newReferralCode,
            subscriptionStatus: 'active',
            planType: 'trial',
            subscriptionExpiry: trialExpiry,
            isTrialUsed: true
        });

        // Referral Logic: Reward Referrer
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                user.referredBy = referralCode;
                referrer.referralCount = (referrer.referralCount || 0) + 1;

                // Reward: Add 30 days to referrer's expiry
                let currentExpiry = referrer.subscriptionExpiry && new Date(referrer.subscriptionExpiry) > new Date()
                    ? new Date(referrer.subscriptionExpiry)
                    : new Date();

                currentExpiry.setDate(currentExpiry.getDate() + 30);
                referrer.subscriptionExpiry = currentExpiry;

                // If referrer was inactive, reactivate them
                if (referrer.subscriptionStatus !== 'active') {
                    referrer.subscriptionStatus = 'active';
                    referrer.planType = 'referral_reward';
                }

                await referrer.save();
            }
        }

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        subscriptionStatus: user.subscriptionStatus,
                        subscriptionExpiry: user.subscriptionExpiry,
                        referralCode: user.referralCode
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        subscriptionStatus: user.subscriptionStatus,
                        subscriptionExpiry: user.subscriptionExpiry,
                        referralCode: user.referralCode,
                        savedBooks: user.savedBooks
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.saveBook = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const bookId = req.params.bookId;

        if (!user.savedBooks) {
            user.savedBooks = [];
        }

        if (user.savedBooks.includes(bookId)) {
            return res.status(400).json({ message: 'Book already saved' });
        }

        user.savedBooks.push(bookId);
        await user.save();
        res.json(user.savedBooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.removeBook = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const bookId = req.params.bookId;

        user.savedBooks = user.savedBooks.filter(id => id.toString() !== bookId);
        await user.save();
        res.json(user.savedBooks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
