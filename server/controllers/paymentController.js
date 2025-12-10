const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

exports.createOrder = async (req, res) => {
    try {
        const { planId } = req.body;

        let amount = 0;
        switch (planId) {
            case 'monthly': amount = 4900; break;
            case 'annual': amount = 49900; break;
            case 'lifetime': amount = 149900; break;
            default: return res.status(400).json({ msg: 'Invalid plan selected' });
        }

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            planId
        } = req.body;

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder');

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // Calculate Expiry
        let expiryDate = new Date();
        if (planId === 'monthly') {
            expiryDate.setDate(expiryDate.getDate() + 30);
        } else if (planId === 'annual') {
            expiryDate.setDate(expiryDate.getDate() + 365);
        } else if (planId === 'lifetime') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 100);
        }

        // Update User Subscription
        await User.findByIdAndUpdate(req.user.id, {
            subscriptionStatus: 'active',
            planType: planId,
            subscriptionExpiry: expiryDate,
            transactionId: `RZP_${razorpayPaymentId}_${planId}`
        });

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
