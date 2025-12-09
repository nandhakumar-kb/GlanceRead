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

module.exports = router;
