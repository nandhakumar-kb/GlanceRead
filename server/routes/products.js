const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   POST api/products
// @desc    Create a product
// @access  Private (Admin only)
router.post(
    '/',
    auth,
    async (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    },
    productController.createProduct
);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put(
    '/:id',
    auth,
    async (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    },
    productController.updateProduct
);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete(
    '/:id',
    auth,
    async (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    },
    productController.deleteProduct
);

// @route   POST api/products/:id/click
// @desc    Track product link click
// @access  Public
router.post('/:id/click', productController.trackProductClick);

module.exports = router;
