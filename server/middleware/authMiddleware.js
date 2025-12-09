const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check subscription expiry (Lazy Check)
        if (req.user.subscriptionExpiry && new Date(req.user.subscriptionExpiry) < new Date()) {
             // User is expired. We should ideally update DB, but for middleware speed we just mute the status in req.
             // To persist, we'd need to fetch user from DB.
             // Let's do a quick DB fetch to be safe and accurate.
             const User = require('../models/User'); 
             const user = await User.findById(req.user.id);
             if (user && user.subscriptionStatus === 'active' && user.subscriptionExpiry && new Date(user.subscriptionExpiry) < new Date()) {
                 user.subscriptionStatus = 'inactive';
                 await user.save();
                 req.user.subscriptionStatus = 'inactive';
             } else if (user) {
                // Refresh req.user with latest DB status (in case webhook updated it)
                req.user.subscriptionStatus = user.subscriptionStatus;
             }
        }
        
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
