const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', bookController.getAllBooks);

// @route   GET api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', bookController.getBookById);

// @route   POST api/books
// @desc    Create a book
// @access  Private (Admin only)
router.post(
    '/',
    [auth, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'infographicImages', maxCount: 5 }])],
    async (req, res, next) => {
        // Simple admin check
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    },
    bookController.createBook
);

// @route   DELETE api/books/:id
// @desc    Delete a book
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
}, bookController.deleteBook);

// @route   PUT api/books/:id
// @desc    Update a book
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
}, bookController.updateBook);

// @route   POST api/books/:id/affiliate-click
// @desc    Track affiliate link click
// @access  Public
router.post('/:id/affiliate-click', bookController.trackAffiliateClick);

// @route   GET api/books/:id/affiliate-analytics
// @desc    Get affiliate analytics for a book
// @access  Private (Admin only)
router.get('/:id/affiliate-analytics', auth, async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
}, bookController.getAffiliateAnalytics);

module.exports = router;
