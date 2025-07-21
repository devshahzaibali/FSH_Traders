"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import React from 'react';
import { Product } from '@/data/products';
import Image from 'next/image';

// Define an OrderItem type that extends Product with quantity
type OrderItem = Product & { quantity: number };

const AccountPage = () => {
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    membership: 'Premium',
    joinDate: 'January 15, 2022',
    orderHistory: [
      { id: '#ORD-78945', date: 'Jun 12, 2023', total: '$149.99', status: 'Delivered' },
      { id: '#ORD-78123', date: 'May 28, 2023', total: '$89.50', status: 'Delivered' },
      { id: '#ORD-77654', date: 'Apr 5, 2023', total: '$234.95', status: 'Delivered' },
    ],
    wishlist: [
      { id: 1, name: 'Wireless Headphones', price: '$129.99', image: '/products/headphones.jpg' },
      { id: 2, name: 'Smart Watch', price: '$199.99', image: '/products/watch.jpg' },
    ],
  });

  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <main className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Account</h1>
        <p className="mb-4">You must be logged in to view your account.</p>
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">Login</a>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>My Account | PremiumShop</title>
        <meta name="description" content="Manage your account and orders" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, {userData.name}</span>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {userData.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 mb-2">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-lg font-semibold text-blue-900">{user.email}</div>
            <button onClick={logout} className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded transition">Logout</button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Welcome to your account!</h2>
            <p className="text-gray-600 mb-2">Here you can view your order history and manage your account details.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-blue-50 rounded-lg p-4 flex-1 min-w-[140px] text-center">
                <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
                <div className="text-gray-500 text-sm">Orders</div>
              </div>
              {/* Add more stats here if needed */}
                  </div>
                </div>
              </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Order History</h2>
          {orders.length === 0 ? (
            <div className="text-gray-500">No orders yet.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-700">Order #{order.id.slice(-6)}</span>
                    <span className="text-gray-500 text-sm">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item: OrderItem) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={40} height={40} className="h-10 w-10 object-contain rounded bg-gray-100" />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 flex items-center justify-center text-gray-400 rounded">No Image</div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-gray-500 text-sm">Qty: {item.quantity} &bull; ${isNaN(item.price) ? '0.00' : item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2 font-bold text-blue-900">Total: ${isNaN(order.total) ? '0.00' : order.total.toFixed(2)}</div>
                </div>
              ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AccountPage;