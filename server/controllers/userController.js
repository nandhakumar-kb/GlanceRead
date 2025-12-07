const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user subscription
// @route   PUT /api/users/:id/subscription
// @access  Admin
exports.updateSubscription = async (req, res) => {
    try {
        const { status } = req.body; // 'active' or 'inactive'

        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.subscriptionStatus = status;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update reading progress
// @route   PUT /api/users/progress
// @access  Private
exports.updateProgress = async (req, res) => {
    try {
        const { bookId, progress, sessionTime } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Update Total Time
        if (sessionTime) {
            user.totalReadTime = (user.totalReadTime || 0) + sessionTime;
        }

        // Update Book Progress
        const bookIndex = user.readingProgress.findIndex(p => p.bookId.toString() === bookId);

        if (bookIndex > -1) {
            user.readingProgress[bookIndex].progress = progress;
            user.readingProgress[bookIndex].lastRead = Date.now();
        } else {
            user.readingProgress.push({ bookId, progress, lastRead: Date.now() });
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Submit Transaction ID
// @route   PUT /api/users/transaction
// @access  Private
exports.submitTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.transactionId = transactionId;
        // Optionally auto-set to pending if adding status logic later
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (username) user.username = username;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // Remove password from response
        const userRes = user.toObject();
        delete userRes.password;

        res.json(userRes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
