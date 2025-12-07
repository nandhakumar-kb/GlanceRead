import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Configure axios default header
                axios.defaults.headers.common['x-auth-token'] = token;

                // In a real app, you would fetch user data from backend here
                // const res = await axios.get('/api/auth/user');
                // setUser(res.data);

                // For now, we'll simulate it or decode if we had a decoder
                // Let's assume we store user info in local storage for this demo or fetch it
                // To keep it robust, let's try to fetch from the backend we built

                const res = await axios.get(`${API_URL}/api/auth/user`);
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Auth Error:', err);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['x-auth-token'];
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['x-auth-token'] = res.data.token;
            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['x-auth-token'] = res.data.token;
            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const saveBook = async (bookId) => {
        try {
            const res = await axios.put(`${API_URL}/api/auth/save/${bookId}`);
            setUser({ ...user, savedBooks: res.data });
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.response?.data?.message };
        }
    };

    const unsaveBook = async (bookId) => {
        try {
            const res = await axios.delete(`${API_URL}/api/auth/save/${bookId}`);
            setUser({ ...user, savedBooks: res.data });
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.response?.data?.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, saveBook, unsaveBook }}>
            {children}
        </AuthContext.Provider>
    );
};
