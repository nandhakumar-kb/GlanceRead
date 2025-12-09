const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Middleware to check if admin
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
    next();
};

// Routes
router.get('/', auth, adminCheck, userController.getAllUsers);
router.put('/:id/subscription', auth, adminCheck, userController.updateSubscription);
const upload = require('../middleware/upload');
router.put('/progress', auth, userController.updateProgress);
router.put('/transaction', auth, upload.single('screenshot'), userController.submitTransaction);
router.put('/profile', auth, userController.updateUser);
router.delete('/:id', auth, adminCheck, userController.deleteUser);

module.exports = router;
