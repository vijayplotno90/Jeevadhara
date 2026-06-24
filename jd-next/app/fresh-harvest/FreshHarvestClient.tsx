"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  is_organic: boolean;
  farm_district: string;
  jeevadhara_certified: boolean;
  farmer_name: string;
  resolved_image: string;
}

export default function FreshHarvestClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [qtys, setQtys] = useState<Record<string, number>>({});

  function getQty(id: string) { return qtys[id] || 1; }

  function addToCart(p: Product) {
    try {
      const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
      const existing = cart.find((item: { id: string }) => item.id === p.id);
      if (existing) {
        existing.qty += getQty(p.id);
      } else {
        cart.push({
          id: p.id,
          name: p.name,
          image: p.resolved_image,
          price: p.price_per_unit,
          unit: p.unit,
          farmer: p.farmer_name,
          district: p.farm_district,
          qty: getQty(p.id),
        });
      }
      localStorage.setItem("jd_cart", JSON.stringify(cart));
      setAddedIds(prev => new Set([...prev, p.id]));
      setTimeout(() => {
        setAddedIds(prev => { const s = new Set(prev); s.delete(p.id); return s; });
      }, 1500);
      // Trigger nav cart count update
      window.dispatchEvent(new Event("storage"));
    } catch(e) { console.error(e); }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map(p => {
        const added = addedIds.has(p.id);
        const qty = getQty(p.id);
        return (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img src={p.resolved_image} alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = "/products/organic tomatoes.jpg"; }} />
              {p.is_organic && <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">🌱 Organic</span>}
              {p.jeevadhara_certified && <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">✓</span>}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</h3>
              {p.name_telugu && <p className="text-xs text-gray-400 mt-0.5">{p.name_telugu}</p>}
              <p className="text-xs text-gray-500 mt-1">📍 {p.farm_district} · {p.farmer_name}</p>

              <div className="flex items-center justify-between mt-2">
                <span className="text-green-700 font-bold">₹{p.price_per_unit}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span></span>
              </div>

              {/* Qty selector */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button onClick={() => setQtys(q => ({...q, [p.id]: Math.max(1, (q[p.id]||1)-1)})) }
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold">−</button>
                  <span className="text-sm font-semibold w-6 text-center">{qty}</span>
                  <button onClick={() => setQtys(q => ({...q, [p.id]: (q[p.id]||1)+1}))}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-700 font-bold">+</button>
                </div>
                <span className="text-xs text-gray-400">{p.unit}</span>
              </div>

              <button
                onClick={() => addToCart(p)}
                className={`w-full mt-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                  added
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
