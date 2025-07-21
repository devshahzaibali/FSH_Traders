"use client";
import React from "react";
import Link from "next/link";

export default function ProceedPaymentPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Proceed to Payment</h1>
        <p className="text-gray-700 mb-6">
          Please review your order and click the button below to continue to payment setup.
        </p>
        <div className="mb-8">
          {/* Placeholder for order summary or payment method selection */}
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Order Summary</h2>
            <ul className="text-gray-600 text-sm list-disc list-inside">
              <li>Product(s) and total amount will be shown here.</li>
              <li>Shipping and billing info can be added here.</li>
            </ul>
            <div className="mt-4 text-blue-700 font-bold">Payment setup coming soon!</div>
          </div>
        </div>
        <Link href="/checkout/payment" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all text-lg">
          Continue to Payment
        </Link>
      </div>
    </div>
  );
} 