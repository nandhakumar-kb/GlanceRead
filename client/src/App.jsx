import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUpload from './pages/AdminUpload';
import AdminUsers from './pages/AdminUsers';
import ReadBook from './pages/ReadBook';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => {
    const location = useLocation();
    const isReader = location.pathname.startsWith('/read/');

    return (
        <ToastProvider>
            <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 dark:bg-black dark:text-gray-100 transition-colors duration-300">
                <ScrollToTop />
                {!isReader && <Navbar />}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/pricing" element={<Pricing />} />

                        {/* Protected Admin Route */}
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            <Route path="/admin/upload" element={<AdminUpload />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        <Route path="/read/:id" element={<ReadBook />} />
                    </Routes>
                </main>
                {!isReader && <Footer />}
            </div>
        </ToastProvider>
    );
};

export default App;
