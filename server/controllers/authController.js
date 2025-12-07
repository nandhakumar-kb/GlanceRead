const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
        });

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
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, subscriptionStatus: user.subscriptionStatus } });
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
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, subscriptionStatus: user.subscriptionStatus, savedBooks: user.savedBooks } });
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

        // Ensure savedBooks array exists check
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
