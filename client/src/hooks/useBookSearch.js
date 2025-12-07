import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const useBookSearch = (initialQuery = '', initialCategory = 'All') => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialCategory);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const params = {};
                if (query) params.search = query;
                if (category && category !== 'All') params.category = category;

                const res = await axios.get(`${API_URL}/api/books`, { params });
                setBooks(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Failed to load books');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchBooks();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, category]);

    return { books, loading, error, query, setQuery, category, setCategory };
};

export default useBookSearch;
