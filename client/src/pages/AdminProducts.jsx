import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, ExternalLink } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        link: '',
        price: '',
        description: '',
        category: 'Art' // Default
    });

    const { user } = useAuth();

    // Redirect if not admin
    if (user?.role !== 'admin') {
        return <div className="p-8 text-center">Access Denied</div>;
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/products`);
            setProducts(res.data);
        } catch (err) {
            setError('Failed to fetch products');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };

            if (isEditing) {
                await axios.put(`${API_URL}/api/products/${editId}`, formData, config);
                alert("Product Updated!");
            } else {
                await axios.post(`${API_URL}/api/products`, formData, config);
                alert("Product Added!");
            }

            // Reset
            setFormData({
                title: '',
                image: '',
                link: '',
                price: '',
                description: '',
                category: 'Art'
            });
            setIsEditing(false);
            setEditId(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditId(product._id);
        setFormData({
            title: product.title,
            image: product.image,
            link: product.link,
            price: product.price || '',
            description: product.description || '',
            category: product.category || 'Art'
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert("Failed to delete product");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({
            title: '',
            image: '',
            link: '',
            price: '',
            description: '',
            category: 'Art'
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-12">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h1>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                            <input
                                type="text"
                                name="price"
                                placeholder="$99.99"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="image"
                                required
                                placeholder="https://..."
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Affiliate Link</label>
                            <input
                                type="url"
                                name="link"
                                required
                                placeholder="https://amazon.com/..."
                                value={formData.link}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        <div className="col-span-2 flex gap-4">
                            <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
                            </Button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Manage Products ({products.length})</h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {products.map(product => (
                            <div key={product._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <img src={product.image} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{product.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>{product.category}</span>
                                            <span>•</span>
                                            <span className="text-primary-600 font-medium">{product.price}</span>
                                            <span>•</span>
                                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{product.clicks || 0} clicks</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Visit Link"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No products added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
