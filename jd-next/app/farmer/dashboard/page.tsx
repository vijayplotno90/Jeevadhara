"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string; name: string; price_per_unit: number; unit: string;
  available_qty: number; is_active: boolean; created_at: string; images: string[] | null;
}
interface MandiRate { crop: string; market: string; modal_price: number; unit: string; }
interface Order {
  id: string; product_name: string; quantity: number; unit: string;
  unit_price: number; total_price: number; payment_method: string;
  order_status: string; customer_name: string; customer_phone: string;
  customer_display_name: string; delivery_address: string; created_at: string;
}
interface Enquiry {
  id: string; service_category: string; provider_name: string;
  provider_phone: string; enquiry_type: string; created_at: string;
}

const SERVICE_HUB = [
  { label:"My Purchases",         href:"/my-orders",    desc:"Orders you placed as buyer" },
  { label:"Fresh Harvest",        href:"/fresh-harvest",desc:"Buy from other farmers" },
  { label:"Livestock Bazar",      href:"/animals",      desc:"Buy/sell cattle, goats, poultry" },
  { label:"Vehicles and Tractors",href:"/vehicles",     desc:"Rent tractors, tillers, harvesters" },
  { label:"Farm Tools",           href:"/implements",   desc:"Equipment and tool rentals" },
  { label:"Nursery",              href:"/plantation",   desc:"Seeds, saplings, plants" },
  { label:"Honey Market",         href:"/honey",        desc:"Wild honey, bee farming" },
  { label:"Egg Prices",           href:"/egg-prices",   desc:"Daily NECC egg prices" },
  { label:"Kisan Expert",         href:"/jankari",      desc:"Talk to agri experts" },
  { label:"Services Hub",         href:"/services",     desc:"Borewell, solar, insurance..." },
];

const CAT_LABELS: Record<string, string> = {
  finance: "Banking & Agri-Finance", borewell: "Borewell & Water",
  insurance: "Insurance", storage: "Storage & Warehousing",
  seeds: "Seeds & Inputs", irrigation: "Irrigation",
  drones: "Drones & Spraying", transport: "Transport & Logistics",
  soil: "Soil Testing", vet: "Veterinary Services",
  solar: "Solar & Power", construction: "Farm Construction",
  equipment: "Equipment & Repair", telecom: "Agri-Tech & Telecom",
  training: "Training & Education", certification: "Certification & FSSAI",
  cooperative: "Cooperatives & FPO", media: "Agri Media & Photography",
  pest: "Pest Control", organic: "Organic Certification",
};

type EditState = { price: string; stock: string };
type Tab = "products" | "orders" | "services";

