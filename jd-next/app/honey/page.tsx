"use client";
import { useState } from "react";

interface HoneyProduct {
  id: string;
  name: string;
  nameHi: string;
  emoji: string;
  origin: string;
  purity: string;
  gradient: string;
  price: number;
  unit: string;
  benefits: string[];
  badge?: string;
}

const PRODUCTS: HoneyProduct[] = [
  { id:"forest-wild", name:"Forest Wild Honey", nameHi:"జంగల్ తేనె", emoji:"🍯", origin:"Adilabad Forest, Telangana", purity:"100% Raw", gradient:"from-amber-100 to-yellow-200", price:850, unit:"kg", benefits:["Antibacterial","Rich minerals","Unprocessed","Dark & thick"], badge:"🏆 Best Seller" },
  { id:"sunflower", name:"Sunflower Honey", nameHi:"పొద్దుతిరుగుడు తేనె", emoji:"🌻", origin:"Nalgonda, Telangana", purity:"Natural Unfiltered", gradient:"from-yellow-100 to-orange-100", price:620, unit:"kg", benefits:["Light floral taste","High antioxidants","Good for immunity","Crystallizes naturally"] },
  { id:"multiflora", name:"Multiflora Honey", nameHi:"మల్టీఫ్లోరా తేనె", emoji:"🌸", origin:"Warangal, Telangana", purity:"Pure Wild", gradient:"from-pink-100 to-rose-100", price:720, unit:"kg", benefits:["Complex flavor","Mixed pollen","Seasonal harvest","NMR tested"] },
  { id:"beeswax", name:"Pure Beeswax", nameHi:"మైనపు", emoji:"🕯️", origin:"Karimnagar, Telangana", purity:"Food Grade", gradient:"from-amber-50 to-amber-100", price:1200, unit:"kg", benefits:["Cosmetic grade","Food wrapping","Natural preservative","Filtered clean"], badge:"💄 Cosmetic Grade" },
  { id:"propolis", name:"Propolis Extract 30%", nameHi:"ప్రొపోలిస్", emoji:"🧪", origin:"Nizamabad, Telangana", purity:"30% Extract", gradient:"from-brown-50 to-amber-100", price:2800, unit:"100ml", benefits:["Antimicrobial","Wound healing","Immune support","Alcohol extract"] },
  { id:"royal-jelly", name:"Royal Jelly", nameHi:"రాయల్ జెల్లీ", emoji:"👑", origin:"Hyderabad, Telangana", purity:"Fresh Frozen", gradient:"from-yellow-50 to-cream-100", price:4500, unit:"100g", benefits:["Anti-aging","Energy boost","Skin nutrition","Frozen fresh"], badge:"⭐ Premium" },
];

export default function HoneyPage() {
  const [added, setAdded] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});

  function getQty(id: string) { return qty[id] || 1; }

  function addToCart(p: HoneyProduct) {
    const q = getQty(p.id);
    const stored = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    const idx = stored.findIndex((i: { id: string }) => i.id === `honey-${p.id}`);
    if (idx >= 0) stored[idx].qty += q;
    else stored.push({ id:`honey-${p.id}`, name:p.name, price:p.price, unit:p.unit, qty:q, emoji:p.emoji });
    localStorage.setItem("jd_cart", JSON.stringify(stored));
    window.dispatchEvent(new Event("storage"));
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-1">🍯 Honey & Bee Products</h1>
          <p className="text-gray-500">Pure, raw honey from Telangana forests — farm to your door</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map(p => (
            <div key={p.id} className={`bg-gradient-to-br ${p.gradient} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all`}>
              {p.badge && (
                <span className="inline-block text-xs bg-white/70 text-amber-700 font-semibold px-2 py-0.5 rounded-full mb-2">{p.badge}</span>
              )}
              <div className="text-5xl mb-3">{p.emoji}</div>
              <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-1">📍 {p.origin}</p>
              <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-3">{p.purity}</span>
              <ul className="space-y-1 mb-4">
                {p.benefits.map((b, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-1.5"><span className="text-amber-500">✓</span>{b}</li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setQty(q => ({...q, [p.id]: Math.max(1, getQty(p.id)-1)}))
                } className="w-7 h-7 rounded-full bg-white border text-gray-600 font-bold text-sm hover:bg-amber-100">−</button>
                <span className="font-semibold text-gray-800 w-5 text-center">{getQty(p.id)}</span>
                <button onClick={() => setQty(q => ({...q, [p.id]: getQty(p.id)+1}))} className="w-7 h-7 rounded-full bg-white border text-gray-600 font-bold text-sm hover:bg-amber-100">+</button>
                <span className="text-sm text-gray-500">{p.unit}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-amber-800">₹{(p.price * getQty(p.id)).toLocaleString()}</span>
                <button onClick={() => addToCart(p)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    added === p.id ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
                  }`}>
                  {added === p.id ? "Added! ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
