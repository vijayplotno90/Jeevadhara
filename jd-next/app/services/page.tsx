"use client";
import { useState } from "react";

interface Service {
  id: string;
  name: string;
  category: string;
  emoji: string;
  description: string;
  price: string;
  provider: string;
  location: string;
  badge?: string;
}

const SERVICES: Service[] = [
  { id:"soil-test", category:"testing", name:"Soil Health Card Test", emoji:"🧪", description:"NPK, pH, micronutrients, organic carbon. Report in 7 days with fertilizer recommendations.", price:"₹299/sample", provider:"KVK Certified Lab", location:"Hyderabad", badge:"🏛️ Govt Certified" },
  { id:"drone-spray", category:"mechanized", name:"Drone Spraying Service", emoji:"🚁", description:"Per acre drone spraying — pesticide, fertilizer, or micronutrient. Covers 1 acre in 10 min.", price:"₹350/acre", provider:"AgroFly Services", location:"Warangal, Telangana" },
  { id:"tractor-hire", category:"mechanized", name:"Tractor Hire (with operator)", emoji:"🚜", description:"Ploughing, levelling, transport. Available by hour or day. Rotavator + disc plough attachments.", price:"₹600/hr", provider:"Farmer Collective", location:"Karimnagar, Telangana" },
  { id:"cold-storage", category:"storage", name:"Cold Storage (per ton/month)", emoji:"🧊", description:"Temperature-controlled 2–8°C for vegetables & fruits. Load/unload included.", price:"₹800/ton/mo", provider:"Warangal AgroCold", location:"Warangal, Telangana" },
  { id:"transport", category:"transport", name:"Farm-to-Market Transport", emoji:"🛻", description:"Refrigerated mini-truck for fresh produce. Same-day delivery to Hyderabad APMC.", price:"₹12/km", provider:"KisanLogistics", location:"Pan-Telangana" },
  { id:"expert-visit", category:"advisory", name:"Agronomist Farm Visit", emoji:"👨‍🌾", description:"Certified agronomist visits your farm, diagnoses crop issues, provides written prescription.", price:"₹499/visit", provider:"Jeevadhara Expert Desk", location:"Telangana & AP", badge:"⭐ Recommended" },
  { id:"insurance", category:"advisory", name:"PMFBY Insurance Enrollment", emoji:"🛡️", description:"Assisted enrollment in PM Fasal Bima Yojana. Covers crop loss, pest, and natural calamity.", price:"Free (Govt Scheme)", provider:"Govt of Telangana", location:"All districts", badge:"🆓 Free Service" },
  { id:"water-test", category:"testing", name:"Water Quality Testing", emoji:"💧", description:"pH, TDS, salinity, iron — for irrigation and borewell water. Prevents crop damage.", price:"₹199/sample", provider:"TSPCB Lab", location:"Hyderabad" },
];

const CATS = ["all", "testing", "mechanized", "storage", "transport", "advisory"];

export default function ServicesPage() {
  const [cat, setCat] = useState("all");
  const visible = cat === "all" ? SERVICES : SERVICES.filter(s => s.category === cat);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-1">🛠️ Farm Service Hub</h1>
          <p className="text-gray-500">Soil testing, drone spraying, cold storage, transport & expert advisory</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                cat === c ? "bg-green-700 text-white" : "bg-white border text-gray-600 hover:border-green-400"
              }`}>{c === "all" ? "All Services" : c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visible.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 flex gap-4">
              <div className="text-4xl flex-shrink-0">{s.emoji}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-800">{s.name}</h3>
                  {s.badge && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">{s.badge}</span>}
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-2">{s.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                  <span>👤 {s.provider}</span>
                  <span>📍 {s.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-700 text-base">{s.price}</span>
                  <button className="px-4 py-1.5 bg-green-700 text-white text-sm rounded-xl hover:bg-green-800 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
