import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Shield, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import gpayQr from '../assets/Gpay.jpg';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const Pricing = () => {
    const { isAuthenticated } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePaymentClick = (plan) => {
        if (!isAuthenticated) {
            addToast('Please login to subscribe', 'info');
            navigate('/login');
            return;
        }
        setSelectedPlan(plan);
        setShowModal(true);
    };

    // Exit Intent Logic
    useEffect(() => {
        const handleMouseLeave = (e) => {
            if (e.clientY < 0 && !localStorage.getItem('exit_popup_shown')) {
                setShowExitPopup(true);
                localStorage.setItem('exit_popup_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    const plans = [
        {
            id: 'monthly',
            name: 'Monthly',
            price: '₹49',
            amount: 49,
            period: '/mo',
            features: ['Unlimited Access', 'High-Res Downloads', 'Cancel Anytime'],
            recommended: false
        },
        {
            id: 'annual',
            name: 'Annual',
            price: '₹499',
            amount: 499,
            period: '/yr',
            features: ['Best Value (Save 17%)', 'All Premium Features', 'Priority Support', 'Early Access'],
            recommended: true
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: '₹1499',
            amount: 1499,
            period: '/once',
            features: ['Pay Once, Own Forever', 'Founder Badge', 'Future Features Free', 'VIP Community'],
            recommended: false
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-background text-text-main transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-6">
                    Invest in Your Brain
                </h1>
                <p className="text-xl text-text-muted mb-16 max-w-2xl mx-auto">
                    Join smart readers saving <strong>300+ hours</strong> a year with our 5-minute visual summaries.
                </p>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-surface p-8 rounded-2xl shadow-xl border ${plan.recommended ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' : 'border-slate-200 dark:border-slate-800'} flex flex-col`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text-muted mb-2">{plan.name}</h3>
                                <div className="flex justify-center items-baseline gap-1">
                                    <span className="text-4xl font-bold text-text-main">{plan.price}</span>
                                    <span className="text-text-muted">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-text-muted">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePaymentClick(plan)}
                                className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${plan.recommended
                                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 text-text-main hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>



                {/* Social Proof */}
                <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-text-muted uppercase tracking-wider text-sm font-semibold mb-6">Trusted by Many Readers</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2"><Star className="fill-yellow-400 text-yellow-400" /> 4.9/5 Rating</div>
                        <div className="flex items-center gap-2"><Shield className="text-primary-500" /> Secure Payment</div>
                    </div>
                </div>
            </div>

            {/* GPay Modal */}
            <AnimatePresence>
                {showModal && selectedPlan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-surface p-8 rounded-2xl w-full max-w-md relative border border-slate-200 dark:border-slate-800 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-bold mb-2 text-text-main">Scan to Pay</h3>
                            <p className="text-text-muted mb-6">Use any UPI app to pay for <strong>{selectedPlan.name}</strong>.</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner border border-slate-200">
                                <img src={gpayQr} alt="GPay QR Code" className="w-48 h-48 object-contain" />
                            </div>

                            <div className="text-left bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800 mb-6">
                                <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">Instructions:</p>
                                <ol className="list-decimal list-inside text-sm text-primary-700 dark:text-primary-300 space-y-1">
                                    <li>Scan QR with GPay / Paytm / PhonePe</li>
                                    <li>Pay <strong>₹{selectedPlan.amount}.00</strong></li>
                                    <li>Enter your Transaction ID below</li>
                                </ol>
                            </div>

                            {/* Transaction Input */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-text-muted block mb-2">Transaction ID / Reference Number *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Transaction ID or UPI Ref No"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        id="txnId"
                                    />
                                </div>

                                <button
                                    onClick={async () => {
                                        const txnId = document.getElementById('txnId').value;

                                        if (!txnId || txnId.trim() === '') {
                                            addToast('Please enter Transaction ID', 'error');
                                            return;
                                        }

                                        setLoading(true);
                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                addToast('Please login first', 'error');
                                                return;
                                            }

                                            await axios.put(`${API_URL}/api/users/transaction`,
                                                { transactionId: txnId },
                                                {
                                                    headers: {
                                                        'x-auth-token': token,
                                                        'Content-Type': 'application/json'
                                                    }
                                                }
                                            );
                                            addToast('Payment submitted! We will verify and activate your premium shortly.', 'success');
                                            setShowModal(false);
                                            document.getElementById('txnId').value = '';
                                        } catch (err) {
                                            addToast(err.response?.data?.msg || 'Failed to submit. Please contact support.', 'error');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex justify-center items-center"
                                >
                                    {loading ? 'Uploading...' : 'Submit Verification'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Exit Intent Popup */}
            <AnimatePresence>
                {showExitPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowExitPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl w-full max-w-md relative border border-slate-200 dark:border-slate-800 shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowExitPopup(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">🎁</span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Wait! Don't Miss Out</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Get **50% OFF** your first month if you sign up right now. Discount applied at checkout.
                            </p>

                            <button
                                onClick={() => {
                                    setShowExitPopup(false);
                                    handlePaymentClick(plans[0]); // Select Monthly
                                }}
                                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 mb-3"
                            >
                                Claim 50% Off Offer
                            </button>
                            <button
                                onClick={() => setShowExitPopup(false)}
                                className="text-sm text-slate-400 hover:text-slate-600"
                            >
                                No thanks, I hate saving money
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pricing;
