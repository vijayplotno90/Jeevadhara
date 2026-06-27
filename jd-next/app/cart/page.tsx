"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  farmer: string;
  district: string;
  qty: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
      setItems(Array.isArray(cart) ? cart : []);
    } catch { setItems([]); }
    setLoaded(true);
  }, []);

  function updateQty(id: string, delta: number) {
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      );
      localStorage.setItem("jd_cart", JSON.stringify(updated));
      return updated;
    });
  }

  function removeItem(id: string) {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("jd_cart", JSON.stringify(updated));
      return updated;
    });
  }

  function clearCart() {
    setItems([]);
    localStorage.setItem("jd_cart", "[]");
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <p>Loading cart...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🛒 Your Cart</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">Clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mt-2">Add fresh produce from Telangana farmers</p>
          <Link href="/fresh-harvest"
            className="inline-block mt-6 bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700">
            Browse Fresh Harvest
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/products/organic tomatoes.jpg"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">🌾 {item.farmer} · 📍 {item.district}</p>
                  <p className="text-green-700 font-bold mt-1">₹{item.price}<span className="text-xs text-gray-400 font-normal">/{item.unit}</span></p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-white shadow-sm text-gray-700 hover:bg-green-50 font-bold flex items-center justify-center">
                        −
                      </button>
                      <span className="text-sm font-semibold w-8 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-white shadow-sm text-gray-700 hover:bg-green-50 font-bold flex items-center justify-center">
                        +
                      </button>
                      <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
                      <button onClick={() => removeItem(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 mt-0.5">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalItems})</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform fee</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Proceed to Checkout →
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Direct from farmer · No middlemen
              </p>

              <Link href="/fresh-harvest"
                className="block text-center text-green-600 text-sm font-medium mt-3 hover:underline">
                ← Continue Shopping
              </Link>
            </div>

            {/* Farmer trust badges */}
            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4 text-xs text-green-800 space-y-1">
              <p>✓ Farm-to-door delivery</p>
              <p>✓ No middlemen — farmers earn full price</p>
              <p>✓ Freshness guaranteed</p>
              <p>✓ Powered by AWS Aurora · Jeevadhara</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
