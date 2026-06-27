"use client";
import { useState, useEffect, useCallback } from "react";

const ADMIN_AUTH = btoa("jeevadhara:Plotno90@");

interface Farmer { id: string; name: string; phone: string; district: string; village: string; created_at: string; }
interface Product { id: string; name: string; category: string; price: number; unit: string; stock: number; image_url: string | null; description: string; district: string; is_active: boolean; is_organic: boolean; created_at: string; farmer_name: string; farmer_phone: string; farmer_id: string; }
interface Customer { id: string; name: string; phone: string; district: string; village: string; created_at: string; order_count: number; total_spent: number; last_order: string | null; }
interface FarmerAnalytics { farmer_id: string; farmer_name: string; farmer_phone: string; district: string; village: string; unique_customers: number; total_orders: number; total_revenue: number; last_order: string | null; }
interface FarmerCustomer { customer_id: string; customer_name: string; customer_phone: string; customer_district: string; order_count: number; total_spent: number; last_order: string; }
interface FarmerEnquiry { id: string; service_category: string; provider_name: string; provider_phone: string; enquiry_type: string; created_at: string; }
interface ToolListing { id: string; name: string; slug: string; category: string; brand: string; condition: string; price: number; unit: string; stock: number; image_url: string | null; description: string; district: string; village: string; is_active: boolean; created_at: string; seller_name: string; seller_phone: string; seller_id: string; }
interface VehicleListing { id: string; name: string; vehicle_type: string; brand: string; model: string; year: number; condition: string; price: number; image_url: string | null; description: string; district: string; village: string; is_active: boolean; created_at: string; seller_name: string; seller_phone: string; seller_id: string; }
interface LivestockListing { id: string; name: string; breed: string; livestock_category: string; price: number; quantity: number; image_url: string | null; description: string; district: string; village: string; is_active: boolean; created_at: string; seller_name: string; seller_phone: string; seller_id: string; }

type EditDraft = { price: string; is_organic: boolean; name: string; }
type TabType = "pending" | "active" | "farmers" | "customers" | "analytics" | "tools" | "vehicles" | "livestock";

const CAT_LABELS: Record<string, string> = {
  finance: "Banking & Finance", borewell: "Borewell & Water",
  insurance: "Insurance", storage: "Storage", seeds: "Seeds & Inputs",
  irrigation: "Irrigation", drones: "Drones & Spraying", transport: "Transport",
  soil: "Soil Testing", vet: "Veterinary", solar: "Solar & Power",
  construction: "Farm Construction", equipment: "Equipment", telecom: "Agri-Tech",
  training: "Training", certification: "Certification", cooperative: "Cooperatives",
  media: "Agri Media", pest: "Pest Control", organic: "Organic Cert",
};

function getNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem("jd_cert_notes") || "{}"); } catch { return {}; }
}
function saveNote(id: string, note: string) {
  const n = getNotes(); n[id] = note;
  localStorage.setItem("jd_cert_notes", JSON.stringify(n));
}

