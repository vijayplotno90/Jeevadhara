"use client";
import { useState } from "react";

interface Tool {
  id: string;
  name: string;
  category: string;
  emoji: string;
  price: number;
  unit: string;
  description: string;
  condition: string;
}

const TOOLS: Tool[] = [
  { id:"rotavator7", category:"mechanized", name:"Rotavator 7ft", emoji:"⚙️", price:65000, unit:"piece", description:"42 blades, fits 50HP+ tractor, PTO driven", condition:"used" },
  { id:"disc-plough", category:"mechanized", name:"Disc Plough (4 disc)", emoji:"🔩", price:42000, unit:"piece", description:"Heavy duty, ideal for dry black soil", condition:"used" },
  { id:"seed-drill", category:"mechanized", name:"Seed-cum-Fertilizer Drill", emoji:"🌱", price:55000, unit:"piece", description:"9-row, 250kg hopper, suitable for wheat/maize", condition:"new" },
  { id:"sprayer-knapsack", category:"hand", name:"Knapsack Sprayer 16L", emoji:"💦", price:1200, unit:"piece", description:"Battery operated, 2L/min output, adjustable nozzle", condition:"new" },
  { id:"weeder", category:"hand", name:"Power Weeder (7HP)", emoji:"🌿", price:38000, unit:"piece", description:"7 HP diesel, handles all soil types, reversible", condition:"new" },
  { id:"rice-transplanter", category:"mechanized", name:"Rice Transplanter 6-row", emoji:"🌾", price:185000, unit:"piece", description:"6-row, 0.8 acre/hr, mat nursery compatible", condition:"used" },
  { id:"chaff-cutter", category:"mechanized", name:"Chaff Cutter (Electric)", emoji:"✂️", price:22000, unit:"piece", description:"2HP motor, 500kg/hr capacity, adjustable blade", condition:"used" },
  { id:"pump-set", category:"mechanized", name:"Submersible Pump 5HP", emoji:"🔧", price:18000, unit:"piece", description:"5HP, 3-phase, 100m head, stainless impeller", condition:"used" },
  { id:"tarpaulin", category:"hand", name:"Tarpaulin 30×40ft", emoji:"🟦", price:3500, unit:"piece", description:"400 GSM, UV stabilized, grain storage grade", condition:"new" },
];

const CATEGORIES = ["all", "mechanized", "hand"];

export default function ImplementsPage() {
  const [cat, setCat] = useState("all");
  const [added, setAdded] = useState<string | null>(null);

  const visible = cat === "all" ? TOOLS : TOOLS.filter(t => t.category === cat);

  function addToCart(tool: Tool) {
    const stored = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    const idx = stored.findIndex((i: { id: string }) => i.id === `tool-${tool.id}`);
    if (idx >= 0) stored[idx].qty += 1;
    else stored.push({ id:`tool-${tool.id}`, name:tool.name, price:tool.price, unit:tool.unit, qty:1, emoji:tool.emoji });
    localStorage.setItem("jd_cart", JSON.stringify(stored));
    window.dispatchEvent(new Event("storage"));
    setAdded(tool.id);
    setTimeout(() => setAdded(null), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-1">🔧 Farm Tools & Implements</h1>
          <p className="text-gray-500">New and used farm equipment — best prices in Telangana</p>
        </div>

        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                cat === c ? "bg-green-700 text-white" : "bg-white border text-gray-600 hover:border-green-400"
              }`}>{c === "all" ? "All Tools" : c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(tool => (
            <div key={tool.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="text-4xl">{tool.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  tool.condition === "new" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>{tool.condition}</span>
                <span className="text-xs text-gray-400 capitalize">{tool.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-green-800">₹{tool.price.toLocaleString()}</span>
                <button onClick={() => addToCart(tool)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    added === tool.id ? "bg-green-600 text-white" : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  }`}>
                  {added === tool.id ? "Added! ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
