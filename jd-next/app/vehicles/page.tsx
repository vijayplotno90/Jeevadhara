"use client";
import { useState } from "react";

type VehicleType = "tractor" | "harvester" | "sprayer" | "transport";
type Condition = "new" | "used" | "refurbished";

interface Vehicle {
  id: string;
  type: VehicleType;
  condition: Condition;
  name: string;
  brand: string;
  year: number;
  hp?: number;
  price: number;
  location: string;
  emoji: string;
  specs: string[];
  negotiable: boolean;
}

const VEHICLES: Vehicle[] = [
  { id:"mah575", type:"tractor", condition:"used", name:"Mahindra 575 DI", brand:"Mahindra", year:2021, hp:47, price:525000, location:"Hyderabad, Telangana", emoji:"🚜", specs:["47 HP","2WD","1450 engine hours","Power steering","New tyres"], negotiable:true },
  { id:"son745", type:"tractor", condition:"used", name:"Sonalika 745 DI", brand:"Sonalika", year:2022, hp:50, price:610000, location:"Warangal, Telangana", emoji:"🚜", specs:["50 HP","2WD","800 hours","Excellent condition","All documents clear"], negotiable:true },
  { id:"john5075", type:"tractor", condition:"new", name:"John Deere 5075E", brand:"John Deere", year:2025, hp:75, price:1150000, location:"Nizamabad, Telangana", emoji:"🚜", specs:["75 HP","4WD","PowerTech engine","Dealer warranty 2yr","Zero hours"], negotiable:false },
  { id:"cnh570", type:"harvester", condition:"used", name:"Preet 987 Combine", brand:"Preet", year:2020, hp:100, price:1850000, location:"Karimnagar, Telangana", emoji:"🌾", specs:["100 HP","2800 acres done","Rice+wheat compatible","AC cabin","GPS ready"], negotiable:true },
  { id:"spray400", type:"sprayer", condition:"new", name:"Self-Propelled Sprayer 400L", brand:"Aspee", year:2025, price:185000, location:"Adilabad, Telangana", emoji:"💧", specs:["400L tank","12m boom","Battery powered","GPS auto-shutoff","4 acre/hr coverage"], negotiable:false },
  { id:"mini407", type:"transport", condition:"used", name:"Mahindra Bolero Pickup", brand:"Mahindra", year:2021, price:620000, location:"Nalgonda, Telangana", emoji:"🛻", specs:["1.5 ton payload","CNG+Petrol dual fuel","80,000 km done","Good condition","RC & insurance valid"], negotiable:true },
];

const TYPE_TABS = [
  { label:"All", value:"all" },
  { label:"🚜 Tractors", value:"tractor" },
  { label:"🌾 Harvesters", value:"harvester" },
  { label:"💧 Sprayers", value:"sprayer" },
  { label:"🛻 Transport", value:"transport" },
];

export default function VehiclesPage() {
  const [type, setType] = useState("all");
  const [condition, setCondition] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = VEHICLES.filter(v =>
    (type === "all" || v.type === type) &&
    (condition === "all" || v.condition === condition)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-1">🚜 Farm Vehicles</h1>
          <p className="text-gray-500">Tractors, harvesters & farm transport — buy, sell or hire</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {TYPE_TABS.map(t => (
            <button key={t.value} onClick={() => setType(t.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                type === t.value ? "bg-green-700 text-white" : "bg-white border text-gray-600 hover:border-green-400"
              }`}>{t.label}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {["all","new","used","refurbished"].map(c => (
            <button key={c} onClick={() => setCondition(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                condition === c ? "bg-amber-500 text-white" : "bg-white border text-gray-500 hover:border-amber-400"
              }`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 h-32 flex items-center justify-center">
                <span className="text-6xl">{v.emoji}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-gray-800">{v.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    v.condition === "new" ? "bg-green-100 text-green-700" :
                    v.condition === "used" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>{v.condition}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{v.brand} · {v.year}{v.hp ? ` · ${v.hp} HP` : ""}</p>
                <p className="text-xs text-gray-400 mb-3">📍 {v.location}</p>

                {expanded === v.id && (
                  <ul className="mb-3 space-y-1">
                    {v.specs.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-1.5"><span className="text-green-500">•</span>{s}</li>
                    ))}
                  </ul>
                )}

                <button onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                  className="text-xs text-green-600 underline mb-3">
                  {expanded === v.id ? "Hide specs" : "View specs"}
                </button>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-800">₹{v.price.toLocaleString()}</span>
                    {v.negotiable && <span className="text-xs text-gray-400 ml-1">· Negotiable</span>}
                  </div>
                  <button className="px-4 py-1.5 bg-green-700 text-white text-sm rounded-xl hover:bg-green-800 transition-colors">
                    Contact
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
