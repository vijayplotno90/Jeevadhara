"use client";
import { useState, useEffect } from "react";

interface Farm {
  farm_id: string; farm_name: string; district: string; village: string;
  jeevadhara_certified: boolean; farmer_name: string; phone: string;
  product_count: number; created_at: string;
}
interface Product {
  id: string; name: string; price_per_unit: number; unit: string;
  available_qty: number; is_organic: boolean; images: string[] | null;
  farm_name: string; district: string; jeevadhara_certified: boolean;
  farmer_name: string; farmer_phone: string;
}

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [creds,  setCreds]      = useState({ user: "", pass: "" });
  const [err,    setErr]        = useState("");
  const [farms,  setFarms]      = useState<Farm[]>([]);
  const [prods,  setProds]      = useState<Product[]>([]);
  const [tab,    setTab]        = useState<"farms"|"products">("farms");
  const [notes,  setNotes]      = useState<Record<string, string>>({});
  const [busy,   setBusy]       = useState<string|null>(null);
  const [msg,    setMsg]        = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("jd_admin") === "1") { setAuthed(true); load(); }
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (creds.user === "jeevadhara" && creds.pass === "Plotno90@") {
      sessionStorage.setItem("jd_admin", "1"); setAuthed(true); load();
    } else setErr("Invalid credentials");
  }

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin");
      const data = await res.json();
      setFarms(data.farms  || []);
      setProds(data.products || []);
    } catch { setFarms([]); setProds([]); }
    setLoading(false);
  }

  async function certify(farm_id: string, certified: boolean) {
    setBusy(farm_id);
    const res = await fetch("/api/admin", {
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ farm_id, certified, notes: notes[farm_id] || "" }),
    });
    if (res.ok) {
      setMsg(certified ? "✅ Farm certified! Products now show Jeevadhara badge." : "❌ Certification removed.");
      setTimeout(() => setMsg(""), 4000);
      load();
    }
    setBusy(null);
  }

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
            value={creds.user} onChange={e=>setCreds(c=>({...c,user:e.target.value}))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input required type="password" placeholder="Password"
            value={creds.pass} onChange={e=>setCreds(c=>({...c,pass:e.target.value}))}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-medium text-sm">
            Login as Jeevadhara Team
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">🔍 Jeevadhara Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Certify farms · verify product quality</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load}
              className="text-green-700 border border-green-300 px-3 py-1.5 rounded-lg text-sm hover:bg-green-50">
              ↻ Refresh
            </button>
            <button onClick={()=>{sessionStorage.removeItem("jd_admin");setAuthed(false);}}
              className="text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>

        {msg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm">{msg}</div>}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-gray-800">{farms.length}</div>
            <div className="text-xs text-gray-500">Total Farms</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-green-700">{farms.filter(f=>f.jeevadhara_certified).length}</div>
            <div className="text-xs text-gray-500">Certified Farms</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-gray-800">{prods.length}</div>
            <div className="text-xs text-gray-500">Active Products</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-yellow-600">{farms.filter(f=>!f.jeevadhara_certified).length}</div>
            <div className="text-xs text-gray-500">Pending Review</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["farms","products"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab===t?"bg-green-700 text-white":"bg-white text-gray-600 border hover:border-green-300"}`}>
              {t==="farms" ? `🌾 Farms (${farms.length})` : `📦 Products (${prods.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : tab === "farms" ? (
          <div className="space-y-4">
            {farms.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-4xl mb-3">🌾</p>
                <p className="text-gray-500">No farms registered yet.</p>
                <p className="text-gray-400 text-sm mt-1">Farmers register and their farms appear here.</p>
              </div>
            ) : farms.map(f=>(
              <div key={f.farm_id} className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{f.farm_name}</h3>
                    <p className="text-sm text-gray-500">
                      Farmer: <span className="font-medium text-green-700">{f.farmer_name}</span>
                      {" · "}{f.phone}{" · "}{f.district}{f.village ? `, ${f.village}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{f.product_count} active products</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    f.jeevadhara_certified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {f.jeevadhara_certified ? "✅ Jeevadhara Certified" : "⏳ Not Yet Certified"}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Notes (pesticide test, farm visit, quality check…)
                  </label>
                  <textarea
                    value={notes[f.farm_id] || ""}
                    onChange={e=>setNotes(n=>({...n,[f.farm_id]:e.target.value}))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                    placeholder="e.g., Visited farm on 25-Jun. Soil test passed. Pesticide levels within safe limits. Organic claim verified." />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={()=>certify(f.farm_id, true)}
                      disabled={busy===f.farm_id || f.jeevadhara_certified}
                      className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 text-sm font-medium disabled:opacity-50">
                      {busy===f.farm_id ? "Processing…" : "✅ Award Jeevadhara Certified"}
                    </button>
                    {f.jeevadhara_certified && (
                      <button
                        onClick={()=>certify(f.farm_id, false)}
                        disabled={busy===f.farm_id}
                        className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50">
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {prods.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-500">No products listed yet.</p>
              </div>
            ) : prods.map(p=>(
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{p.name}</h3>
                    {p.is_organic && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🌿 Organic</span>}
                    {p.jeevadhara_certified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Certified</span>}
                  </div>
                  <p className="text-xs text-gray-500">{p.farmer_name} · {p.farm_name} · {p.district}</p>
                  <p className="text-sm font-medium text-green-700 mt-1">₹{p.price_per_unit}/{p.unit} · {p.available_qty} {p.unit} available</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
