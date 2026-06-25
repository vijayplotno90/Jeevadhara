"use client";
import { useState } from "react";

interface Plant {
  id: string;
  name: string;
  nameHi: string;
  emoji: string;
  type: string;
  season: string;
  fruitingTime: string;
  price: number;
  minQty: number;
  gradient: string;
  benefits: string[];
  badge?: string;
}

const PLANTS: Plant[] = [
  { id:"mango-alphonso", name:"Alphonso Mango Sapling", nameHi:"అల్ఫాన్సో మామిడి", emoji:"🥭", type:"Fruit", season:"Plant Jun–Aug", fruitingTime:"3–4 years", price:350, minQty:10, gradient:"from-yellow-100 to-amber-100", benefits:["Grafted 2yr old","GI-certified variety","High export demand","Suitable for Telangana"], badge:"🏆 Export Grade" },
  { id:"banana-g9", name:"G9 Banana Tissue Culture", nameHi:"జి9 అరటి", emoji:"🍌", type:"Fruit", season:"Year round", fruitingTime:"9–11 months", price:35, minQty:100, gradient:"from-yellow-50 to-lime-100", benefits:["Disease-free TC plant","40–50 kg bunch","1 year crop cycle","High yield"], badge:"⚡ Fast Crop" },
  { id:"coconut-west", name:"West Coast Tall Coconut", nameHi:"కొబ్బరి మొక్క", emoji:"🥥", type:"Perennial", season:"Plant Jun–Jul", fruitingTime:"5–6 years", price:120, minQty:25, gradient:"from-green-100 to-emerald-100", benefits:["80–100 nuts/year","Drought tolerant","50yr productive life","Good for Telangana"] },
  { id:"guava-l49", name:"L-49 Guava (Lucknow-49)", nameHi:"జామ చెట్టు", emoji:"🍐", type:"Fruit", season:"Plant Feb–Mar or Jun", fruitingTime:"2–3 years", price:80, minQty:20, gradient:"from-lime-100 to-green-100", benefits:["Sweet & seedless","2 crops/year","Grafted plant","High market demand"] },
  { id:"teak", name:"Teak Sapling (1yr)", nameHi:"టేకు మొక్క", emoji:"🌳", type:"Timber", season:"Plant Jun–Jul", fruitingTime:"15–20 years", price:45, minQty:100, gradient:"from-brown-50 to-amber-50", benefits:["Premium hardwood","₹2000+/CFT","Investment tree","Forest dept certified"] },
  { id:"moringa", name:"Moringa (Drumstick) PKM-1", nameHi:"మునగ చెట్టు", emoji:"🌿", type:"Vegetable tree", season:"Plant year round", fruitingTime:"6–8 months", price:25, minQty:50, gradient:"from-emerald-50 to-teal-100", benefits:["Flowers 6 months","High nutritional value","Export of leaves","5yr life"] },
  { id:"sitafal", name:"Sitaphal (Custard Apple) NA-1", nameHi:"సీతాఫలం", emoji:"🍈", type:"Fruit", season:"Plant Jul–Aug", fruitingTime:"2–3 years", price:180, minQty:15, gradient:"from-green-50 to-lime-50", benefits:["Telangana native","Grafted NA-1 variety","₹60–80/kg market","Minimal care needed"] },
  { id:"amla", name:"Amla (Gooseberry) NA-7", nameHi:"ఉసిరికాయ", emoji:"🟢", type:"Medicinal fruit", season:"Plant Jun–Jul", fruitingTime:"3–4 years", price:90, minQty:25, gradient:"from-teal-50 to-cyan-100", benefits:["Vitamin C highest","Pharma demand","Processing industry","Drought tolerant"], badge:"💊 Medicinal" },
];

export default function PlantationPage() {
  const [type, setType] = useState("all");
  const [added, setAdded] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});

  const types = ["all", ...Array.from(new Set(PLANTS.map(p => p.type)))];
  const visible = type === "all" ? PLANTS : PLANTS.filter(p => p.type === type);

  function getQty(id: string, min: number) { return qty[id] || min; }

  function addToCart(plant: Plant) {
    const q = getQty(plant.id, plant.minQty);
    const stored = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    const idx = stored.findIndex((i: { id: string }) => i.id === `plant-${plant.id}`);
    if (idx >= 0) stored[idx].qty += q;
    else stored.push({ id:`plant-${plant.id}`, name:plant.name, price:plant.price, unit:"sapling", qty:q, emoji:plant.emoji });
    localStorage.setItem("jd_cart", JSON.stringify(stored));
    window.dispatchEvent(new Event("storage"));
    setAdded(plant.id);
    setTimeout(() => setAdded(null), 1500);
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-1">🌱 Nursery & Plantation</h1>
          <p className="text-gray-500">Certified saplings & tissue culture plants — bulk orders welcome</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {types.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                type === t ? "bg-green-700 text-white" : "bg-white border text-gray-600 hover:border-green-400"
              }`}>{t === "all" ? "All Plants" : t}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(plant => (
            <div key={plant.id} className={`bg-gradient-to-br ${plant.gradient} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all`}>
              {plant.badge && <span className="inline-block text-xs bg-white/70 text-green-700 font-semibold px-2 py-0.5 rounded-full mb-2">{plant.badge}</span>}
              <div className="text-5xl mb-3">{plant.emoji}</div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{plant.name}</h3>
              <div className="flex gap-2 mt-1 mb-2 flex-wrap">
                <span className="text-xs bg-white/60 text-gray-600 px-2 py-0.5 rounded-full">{plant.type}</span>
                <span className="text-xs bg-white/60 text-green-700 px-2 py-0.5 rounded-full">🕒 {plant.fruitingTime}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">📅 {plant.season}</p>
              <ul className="space-y-1 mb-4">
                {plant.benefits.map((b, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-1.5"><span className="text-green-500">✓</span>{b}</li>
                ))}
              </ul>

              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setQty(q => ({...q, [plant.id]: Math.max(plant.minQty, getQty(plant.id, plant.minQty)-plant.minQty)}))} className="w-7 h-7 rounded-full bg-white border text-gray-600 hover:bg-green-100 text-sm font-bold">−</button>
                <span className="font-semibold text-gray-800 w-8 text-center">{getQty(plant.id, plant.minQty)}</span>
                <button onClick={() => setQty(q => ({...q, [plant.id]: getQty(plant.id, plant.minQty)+plant.minQty}))} className="w-7 h-7 rounded-full bg-white border text-gray-600 hover:bg-green-100 text-sm font-bold">+</button>
                <span className="text-xs text-gray-400">min {plant.minQty} saplings</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-green-800">₹{(plant.price * getQty(plant.id, plant.minQty)).toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-1">@₹{plant.price}/sapling</span>
                </div>
                <button onClick={() => addToCart(plant)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                    added === plant.id ? "bg-green-600 text-white" : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
                  }`}>
                  {added === plant.id ? "Added! ✓" : "Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
