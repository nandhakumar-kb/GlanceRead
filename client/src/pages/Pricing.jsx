import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import gpayQr from '../assets/Gpay.jpg';
import { API_URL } from '../config';

const Pricing = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen pt-24 px-4 bg-background text-text-main text-center transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-text-main mb-6">
                    Invest in Your Brain
                </h1>
                <p className="text-xl text-text-muted mb-12">
                    Join smart readers saving <strong>300+ hours</strong> a year.
                </p>

                <div className="bg-surface p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold mb-4 text-primary-500">Premium Access</h2>
                    <p className="text-4xl font-bold mb-6 text-text-main">₹49<span className="text-sm font-normal text-text-muted">/mo</span></p>
                    <ul className="text-left space-y-4 mb-8 text-text-muted">
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span><strong>Unlimited Access</strong> to 1,000+ Summaries</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span><strong>High-Res Downloads</strong> for Offline Reading</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span><strong>New Books</strong> Added Every Week</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span>Support Independent Creators</span>
                        </li>
                    </ul>
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30"
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* GPay Modal */}
            <AnimatePresence>
                {showModal && (
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
                            <p className="text-text-muted mb-6">Use any UPI app to scan and pay.</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner border border-slate-200">
                                <img src={gpayQr} alt="GPay QR Code" className="w-48 h-48 object-contain" />
                            </div>

                            <div className="text-left bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800 mb-6">
                                <p className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2">Instructions:</p>
                                <ol className="list-decimal list-inside text-sm text-primary-700 dark:text-primary-300 space-y-1">
                                    <li>Scan QR with GPay / Paytm / PhonePe</li>
                                    <li>Pay <strong>₹49.00</strong></li>
                                    <li>Enter your Transaction ID below</li>
                                </ol>
                            </div>

                            {/* Transaction Input */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter Transaction ID / Reference No"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    id="txnId"
                                />
                                <button
                                    onClick={async () => {
                                        const txnId = document.getElementById('txnId').value;
                                        if (!txnId) return alert("Please enter a Transaction ID");

                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) return alert("Please login first");

                                            await fetch(`${API_URL}/api/users/transaction`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'x-auth-token': token
                                                },
                                                body: JSON.stringify({ transactionId: txnId })
                                            });
                                            alert("Submitted! We will verify and upgrade you shortly.");
                                            setShowModal(false);
                                        } catch (err) {
                                            alert("Failed to submit. Please contact support.");
                                        }
                                    }}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Submit for Verification
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pricing;
