const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/save/:bookId
// @desc    Save a book
// @access  Private
router.put('/save/:bookId', auth, authController.saveBook);

// @route   DELETE api/auth/save/:bookId
// @desc    Unsave a book
// @access  Private
router.delete('/save/:bookId', auth, authController.removeBook);

module.exports = router;
