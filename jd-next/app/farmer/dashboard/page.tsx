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

interface Order {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  payment_method: string;
  order_status: string;
  customer_name: string;
  customer_phone: string;
  customer_display_name: string;
  delivery_address: string;
  created_at: string;
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

type EditState = { price: string; stock: string };

export default function FarmerDashboard() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [userId, setUserId]     = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [rates, setRates]       = useState<MandiRate[]>([]);
  const [activeTab, setActiveTab] = useState<"products"|"orders">("products");
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditState>({ price: "", stock: "" });
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState<Record<string, string>>({});

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    if (role !== "farmer") { router.push("/auth/login"); return; }
    const n = localStorage.getItem("jd_name") || "Farmer";
    setName(n);
    const uid = localStorage.getItem("jd_user_id") || "";
    setUserId(uid);

    async function load() {
      const userId = uid;
      const [prodRes, rateRes, orderRes] = await Promise.all([
        fetch(`/api/products?my=1&farmer_id=${encodeURIComponent(userId)}`),
        fetch("/api/mandi-rates?limit=5"),
        fetch(`/api/orders?farmer_id=${encodeURIComponent(userId)}`),
      ]);
      if (prodRes.ok)  setProducts(await prodRes.json());
      if (rateRes.ok)  setRates(await rateRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
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

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditDraft({ price: String(Number(p.price_per_unit).toFixed(2)), stock: String(p.available_qty) });
  }

  async function saveEdit(productId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          farmer_id: userId,
          price: parseFloat(editDraft.price) || undefined,
          stock: parseFloat(editDraft.stock) || undefined,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, price_per_unit: parseFloat(editDraft.price), available_qty: parseFloat(editDraft.stock) }
              : p
          )
        );
        setSaveMsg((m) => ({ ...m, [productId]: "✅ Saved" }));
        setEditingId(null);
        setTimeout(() => setSaveMsg((m) => { const n = { ...m }; delete n[productId]; return n; }), 3000);
      }
    } finally { setSaving(false); }
  }

  const activeCount  = products.filter(p => p.is_active).length;
  const totalValue   = products.reduce((s, p) => s + (Number(p.price_per_unit) * Number(p.available_qty || 0)), 0);
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
  const pendingOrders = orders.filter(o => o.order_status === "confirmed").length;

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
          { label:"Active Listings",  value: activeCount,              icon:"📦" },
          { label:"Total Orders",     value: orders.length,            icon:"🛒" },
          { label:"Revenue Earned",   value:`₹${totalRevenue.toFixed(0)}`, icon:"💰" },
          { label:"Pending Dispatch", value: pendingOrders,            icon:"🚚" },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* My Products + Orders tabs */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab==="products" ? "bg-green-600 text-white" : "bg-white border text-gray-600 hover:border-green-300"}`}>
              📦 My Products ({products.length})
            </button>
            <button onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab==="orders" ? "bg-green-600 text-white" : "bg-white border text-gray-600 hover:border-green-300"}`}>
              🛒 Orders Received ({orders.length})
            </button>
            {activeTab === "products" && (
              <Link href="/list-produce" className="ml-auto text-green-600 text-sm font-medium hover:underline self-center">+ Add New</Link>
            )}
          </div>

          {/* Orders tab */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="font-medium">No orders yet</p>
                  <p className="text-sm mt-1">Orders from customers will appear here after admin certifies your products</p>
                </div>
              ) : orders.map(o => (
                <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{o.product_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          o.order_status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {o.order_status === "confirmed" ? "✅ Confirmed" : o.order_status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {o.payment_method === "cod" ? "💵 COD" : o.payment_method === "upi" ? "📱 UPI Paid" : "💳 Card Paid"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {o.quantity} {o.unit} × ₹{o.unit_price} = <strong className="text-green-700">₹{Number(o.total_price).toFixed(0)}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        👤 {o.customer_display_name || o.customer_name}
                        {o.customer_phone && (
                          <> · <a href={`tel:${o.customer_phone}`} className="text-blue-600 hover:underline">📞 {o.customer_phone}</a></>
                        )}
                      </p>
                      {o.delivery_address && (
                        <p className="text-xs text-gray-400 mt-0.5">📍 {o.delivery_address}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                      <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products tab */}
          {activeTab === "products" && (<div>
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
              {products.map(p => {
                const img = p.images?.[0] || null;
                const isEditing = editingId === p.id;
                return (
                  <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${isEditing ? "border-green-300 ring-1 ring-green-200" : "border-gray-100"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {img ? (
                          <img src={img} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                        {!isEditing ? (
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{Number(p.price_per_unit).toFixed(2)}/{p.unit} ·{" "}
                            <span className="font-medium text-gray-700">{p.available_qty} {p.unit}</span> in stock
                          </p>
                        ) : (
                          <p className="text-xs text-green-600 mt-0.5">Editing — update price & stock below</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {saveMsg[p.id] && (
                          <span className="text-xs text-green-600 font-medium">{saveMsg[p.id]}</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {p.is_active ? "✅ Live" : "⏳ Pending"}
                        </span>
                        {!isEditing ? (
                          <button onClick={() => startEdit(p)}
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                            ✏️ Edit
                          </button>
                        ) : (
                          <button onClick={() => setEditingId(null)}
                            className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                        )}
                      </div>
                    </div>

                    {/* Inline edit form */}
                    {isEditing && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 font-medium block mb-1">
                              Price (₹ per {p.unit})
                            </label>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-300">
                              <span className="px-2 text-gray-400 text-sm bg-gray-50 self-stretch flex items-center border-r border-gray-200">₹</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editDraft.price}
                                onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))}
                                className="w-full px-3 py-2 text-sm focus:outline-none"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium block mb-1">
                              Stock ({p.unit} available)
                            </label>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-300">
                              <input
                                type="number"
                                min="0"
                                value={editDraft.stock}
                                onChange={e => setEditDraft(d => ({ ...d, stock: e.target.value }))}
                                className="w-full px-3 py-2 text-sm focus:outline-none"
                                placeholder="0"
                              />
                              <span className="px-2 text-gray-400 text-sm bg-gray-50 self-stretch flex items-center border-l border-gray-200">{p.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => saveEdit(p.id)}
                            disabled={saving}
                            className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
                          >
                            {saving ? "Saving…" : "💾 Save Changes"}
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="px-4 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                          Price and stock update instantly — buyers see the new rate immediately.
                        </p>
                      </div>
                    )}
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
          </div>)}

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
