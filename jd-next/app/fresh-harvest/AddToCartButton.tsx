"use client";
import { useState } from "react";

interface Props {
  product: {
    id: string; name: string; image: string;
    price: number; unit: string; farmer: string;
    district: string; farmer_id?: string; stock: number;
  };
}

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty  = Math.max(0, product.stock || 0);
  const outOfStock = maxQty === 0;
  const lowStock   = maxQty > 0 && maxQty <= 5;

  function addToCart() {
    if (outOfStock) return;
    try {
      const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
      const existing = cart.find((i: { id: string; qty: number }) => i.id === product.id);
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, maxQty);
      } else {
        cart.push({ ...product, qty: Math.min(qty, maxQty) });
      }
      localStorage.setItem("jd_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) { console.error(e); }
  }

  if (outOfStock) return (
    <div className="mt-3">
      <div className="w-full py-2 rounded-lg text-sm font-semibold text-center bg-gray-100 text-gray-400 border border-gray-200">
        Out of Stock
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      {lowStock && (
        <p className="text-xs text-amber-600 font-medium mb-1.5">
          ⚠️ Only {maxQty} {product.unit} left!
        </p>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center bg-gray-100 rounded-lg">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold text-lg">−</button>
          <span className="text-sm font-semibold w-6 text-center">{qty}</span>
          <button onClick={() => setQty(q => Math.min(q + 1, maxQty))}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold text-lg">+</button>
        </div>
        <span className="text-xs text-gray-400">{product.unit}</span>
      </div>
      <button onClick={addToCart}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          added
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}>
        {added ? "✓ Added to Cart!" : "Add to Cart"}
      </button>
    </div>
  );
}
