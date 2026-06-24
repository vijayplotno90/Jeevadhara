"use client";
import { useState } from "react";

interface Props {
  product: { id: string; name: string; image: string; price: number; unit: string; farmer: string; district: string };
}

export default function AddToCartButton({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
      const existing = cart.find((i: { id: string }) => i.id === product.id);
      if (existing) { existing.qty += qty; } 
      else { cart.push({ ...product, qty }); }
      localStorage.setItem("jd_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch(e) { console.error(e); }
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center bg-gray-100 rounded-lg">
          <button onClick={() => setQty(q => Math.max(1, q-1))}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold text-lg">−</button>
          <span className="text-sm font-semibold w-6 text-center">{qty}</span>
          <button onClick={() => setQty(q => q+1)}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold text-lg">+</button>
        </div>
        <span className="text-xs text-gray-400">{product.unit}</span>
      </div>
      <button onClick={addToCart}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
          added ? "bg-green-100 text-green-700 border border-green-300" : "bg-green-600 text-white hover:bg-green-700"
        }`}>
        {added ? "✓ Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
