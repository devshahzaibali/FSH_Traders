"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2, FiPackage, FiUsers, FiShoppingCart } from "react-icons/fi";
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from '../../components/AuthContext';
import { categories } from '../../data/categories';
import Image from 'next/image';
import { Product } from '@/data/products';

// Simple categories array instead of importing
const categoryList = categories.map(cat => cat.name);

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: Product[];
  total: number;
  status: string;
  createdAt: Date | string;
}

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

export default function AdminPanel() {
  const { user, role, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ 
    name: "", price: 0, category: "", image: "", description: "",
    stock: 0, rating: 4.5, reviewCount: 0,
    shipping: "Free shipping on orders over $50", returnPolicy: "30-day return policy",
    features: [], images: [], discount: 0, isFeatured: false, isActive: true, createdAt: undefined,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();
  const [formError, setFormError] = useState('');

  // Load data from Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User)));
    });
    return () => unsub();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | boolean | string[] = value;
    
    if (name === 'price' || name === 'stock' || name === 'rating' || name === 'reviewCount' || name === 'discount') {
      processedValue = parseFloat(value) || 0;
    } else if (name === 'isFeatured' || name === 'isActive') {
      processedValue = value === 'true';
    } else if (name === 'features') {
      processedValue = value.split(',').map(f => f.trim()).filter(f => f);
    } else if (name === 'images') {
      processedValue = value.split(',').map(img => img.trim()).filter(img => img);
    }
    
    setForm({ ...form, [name]: processedValue });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setUploading(true);
    
    if (!form.name || !form.price || !form.category) {
      setFormError('Name, price, and category are required.');
      setUploading(false);
      return;
    }
    
    try {
      if (editingId) {
        const ref = doc(db, "products", editingId);
        await updateDoc(ref, form);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "products"), { ...form, createdAt: new Date() });
      }
      setForm({ 
        name: "", price: 0, category: "", image: "", description: "",
        stock: 0, rating: 4.5, reviewCount: 0,
        shipping: "Free shipping on orders over $50", returnPolicy: "30-day return policy",
        features: [], images: [], discount: 0, isFeatured: false, isActive: true, createdAt: undefined,
      });
    } catch (err) {
      setFormError("Error saving product: " + err);
    }
    setUploading(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name, price: product.price, category: product.category,
      image: product.image, description: product.description || "", stock: product.stock || 0,
      rating: product.rating || 4.5, reviewCount: product.reviewCount || 0,
      shipping: product.shipping || "Free shipping on orders over $50",
      returnPolicy: product.returnPolicy || "30-day return policy",
      features: product.features || [], images: product.images || [],
      discount: product.discount || 0, isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false, createdAt: product.createdAt,
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiPackage /> Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiShoppingCart /> Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiUsers /> Users
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                >
                  <option value="All">All Categories</option>
                  {categoryList.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="text-sm text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>

            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInput}
                        placeholder="e.g., iPhone 15 Pro Max - Product name"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInput}
                        placeholder="e.g., 999.99 - Product price in USD"
                        step="0.01"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleInput}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                        required
                      >
                        <option value="">Choose product category</option>
                        {categoryList.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                      <input
                        type="number"
                        name="rating"
                        value={form.rating}
                        onChange={handleInput}
                        placeholder="e.g., 4.5 - Customer rating (0-5)"
                        step="0.1"
                        min="0"
                        max="5"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Reviews</label>
                      <input
                        type="number"
                        name="reviewCount"
                        value={form.reviewCount}
                        onChange={handleInput}
                        placeholder="e.g., 125 - Number of reviews"
                        min="0"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleInput}
                        placeholder="e.g., 50 - Available quantity"
                        min="0"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={form.discount}
                        onChange={handleInput}
                        placeholder="e.g., 15 - Discount percentage (0-100)"
                        min="0"
                        max="100"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                      <input
                        type="url"
                        name="image"
                        value={form.image}
                        onChange={handleInput}
                        placeholder="e.g., https://example.com/image.jpg - Main product image URL"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
                      <input
                        type="text"
                        name="images"
                        value={Array.isArray(form.images) ? form.images.join(', ') : ''}
                        onChange={handleInput}
                        placeholder="e.g., https://img1.jpg, https://img2.jpg - Additional image URLs (comma separated)"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Description & Features */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Description & Features</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInput}
                        placeholder="e.g., The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Perfect for photography enthusiasts and power users..."
                        rows={3}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Features</label>
                      <input
                        type="text"
                        name="features"
                        value={Array.isArray(form.features) ? form.features.join(', ') : ''}
                        onChange={handleInput}
                        placeholder="e.g., 5G, Face ID, Wireless charging, Water resistant - Product features (comma separated)"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Policies */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Policies & Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
                      <input 
                        type="text"
                        name="shipping"
                        value={form.shipping}
                        onChange={handleInput}
                        placeholder="e.g., Free shipping on orders over $50 - Shipping policy"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
                      <input
                        type="text"
                        name="returnPolicy"
                        value={form.returnPolicy}
                        onChange={handleInput}
                        placeholder="e.g., 30-day return policy - Return policy details"
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Product Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                      <select
                        name="isFeatured"
                        value={form.isFeatured ? 'true' : 'false'}
                        onChange={handleInput}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      >
                        <option value="false">Regular Product</option>
                        <option value="true">Featured Product (shown on homepage)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                      <select
                        name="isActive"
                        value={form.isActive ? 'true' : 'false'}
                        onChange={handleInput}
                        className="border border-gray-300 rounded px-4 py-2 w-full"
                      >
                        <option value="true">Active (visible to customers)</option>
                        <option value="false">Inactive (hidden from customers)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {formError && <div className="text-red-600 text-sm mt-4 bg-red-50 p-3 rounded">{formError}</div>}
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mt-6 w-full transition-colors" 
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                </button>
              </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
                    {product.image && product.image.trim() !== '' ? (
                      <Image src={product.image} alt={product.name} width={128} height={128} className="h-32 w-full object-contain rounded mb-2 bg-gray-50" />
                    ) : (
                      <div className="h-32 w-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2 rounded">No Image</div>
                    )}
                    <h2 className="font-bold text-lg text-blue-900">{product.name}</h2>
                    <p className="text-gray-700">${isNaN(product.price) ? '0.00' : product.price.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <p className="text-gray-400 text-xs">Stock: {isNaN(product.stock) ? '0' : product.stock}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEdit(product)} className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded px-2 py-1 flex items-center gap-1">
                        <FiEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 rounded px-2 py-1 flex items-center gap-1">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Recent Orders ({orders.length})</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-blue-700">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-600">{order.userEmail}</p>
                          <p className="text-xs text-gray-500">
                            {order.createdAt instanceof Date ? order.createdAt.toLocaleString() : order.createdAt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${isNaN(order.total) ? '0.00' : order.total.toFixed(2)}</p>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="mt-2 text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items?.map((item: Product, index: number) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            {item.image && item.image.trim() !== '' ? (
                              <Image src={item.image} alt={item.name} width={32} height={32} className="h-8 w-8 object-contain rounded bg-gray-100" />
                            ) : (
                              <div className="h-8 w-8 bg-gray-100 flex items-center justify-center text-gray-400 rounded text-xs">No Image</div>
                            )}
                            <span className="flex-1">{item.name}</span>
                            <span className="text-gray-600">Qty: {item.stock}</span>
                            <span className="font-medium">${isNaN(item.price) ? '0.00' : item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Registered Users ({users.length})</h2>
              {users.length === 0 ? (
                <p className="text-gray-500">No users registered yet.</p>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-blue-700">{user.email}</h3>
                        <p className="text-sm text-gray-600">User ID: {user.id}</p>
                        <p className="text-xs text-gray-500">
                          {user.createdAt instanceof Date ? user.createdAt.toLocaleString() : user.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={user.role || 'customer'}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="text-sm border rounded px-3 py-1"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}