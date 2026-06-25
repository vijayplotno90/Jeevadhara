"use client";
import { useState } from "react";
import { ANIMALS, AnimalCategory } from "../../lib/animals";
import Link from "next/link";

const TABS: { label: string; value: AnimalCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "🐄 Cattle", value: "cattle" },
  { label: "🐃 Buffalo", value: "buffalo" },
  { label: "🐔 Poultry", value: "poultry" },
  { label: "🐑 Sheep", value: "sheep" },
  { label: "🐟 Fish", value: "fish" },
];

export default function AnimalsPage() {
  const [tab, setTab] = useState<AnimalCategory | "all">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);

  const visible = tab === "all" ? ANIMALS : ANIMALS.filter(a => a.category === tab);

  function addToCart(id: string, name: string, price: number) {
    const stored = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    const idx = stored.findIndex((i: { id: string }) => i.id === `animal-${id}`);
    if (idx >= 0) stored[idx].qty += 1;
    else stored.push({ id: `animal-${id}`, name, price, unit: "head", qty: 1, emoji: ANIMALS.find(a=>a.id===id)?.emoji || "🐄" });
    localStorage.setItem("jd_cart", JSON.stringify(stored));
    window.dispatchEvent(new Event("storage"));
    setAdded(id);
    setTimeout(() => setAdded(null), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-1">🐄 Livestock Bazaar</h1>
          <p className="text-gray-500">Quality breeds from verified farmers across Telangana & AP</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.value ? "bg-green-700 text-white shadow" : "bg-white text-gray-600 border hover:border-green-400"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(animal => (
            <div key={animal.id} className={`bg-gradient-to-br ${animal.gradient} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all`}>
              <div className="text-5xl mb-3">{animal.emoji}</div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{animal.name}</h3>
                  <p className="text-sm text-gray-500">{animal.breed} · {animal.origin}</p>
                </div>
                <span className="text-xs bg-white/60 text-gray-600 px-2 py-1 rounded-full capitalize">{animal.category}</span>
              </div>
              <ul className="mt-3 space-y-1 mb-4">
                {animal.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-1.5">
                    <span className="text-green-600">✓</span>{h}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-green-800">₹{animal.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-1">/{animal.unit}</span>
                </div>
                <button onClick={() => addToCart(animal.id, animal.name, animal.price)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    added === animal.id
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
                  }`}>
                  {added === animal.id ? "Added! ✓" : "Enquire"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
