"use client";
import React, { useState } from "react";
import { useAuth } from '@/components/AuthContext';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Link from "next/link";

export default function PaymentPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [payOnDelivery, setPayOnDelivery] = useState(true);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Save address to user profile if logged in
    if (user && user.uid) {
      await setDoc(doc(db, 'users', user.uid), { address }, { merge: true });
    }
    setSuccess('Order placed! Your address has been saved. Payment will be collected on delivery.');
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Payment</h1>
        <form onSubmit={handlePay} className="space-y-6 text-left">
          <div>
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Shipping Address</h2>
            <input name="fullName" value={address.fullName} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="Full Name" required />
            <input name="street" value={address.street} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="Street Address" required />
            <input name="city" value={address.city} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="City" required />
            <input name="state" value={address.state} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="State/Province" required />
            <input name="zip" value={address.zip} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="ZIP/Postal Code" required />
            <input name="country" value={address.country} onChange={handleAddressChange} className="w-full mb-2 px-3 py-2 border rounded" placeholder="Country" required />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Payment Method</h2>
            <div className="mb-2 flex items-center gap-2">
              <input type="radio" id="cod" name="payment" checked={payOnDelivery} onChange={() => setPayOnDelivery(true)} />
              <label htmlFor="cod" className="text-gray-700">Pay on Delivery (Cash/Card)</label>
            </div>
            <div className="mb-2 flex items-center gap-2 opacity-50">
              <input type="radio" id="card" name="payment" checked={!payOnDelivery} onChange={() => setPayOnDelivery(false)} disabled />
              <label htmlFor="card" className="text-gray-400">Credit/Debit Card (Coming Soon)</label>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-400 text-sm mb-2">
              Card payment setup coming soon. Please use Pay on Delivery for now.
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all text-lg" disabled={saving}>
            {saving ? 'Processing...' : payOnDelivery ? 'Place Order (Pay on Delivery)' : 'Pay Now'}
          </button>
        </form>
        {success && <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-green-700">{success}</div>}
        <Link href="/" className="block mt-6 text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    </div>
  );
} 