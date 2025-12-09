const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/payment/orders
// @desc    Create a new Razorpay order
// @access  Private
router.post('/orders', auth, paymentController.createOrder);

// @route   POST api/payment/verify
// @desc    Verify payment signature
// @access  Private
router.post('/verify', auth, paymentController.verifyPayment);

module.exports = router;