export default function AdminPage() {
  const [authed,    setAuthed]    = useState(false);
  const [creds,     setCreds]     = useState({ user: "", pass: "" });
  const [err,       setErr]       = useState("");
  const [farmers,   setFarmers]   = useState<Farmer[]>([]);
  const [prods,     setProds]     = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<FarmerAnalytics[]>([]);
  const [tools,     setTools]     = useState<ToolListing[]>([]);
  const [vehicles,  setVehicles]  = useState<VehicleListing[]>([]);
  const [livestock, setLivestock] = useState<LivestockListing[]>([]);
  const [tab,       setTab]       = useState<TabType>("pending");
  const [busy,      setBusy]      = useState<string | null>(null);
  const [msg,       setMsg]       = useState("");
  const [loading,   setLoading]   = useState(false);
  const [notes,     setNotes]     = useState<Record<string, string>>({});
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [drafts,    setDrafts]    = useState<Record<string, EditDraft>>({});
  const [farmerCusts, setFarmerCusts]       = useState<Record<string, FarmerCustomer[]>>({});
  const [farmerEnquiries, setFarmerEnquiries] = useState<Record<string, FarmerEnquiry[]>>({});
  const [loadingFC, setLoadingFC] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [farmerRes, prodRes, custRes, analyticsRes, toolsRes, vehiclesRes, livestockRes] = await Promise.all([
        fetch("/api/admin?tab=farmers",   { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin",               { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin?tab=customers", { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin?tab=analytics", { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin?tab=tools",     { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin?tab=vehicles",  { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin?tab=livestock", { headers: { "x-admin-auth": ADMIN_AUTH } }),
      ]);
      setFarmers(  farmerRes.ok    ? await farmerRes.json()    : []);
      setProds(    prodRes.ok      ? await prodRes.json()      : []);
      setCustomers(custRes.ok      ? await custRes.json()      : []);
      setAnalytics(analyticsRes.ok ? await analyticsRes.json() : []);
      setTools(    toolsRes.ok     ? await toolsRes.json()     : []);
      setVehicles( vehiclesRes.ok  ? await vehiclesRes.json()  : []);
      setLivestock(livestockRes.ok ? await livestockRes.json() : []);
    } catch {
      setFarmers([]); setProds([]); setCustomers([]); setAnalytics([]);
      setTools([]); setVehicles([]); setLivestock([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("jd_admin") === "1") { setAuthed(true); load(); }
    setNotes(getNotes());
  }, [load]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (creds.user === "jeevadhara" && creds.pass === "Plotno90@") {
      sessionStorage.setItem("jd_admin", "1"); setAuthed(true); load();
    } else { setErr("Invalid credentials"); }
  }

  async function certify(id: string, activate: boolean, listing_type: string = "product") {
    setBusy(id);
    const draft = drafts[id];
    const body = activate
      ? { product_id: id, listing_type, ...(draft?.price ? { price: draft.price } : {}), ...(draft?.name ? { name: draft.name } : {}), ...(listing_type === "product" && draft?.is_organic !== undefined ? { is_organic: draft.is_organic } : {}) }
      : { product_id: id, listing_type, action: "deactivate" };
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "x-admin-auth": ADMIN_AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg(activate ? "Listing certified & activated!" : "Listing deactivated.");
      setTimeout(() => setMsg(""), 4000);
      load();
    }
    setBusy(null);
  }

  function openExpand(id: string, price: number, name: string, is_organic = false) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    setDrafts(d => ({ ...d, [id]: { price: String(price), is_organic, name } }));
  }

  function patchDraft(id: string, patch: Partial<EditDraft>) {
    setDrafts(d => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function toggleFarmerExpand(farmerId: string) {
    if (expanded === farmerId) { setExpanded(null); return; }
    setExpanded(farmerId);
    const needsCusts = !farmerCusts[farmerId];
    const needsEnqs  = !farmerEnquiries[farmerId];
    if (needsCusts || needsEnqs) {
      setLoadingFC(farmerId);
      const fetches: Promise<void>[] = [];
      if (needsCusts) fetches.push(
        fetch(`/api/admin?tab=farmer_customers&farmer_id=${farmerId}`, { headers: { "x-admin-auth": ADMIN_AUTH } })
          .then(r => r.ok ? r.json() : [])
          .then((data: FarmerCustomer[]) => setFarmerCusts(fc => ({ ...fc, [farmerId]: data })))
      );
      if (needsEnqs) fetches.push(
        fetch(`/api/admin?tab=farmer_enquiries&farmer_id=${farmerId}`, { headers: { "x-admin-auth": ADMIN_AUTH } })
          .then(r => r.ok ? r.json() : [])
          .then((data: FarmerEnquiry[]) => setFarmerEnquiries(fe => ({ ...fe, [farmerId]: data })))
      );
      await Promise.all(fetches);
      setLoadingFC(null);
    }
  }

  /* ── Login screen ── */
  if (!authed) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">J</span>
          </div>
          <h1 className="text-xl font-bold text-green-800">Jeevadhara Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Quality Verification Portal</p>
        </div>
        {err && <p className="text-red-600 text-sm mb-4 text-center">{err}</p>}
        <form onSubmit={login} className="space-y-3">
          <input required type="text" placeholder="Username"
            value={creds.user} onChange={e => setCreds(c => ({ ...c, user: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input required type="password" placeholder="Password"
            value={creds.pass} onChange={e => setCreds(c => ({ ...c, pass: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-medium text-sm">
            Login as Jeevadhara Team
          </button>
        </form>
      </div>
    </div>
  );

  const pendingProds    = prods.filter(p => !p.is_active);
  const activeProds     = prods.filter(p =>  p.is_active);
  const pendingTools    = tools.filter(t => !t.is_active);
  const pendingVehicles = vehicles.filter(v => !v.is_active);
  const pendingLivestock = livestock.filter(l => !l.is_active);
  const totalPending    = pendingProds.length + pendingTools.length + pendingVehicles.length + pendingLivestock.length;
  const totalRevenue    = analytics.reduce((s, a) => s + Number(a.total_revenue), 0);

  /* ── Generic listing card for tools/vehicles/livestock ── */
  function ListingCard({
    id, imgUrl, title, subtitle, price, priceLabel, location, sellerName, sellerPhone,
    isActive, listingType, emoji,
  }: {
    id: string; imgUrl: string | null; title: string; subtitle: string; price: number;
    priceLabel: string; location: string; sellerName: string; sellerPhone: string;
    isActive: boolean; listingType: string; emoji: string;
  }) {
    const isDraft = expanded === id && drafts[id];
    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 flex gap-4 items-start">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {imgUrl
              ? <img src={imgUrl} alt={title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-2xl">{emoji}</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-800">{title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {isActive ? "Live" : "Pending"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle} {location ? `· ${location}` : ""}</p>
            <p className="text-sm font-medium text-green-700 mt-1">{priceLabel}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-500">Seller:</span>
              <span className="text-sm font-medium text-gray-800">{sellerName || "Unknown"}</span>
              {sellerPhone && <a href={`tel:${sellerPhone}`} className="text-sm font-semibold text-blue-700 hover:text-blue-900">{sellerPhone}</a>}
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2">
            {isActive ? (
              <button onClick={() => certify(id, false, listingType)} disabled={busy === id}
                className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-xs disabled:opacity-50">
                {busy === id ? "..." : "Deactivate"}
              </button>
            ) : (
              <button onClick={() => certify(id, true, listingType)} disabled={busy === id}
                className="bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 text-xs font-medium disabled:opacity-50 whitespace-nowrap">
                {busy === id ? "..." : "Approve & Activate"}
              </button>
            )}
            <button onClick={() => openExpand(id, price, title)}
              className="border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-xs">
              {expanded === id ? "Close" : "Edit"}
            </button>
          </div>
        </div>

        {isDraft && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Edit before approving</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs)</label>
                <input type="number" step="1" value={drafts[id].price}
                  onChange={e => patchDraft(id, { price: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={drafts[id].name}
                  onChange={e => patchDraft(id, { name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Verification Notes (internal)</label>
              <textarea rows={2} value={notes[id] || ""}
                onChange={e => { saveNote(id, e.target.value); setNotes(getNotes()); }}
                placeholder="e.g. Called seller. Verified condition. Approved."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Jeevadhara Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Quality verification &middot; approve all listings</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="text-green-700 border border-green-300 px-3 py-1.5 rounded-lg text-sm hover:bg-green-50">Refresh</button>
            <button onClick={() => { sessionStorage.removeItem("jd_admin"); setAuthed(false); }} className="text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50">Logout</button>
          </div>
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm">{msg}</div>}

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: "Farmers",        value: farmers.length,       color: "text-gray-800" },
            { label: "Customers",      value: customers.length,     color: "text-blue-700" },
            { label: "Pending Review", value: totalPending,         color: "text-yellow-600" },
            { label: "Certified Live", value: activeProds.length,   color: "text-green-700" },
            { label: "Total Revenue",  value: `Rs${(totalRevenue/1000).toFixed(0)}K`, color: "text-purple-700" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 border text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {([
            ["pending",   `Products Pending (${pendingProds.length})`],
            ["active",    `Products Live (${activeProds.length})`],
            ["tools",     `Tools (${pendingTools.length} pending)`],
            ["vehicles",  `Vehicles (${pendingVehicles.length} pending)`],
            ["livestock", `Livestock (${pendingLivestock.length} pending)`],
            ["farmers",   `Farmers (${farmers.length})`],
            ["customers", `Customers (${customers.length})`],
            ["analytics", `Analytics`],
          ] as [TabType, string][]).map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setExpanded(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${tab === t ? "bg-green-700 text-white" : "bg-white text-gray-600 border hover:border-green-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>

        ) : tab === "analytics" ? (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-4">
              <strong>Platform Performance</strong> · Click any farmer to see customers + service enquiries.
            </div>
            {analytics.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border"><p className="text-gray-400">No data yet.</p></div>
            ) : analytics.map((fa, i) => (
              <div key={fa.farmer_id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFarmerExpand(fa.farmer_id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{fa.farmer_name}</h3>
                        <span className="text-xs text-gray-400">{fa.district}{fa.village ? `, ${fa.village}` : ""}</span>
                        <a href={`tel:${fa.farmer_phone}`} onClick={e => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:underline">{fa.farmer_phone}</a>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span><strong className="text-gray-800">{fa.total_orders}</strong> orders</span>
                        <span><strong className="text-gray-800">{fa.unique_customers}</strong> customers</span>
                        <span><strong className="text-green-700">Rs{Number(fa.total_revenue).toFixed(0)}</strong> revenue</span>
                        {fa.last_order && <span className="text-gray-400">Last: {new Date(fa.last_order).toLocaleDateString("en-IN")}</span>}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">{expanded === fa.farmer_id ? "v" : ">"}</div>
                  </div>
                </button>
                {expanded === fa.farmer_id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                    {loadingFC === fa.farmer_id ? (
                      <p className="text-sm text-gray-400 py-4 text-center">Loading farmer data...</p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Customers column */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Customers ({(farmerCusts[fa.farmer_id] || []).length})
                          </h4>
                          {(farmerCusts[fa.farmer_id] || []).length === 0 ? (
                            <p className="text-sm text-gray-400 py-2">No orders yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {(farmerCusts[fa.farmer_id] || []).map(c => (
                                <div key={c.customer_id} className="bg-white rounded-lg border border-gray-100 px-3 py-2 flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{c.customer_name}</p>
                                    <p className="text-xs text-gray-500">
                                      <a href={`tel:${c.customer_phone}`} className="text-blue-600 hover:underline">{c.customer_phone}</a>
                                      {c.customer_district ? ` · ${c.customer_district}` : ""}
                                    </p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-semibold text-green-700">Rs{Number(c.total_spent).toFixed(0)}</p>
                                    <p className="text-xs text-gray-400">{c.order_count} order{c.order_count !== 1 ? "s" : ""}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Service Enquiries column */}
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Service Enquiries ({(farmerEnquiries[fa.farmer_id] || []).length})
                          </h4>
                          {(farmerEnquiries[fa.farmer_id] || []).length === 0 ? (
                            <p className="text-sm text-gray-400 py-2">No service enquiries yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {(farmerEnquiries[fa.farmer_id] || []).map(e => (
                                <div key={e.id} className="bg-white rounded-lg border border-blue-50 px-3 py-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                        {CAT_LABELS[e.service_category] || e.service_category}
                                      </span>
                                      <p className="text-sm font-medium text-gray-800 mt-1">{e.provider_name || "—"}</p>
                                      {e.provider_phone && (
                                        <a href={`tel:${e.provider_phone}`} className="text-xs text-blue-600 hover:underline">{e.provider_phone}</a>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                        e.enquiry_type === "call" ? "bg-green-100 text-green-700" :
                                        e.enquiry_type === "website" ? "bg-purple-100 text-purple-700" :
                                        "bg-orange-100 text-orange-700"
                                      }`}>
                                        {e.enquiry_type === "call" ? "Called" : e.enquiry_type === "website" ? "Website" : "Enquired"}
                                      </span>
                                      <p className="text-xs text-gray-400 mt-1">{new Date(e.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        ) : tab === "customers" ? (
          <div className="space-y-3">
            {customers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-4xl mb-3">No customers yet.</p>
              </div>
            ) : customers.map(c => (
              <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{c.name}</h3>
                  <p className="text-sm text-gray-500">
                    <a href={`tel:${c.phone}`} className="text-blue-600 hover:underline">{c.phone}</a>
                    {c.district ? ` · ${c.district}` : ""}
                    {c.village  ? `, ${c.village}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Joined {new Date(c.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-700">Rs{Number(c.total_spent).toFixed(0)}</p>
                  <p className="text-xs text-gray-500">{c.order_count} order{c.order_count !== 1 ? "s" : ""}</p>
                  {c.last_order && <p className="text-xs text-gray-400">Last {new Date(c.last_order).toLocaleDateString("en-IN")}</p>}
                </div>
              </div>
            ))}
          </div>

        ) : tab === "farmers" ? (
          <div className="space-y-3">
            {farmers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-gray-500">No farmers registered yet.</p>
              </div>
            ) : farmers.map(f => (
              <div key={f.id} className="bg-white rounded-xl p-5 shadow-sm border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{f.name}</h3>
                  <p className="text-sm text-gray-500">
                    <a href={`tel:${f.phone}`} className="text-green-700 font-medium hover:underline">{f.phone}</a>
                    {f.district ? ` · ${f.district}` : ""}{f.village ? `, ${f.village}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Joined {new Date(f.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">Farmer</span>
              </div>
            ))}
          </div>

        ) : tab === "tools" ? (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
              <strong>Tools Review</strong> · {pendingTools.length} pending · {tools.filter(t => t.is_active).length} live
            </div>
            <div className="space-y-3">
              {tools.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border"><p className="text-gray-400">No tools listed yet.</p></div>
              ) : tools.map(t => (
                <ListingCard key={t.id}
                  id={t.id} imgUrl={t.image_url} title={t.name}
                  subtitle={`${t.category} · ${t.brand} · ${t.condition}`}
                  price={t.price} priceLabel={`Rs${t.price}/${t.unit}`}
                  location={`${t.district}${t.village ? ", " + t.village : ""}`}
                  sellerName={t.seller_name} sellerPhone={t.seller_phone}
                  isActive={t.is_active} listingType="tool" emoji="🔧"
                />
              ))}
            </div>
          </div>

        ) : tab === "vehicles" ? (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
              <strong>Vehicles Review</strong> · {pendingVehicles.length} pending · {vehicles.filter(v => v.is_active).length} live
            </div>
            <div className="space-y-3">
              {vehicles.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border"><p className="text-gray-400">No vehicles listed yet.</p></div>
              ) : vehicles.map(v => (
                <ListingCard key={v.id}
                  id={v.id} imgUrl={v.image_url} title={v.name}
                  subtitle={`${v.vehicle_type} · ${v.brand} ${v.model} ${v.year || ""} · ${v.condition}`}
                  price={v.price} priceLabel={`Rs${v.price}`}
                  location={`${v.district}${v.village ? ", " + v.village : ""}`}
                  sellerName={v.seller_name} sellerPhone={v.seller_phone}
                  isActive={v.is_active} listingType="vehicle" emoji="🚜"
                />
              ))}
            </div>
          </div>

        ) : tab === "livestock" ? (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
              <strong>Livestock Review</strong> · {pendingLivestock.length} pending · {livestock.filter(l => l.is_active).length} live
            </div>
            <div className="space-y-3">
              {livestock.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border"><p className="text-gray-400">No livestock listed yet.</p></div>
              ) : livestock.map(l => (
                <ListingCard key={l.id}
                  id={l.id} imgUrl={l.image_url} title={l.name}
                  subtitle={`${l.livestock_category} · ${l.breed} · Qty: ${l.quantity}`}
                  price={l.price} priceLabel={`Rs${l.price}/head`}
                  location={`${l.district}${l.village ? ", " + l.village : ""}`}
                  sellerName={l.seller_name} sellerPhone={l.seller_phone}
                  isActive={l.is_active} listingType="livestock" emoji="🐄"
                />
              ))}
            </div>
          </div>

        ) : (
          /* ── Products tab (pending / active) ── */
          <div>
            {tab === "pending" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Certification Process</strong> · 1. Call farmer · 2. Verify sample · 3. Edit fields if needed · 4. Certify &amp; Activate
              </div>
            )}
            <div className="space-y-3">
              {(tab === "pending" ? pendingProds : activeProds).length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border">
                  <p className="text-gray-500">{tab === "pending" ? "All clear - nothing pending!" : "No certified products yet."}</p>
                </div>
              ) : (tab === "pending" ? pendingProds : activeProds).map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-4 flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-800">{p.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {p.is_active ? "Certified" : "Pending"}
                        </span>
                        {p.is_organic && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Organic</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{p.category} · {p.district}</p>
                      <p className="text-sm font-medium text-green-700 mt-1">Rs{p.price}/{p.unit} · {p.stock} {p.unit} available</p>
                      <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-gray-500">Farmer:</span>
                        <span className="text-sm font-medium text-gray-800">{p.farmer_name}</span>
                        <a href={`tel:${p.farmer_phone}`} className="text-sm font-semibold text-blue-700 hover:text-blue-900">{p.farmer_phone}</a>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {p.is_active ? (
                        <button onClick={() => certify(p.id, false, "product")} disabled={busy === p.id}
                          className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-xs disabled:opacity-50">
                          {busy === p.id ? "..." : "Deactivate"}
                        </button>
                      ) : (
                        <button onClick={() => certify(p.id, true, "product")} disabled={busy === p.id}
                          className="bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 text-xs font-medium disabled:opacity-50 whitespace-nowrap">
                          {busy === p.id ? "..." : "Certify & Activate"}
                        </button>
                      )}
                      <button onClick={() => openExpand(p.id, p.price, p.name, p.is_organic)}
                        className="border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-xs">
                        {expanded === p.id ? "Close" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {expanded === p.id && drafts[p.id] && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Edit before certifying</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Price (Rs/{p.unit})</label>
                          <input type="number" step="0.5" value={drafts[p.id].price}
                            onChange={e => patchDraft(p.id, { price: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                          {drafts[p.id].price !== String(p.price) && <p className="text-xs text-amber-600 mt-1">Rs{p.price} to Rs{drafts[p.id].price}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                          <input type="text" value={drafts[p.id].name}
                            onChange={e => patchDraft(p.id, { name: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button"
                          onClick={() => patchDraft(p.id, { is_organic: !drafts[p.id].is_organic })}
                          className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${drafts[p.id].is_organic ? "bg-green-500" : "bg-gray-300"}`}>
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${drafts[p.id].is_organic ? "right-1" : "left-1"}`} />
                        </button>
                        <span className="text-sm text-gray-700">Certified Organic</span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Certification Notes (internal)</label>
                        <textarea rows={2} value={notes[p.id] || ""} onChange={e => { saveNote(p.id, e.target.value); setNotes(getNotes()); }}
                          placeholder={`e.g. Called ${p.farmer_name}. Sample verified. Price Rs${drafts[p.id].price}/${p.unit}.`}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
