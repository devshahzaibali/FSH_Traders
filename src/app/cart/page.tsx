'use client';
import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartContext';
import { db } from '../../firebase';
import { useAuth } from '@/components/AuthContext';
import LoginRequired from '@/components/LoginRequired';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <LoginRequired 
        title="Cart Login Required"
        message="Please log in to view your cart and make purchases."
      />
    );
  }

  const handleProceedToPayment = () => {
    setOrderError('');
    setOrderSuccess(false);
    router.push('/checkout/payment');
  };

  return (
    <div className="min-h-screen min-w-full bg-white flex flex-col pt-20">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto px-4"><BackButton /></div>
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
        <p className="text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </header>

      {/* Main Content - Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {cart.map(item => (
            <div key={item.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-900 font-semibold mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Remove
                </button>
              </div>
              
              <div className="mt-3 flex items-center border border-gray-300 rounded-md w-fit">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 text-center w-12">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Order Total</h3>
            <p className="text-xl font-bold text-gray-900">${total.toFixed(2)}</p>
          </div>
          {orderError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{orderError}</p>
              </div>
            </div>
          )}
          {orderSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-green-700 text-sm font-medium">Order placed successfully!</p>
                  <p className="text-green-600 text-xs mt-1">Check your email for confirmation and shipping details.</p>
                </div>
              </div>
            </div>
          )}
          <button 
            className={`w-full font-medium py-3 px-4 rounded-md transition-all duration-300 ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`} 
            onClick={handleProceedToPayment}
            disabled={isProcessing}
          >
            {'Proceed to Payment'}
          </button>
          <div className="mt-3 text-center">
            <Link href="/catalog" className="text-blue-600 hover:text-blue-800 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default CartPage;