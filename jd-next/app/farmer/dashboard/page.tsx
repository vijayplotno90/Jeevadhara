"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  is_active: boolean;
  created_at: string;
  images: string[] | null;
}

interface MandiRate {
  crop: string;
  market: string;
  modal_price: number;
  unit: string;
}

const SERVICE_HUB = [
  { icon:"🐄", label:"Livestock Bazar", href:"/services/livestock", desc:"Buy/sell cattle, goats, poultry" },
  { icon:"🚜", label:"Vehicles & Tractors", href:"/services/vehicles", desc:"Rent tractors, tillers, harvesters" },
  { icon:"🔧", label:"Farm Tools", href:"/services/tools", desc:"Equipment and tool rentals" },
  { icon:"🌱", label:"Nursery", href:"/services/nursery", desc:"Seeds, saplings, plants" },
  { icon:"🍯", label:"Honey Market", href:"/services/honey", desc:"Wild honey, bee farming" },
  { icon:"🥚", label:"Egg Prices", href:"/services/eggs", desc:"Daily NECC egg prices" },
  { icon:"📰", label:"Web Stories", href:"/services/stories", desc:"Agri tips & farmer stories" },
  { icon:"👨‍🌾", label:"Kisan Expert", href:"/services/expert", desc:"Talk to agri experts" },
];

export default function FarmerDashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    if (role !== "farmer") { router.push("/auth/login"); return; }
    const n = localStorage.getItem("jd_name") || "Farmer";
    setName(n);

    async function load() {
      const userId = localStorage.getItem("jd_user_id") || "";
      const [prodRes, rateRes] = await Promise.all([
        fetch(`/api/products?my=1&farmer_id=${encodeURIComponent(userId)}`),
        fetch("/api/mandi-rates?limit=5"),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (rateRes.ok) setRates(await rateRes.json());
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <div className="text-center">
        <div className="text-5xl mb-4">🌾</div>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  );

  const activeCount = products.filter(p=>p.is_active).length;
  const totalValue = products.reduce((s,p)=>s+(Number(p.price_per_unit)*Number(p.available_qty||0)),0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🌾 Welcome, {name}!</h1>
          <p className="text-gray-500 text-sm mt-1">Farmer Dashboard · Jeevadhara AgriTech</p>
        </div>
        <Link href="/list-produce"
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 text-sm">
          + List New Produce
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:"Active Listings", value:activeCount, icon:"📦", color:"green" },
          { label:"Total Products", value:products.length, icon:"🌿", color:"blue" },
          { label:"Est. Inventory Value", value:`₹${totalValue.toFixed(0)}`, icon:"💰", color:"yellow" },
          { label:"Mandi Rates", value:rates.length, icon:"📊", color:"purple" },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* My Products */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Listed Produce</h2>
            <Link href="/list-produce" className="text-green-600 text-sm font-medium hover:underline">+ Add New</Link>
          </div>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">No produce listed yet</p>
              <Link href="/list-produce" className="mt-3 inline-block bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700">
                List Your First Produce
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map(p=>{
                const img = p.images?.[0] || null;
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                      <p className="text-xs text-gray-500">
                        ₹{Number(p.price_per_unit).toFixed(0)}/{p.unit} · {p.available_qty} {p.unit} available
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {p.is_active ? "✅ Live" : "⏳ Pending Review"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mandi Rates */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">📊 Today&apos;s Mandi Rates</h2>
              <Link href="/mandi-rates" className="text-green-600 text-sm font-medium hover:underline">View All</Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Crop</th>
                    <th className="px-4 py-3 text-left">Market</th>
                    <th className="px-4 py-3 text-right">Modal Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rates.map((r,i)=>(
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.crop}</td>
                      <td className="px-4 py-3 text-gray-500">{r.market}</td>
                      <td className="px-4 py-3 text-right text-green-700 font-semibold">₹{r.modal_price}/{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Service Hub sidebar */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🛠 Service Hub</h2>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_HUB.map(s=>(
              <Link key={s.label} href={s.href}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-green-200 transition-all">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-xs font-semibold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
