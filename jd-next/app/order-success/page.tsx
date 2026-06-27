"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params  = useSearchParams();
  const ref     = params.get("ref")    || "XXXXXXXX";
  const total   = params.get("total")  || "0";
  const method  = params.get("method") || "upi";

  const methodLabel: Record<string, string> = {
    upi:  "UPI Payment",
    cod:  "Cash on Delivery",
    card: "Card Payment",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 w-full max-w-md text-center">

        {/* Success animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your fresh produce from Telangana farmers is on its way.
        </p>

        {/* Order details */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-mono font-bold text-gray-800">#{ref}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Paid</span>
            <span className="font-bold text-green-700 text-lg">₹{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Payment</span>
            <span className="text-sm font-medium text-gray-700">{methodLabel[method] || method}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Delivery</span>
            <span className="text-sm font-medium text-gray-700">Within 24–48 hrs</span>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 text-left text-sm text-green-800 space-y-2">
          <p className="font-semibold">🌾 What happens next?</p>
          <p>📞 Our team will call to confirm delivery time</p>
          <p>🚜 Farmer harvests fresh on your order day</p>
          <p>📦 Direct delivery from farm to your door</p>
        </div>

        <div className="space-y-3">
          <Link href="/fresh-harvest"
            className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 text-center">
            Continue Shopping
          </Link>
          <Link href="/"
            className="block text-green-600 text-sm font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