export default function FarmerDashboard() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [userId, setUserId]     = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [rates, setRates]       = useState<MandiRate[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditState>({ price: "", stock: "" });
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState<Record<string, string>>({});

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    if (role !== "farmer") { router.push("/auth/login"); return; }
    setName(localStorage.getItem("jd_name") || "Farmer");
    const uid = localStorage.getItem("jd_user_id") || "";
    setUserId(uid);

    async function load() {
      const [prodRes, rateRes, orderRes, enqRes] = await Promise.all([
        fetch(`/api/products?my=1&farmer_id=${encodeURIComponent(uid)}`),
        fetch("/api/mandi-rates?limit=5"),
        fetch(`/api/orders?farmer_id=${encodeURIComponent(uid)}`),
        fetch(`/api/enquiries?farmer_id=${encodeURIComponent(uid)}`),
      ]);
      if (prodRes.ok)  setProducts(await prodRes.json());
      if (rateRes.ok)  setRates(await rateRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
      if (enqRes.ok)   setEnquiries(await enqRes.json());
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <div className="text-center"><p className="text-5xl mb-4">...</p><p>Loading your dashboard...</p></div>
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
        body: JSON.stringify({ id: productId, farmer_id: userId, price: parseFloat(editDraft.price) || undefined, stock: parseFloat(editDraft.stock) || undefined }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, price_per_unit: parseFloat(editDraft.price), available_qty: parseFloat(editDraft.stock) } : p));
        setSaveMsg(m => ({ ...m, [productId]: "Saved" }));
        setEditingId(null);
        setTimeout(() => setSaveMsg(m => { const n = { ...m }; delete n[productId]; return n; }), 3000);
      }
    } finally { setSaving(false); }
  }

  const activeCount   = products.filter(p => p.is_active).length;
  const totalRevenue  = orders.reduce((s, o) => s + Number(o.total_price), 0);
  const pendingOrders = orders.filter(o => o.order_status === "confirmed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 px-8 py-7 shadow-lg">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url('/hero-farmer.jpg')", backgroundSize:"cover", backgroundPosition:"center top"}} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">🌾 Farmer Dashboard</p>
            <h1 className="text-3xl font-bold text-white">Welcome, {name}!</h1>
            <p className="text-green-200 text-sm mt-1">Your farm. Your price. Your buyers. Directly.</p>
          </div>
          <Link href="/list-produce" className="bg-amber-400 text-amber-900 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-300 text-sm shadow-md shrink-0">
            + List New Produce
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:"Active Listings",   value: activeCount,                   icon:"📦", bg:"bg-green-50",  val:"text-green-700",  border:"border-green-200" },
          { label:"Orders Received",   value: orders.length,                 icon:"🛒", bg:"bg-blue-50",   val:"text-blue-700",   border:"border-blue-200"  },
          { label:"Revenue Earned",    value:`₹${totalRevenue.toFixed(0)}`,  icon:"💰", bg:"bg-amber-50",  val:"text-amber-700",  border:"border-amber-200" },
          { label:"Service Enquiries", value: enquiries.length,              icon:"📞", bg:"bg-orange-50", val:"text-orange-700", border:"border-orange-200"},
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border ${s.border} p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.val}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "products" ? "bg-green-600 text-white" : "bg-white border text-gray-600 hover:border-green-300"}`}>
              My Products ({products.length})
            </button>
            <button onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "orders" ? "bg-green-600 text-white" : "bg-white border text-gray-600 hover:border-green-300"}`}>
              Orders Received ({orders.length})
            </button>
            <button onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "services" ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:border-blue-200"}`}>
              Services Used ({enquiries.length})
            </button>
            {activeTab === "products" && (
              <Link href="/list-produce" className="ml-auto text-green-600 text-sm font-medium hover:underline self-center">+ Add New</Link>
            )}
          </div>

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
                  <p className="font-medium">No orders yet</p>
                  <p className="text-sm mt-1">Orders from customers will appear here after admin certifies your products</p>
                </div>
              ) : orders.map(o => (
                <div key={o.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{o.product_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.order_status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {o.order_status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {o.payment_method === "cod" ? "COD" : o.payment_method === "upi" ? "UPI Paid" : "Card Paid"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {o.quantity} {o.unit} x Rs{o.unit_price} = <strong className="text-green-700">Rs{Number(o.total_price).toFixed(0)}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {o.customer_display_name || o.customer_name}
                        {o.customer_phone && (
                          <> - <a href={`tel:${o.customer_phone}`} className="text-blue-600 hover:underline">{o.customer_phone}</a></>
                        )}
                      </p>
                      {o.delivery_address && <p className="text-xs text-gray-400 mt-0.5">{o.delivery_address}</p>}
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div>
              {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
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
                            {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No img</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                            {!isEditing ? (
                              <p className="text-xs text-gray-500 mt-0.5">Rs{Number(p.price_per_unit).toFixed(2)}/{p.unit} - {p.available_qty} {p.unit} in stock</p>
                            ) : (
                              <p className="text-xs text-green-600 mt-0.5">Editing price and stock</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {saveMsg[p.id] && <span className="text-xs text-green-600 font-medium">{saveMsg[p.id]}</span>}
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {p.is_active ? "Live" : "Pending"}
                            </span>
                            {!isEditing ? (
                              <button onClick={() => startEdit(p)} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100">Edit</button>
                            ) : (
                              <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                            )}
                          </div>
                        </div>
                        {isEditing && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 font-medium block mb-1">Price (Rs per {p.unit})</label>
                                <input type="number" step="0.01" min="0" value={editDraft.price}
                                  onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-medium block mb-1">Stock ({p.unit})</label>
                                <input type="number" min="0" value={editDraft.stock}
                                  onChange={e => setEditDraft(d => ({ ...d, stock: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => saveEdit(p.id)} disabled={saving}
                                className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60">
                                {saving ? "Saving..." : "Save Changes"}
                              </button>
                              <button onClick={() => setEditingId(null)} className="px-4 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mandi rates */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Today's Mandi Rates</h2>
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
                      {rates.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{r.crop}</td>
                          <td className="px-4 py-3 text-gray-500">{r.market}</td>
                          <td className="px-4 py-3 text-right text-green-700 font-semibold">Rs{r.modal_price}/{r.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === "services" && (
            <div>
              {enquiries.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
                  <p className="text-4xl mb-3">📞</p>
                  <p className="font-medium">No service enquiries yet</p>
                  <p className="text-sm mt-1">Visit the Service Hub and click Enquire on any provider to log it here</p>
                  <Link href="/services" className="mt-3 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map(e => (
                    <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {CAT_LABELS[e.service_category] || e.service_category}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              e.enquiry_type === "call" ? "bg-green-100 text-green-700" :
                              e.enquiry_type === "website" ? "bg-purple-100 text-purple-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>
                              {e.enquiry_type === "call" ? "Called" : e.enquiry_type === "website" ? "Visited Website" : "Enquired"}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{e.provider_name || "Provider"}</p>
                          {e.provider_phone && (
                            <a href={`tel:${e.provider_phone}`} className="text-xs text-blue-600 hover:underline">{e.provider_phone}</a>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">{new Date(e.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Need a service?</p>
                  <p className="text-xs text-blue-700 mt-0.5">Browse 20+ service categories — borewell, solar, insurance, transport and more</p>
                </div>
                <Link href="/services" className="shrink-0 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-blue-700">
                  Service Hub
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {SERVICE_HUB.map(s => (
              <Link key={s.label} href={s.href}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-green-200 transition-all">
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
