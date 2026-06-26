"use client";
import { useState, useEffect } from "react";

const ADMIN_AUTH = btoa("jeevadhara:Plotno90@");

interface Farmer {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  description: string;
  district: string;
  is_active: boolean;
  created_at: string;
  farmer_name: string;
  farmer_phone: string;
  farmer_id: string;
}

// Notes stored in localStorage per product: { [product_id]: string }
function getNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem("jd_cert_notes") || "{}"); } catch { return {}; }
}
function saveNote(id: string, note: string) {
  const n = getNotes();
  n[id] = note;
  localStorage.setItem("jd_cert_notes", JSON.stringify(n));
}

export default function AdminPage() {
  const [authed,  setAuthed]  = useState(false);
  const [creds,   setCreds]   = useState({ user: "", pass: "" });
  const [err,     setErr]     = useState("");
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [prods,   setProds]   = useState<Product[]>([]);
  const [tab,     setTab]     = useState<"pending" | "active" | "farmers">("pending");
  const [busy,    setBusy]    = useState<string | null>(null);
  const [msg,     setMsg]     = useState("");
  const [loading, setLoading] = useState(false);
  const [notes,   setNotes]   = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("jd_admin") === "1") { setAuthed(true); load(); }
    setNotes(getNotes());
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (creds.user === "jeevadhara" && creds.pass === "Plotno90@") {
      sessionStorage.setItem("jd_admin", "1");
      setAuthed(true);
      load();
    } else {
      setErr("Invalid credentials");
    }
  }

  async function load() {
    setLoading(true);
    try {
      const [farmerRes, prodRes] = await Promise.all([
        fetch("/api/admin?tab=farmers", { headers: { "x-admin-auth": ADMIN_AUTH } }),
        fetch("/api/admin",             { headers: { "x-admin-auth": ADMIN_AUTH } }),
      ]);
      const farmerData = await farmerRes.json();
      const prodData   = await prodRes.json();
      setFarmers(Array.isArray(farmerData) ? farmerData : []);
      setProds(Array.isArray(prodData)   ? prodData   : []);
    } catch {
      setFarmers([]); setProds([]);
    }
    setLoading(false);
  }

  async function certify(product_id: string, activate: boolean) {
    setBusy(product_id);
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "x-admin-auth": ADMIN_AUTH,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        activate
          ? { product_id }
          : { product_id, action: "deactivate" }
      ),
    });
    if (res.ok) {
      setMsg(activate ? "✅ Product certified & activated!" : "❌ Product deactivated.");
      setTimeout(() => setMsg(""), 4000);
      load();
    }
    setBusy(null);
  }

  function updateNote(id: string, val: string) {
    saveNote(id, val);
    setNotes(getNotes());
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
          <button type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 font-medium text-sm">
            Login as Jeevadhara Team
          </button>
        </form>
      </div>
    </div>
  );

  /* ── Dashboard ── */
  const pendingProds = prods.filter(p => !p.is_active);
  const activeProds  = prods.filter(p =>  p.is_active);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">🔍 Jeevadhara Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Quality verification · certify farmers & products</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load}
              className="text-green-700 border border-green-300 px-3 py-1.5 rounded-lg text-sm hover:bg-green-50">
              ↻ Refresh
            </button>
            <button onClick={() => { sessionStorage.removeItem("jd_admin"); setAuthed(false); }}
              className="text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>

        {msg && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm">
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-gray-800">{farmers.length}</div>
            <div className="text-xs text-gray-500">Total Farmers</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingProds.length}</div>
            <div className="text-xs text-gray-500">Pending Review</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-green-700">{activeProds.length}</div>
            <div className="text-xs text-gray-500">Certified & Live</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-gray-800">{prods.length}</div>
            <div className="text-xs text-gray-500">Total Products</div>
          </div>
        </div>

        {/* Process info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
          <p className="font-semibold mb-1">📋 Certification Process</p>
          <p>
            1. Farmer lists product → shows as <strong>Pending Review</strong>&nbsp;
            2. Call farmer / collect sample / visit farm if needed&nbsp;
            3. Add your notes below&nbsp;
            4. Click <strong>Certify & Activate</strong> — product goes live for consumers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {([
            ["pending",  `⏳ Pending Review (${pendingProds.length})`],
            ["active",   `✅ Certified & Live (${activeProds.length})`],
            ["farmers",  `🌾 Farmers (${farmers.length})`],
          ] as [typeof tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? "bg-green-700 text-white" : "bg-white text-gray-600 border hover:border-green-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>

        ) : tab === "farmers" ? (
          <div className="space-y-3">
            {farmers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-4xl mb-3">🌾</p>
                <p className="text-gray-500">No farmers registered yet.</p>
              </div>
            ) : farmers.map(f => (
              <div key={f.id} className="bg-white rounded-xl p-5 shadow-sm border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{f.name}</h3>
                  <p className="text-sm text-gray-500">
                    📞 <a href={`tel:${f.phone}`} className="text-green-700 font-medium hover:underline">{f.phone}</a>
                    {f.district ? ` · 📍 ${f.district}` : ""}
                    {f.village  ? `, ${f.village}` : ""}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined {new Date(f.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                  🌾 Farmer
                </span>
              </div>
            ))}
          </div>

        ) : (
          /* Products tab — pending OR active */
          <div className="space-y-3">
            {(tab === "pending" ? pendingProds : activeProds).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border">
                <p className="text-4xl mb-3">{tab === "pending" ? "✅" : "📦"}</p>
                <p className="text-gray-500">
                  {tab === "pending"
                    ? "No products pending review — all clear!"
                    : "No certified products yet."}
                </p>
              </div>
            ) : (tab === "pending" ? pendingProds : activeProds).map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Main row */}
                <div className="p-4 flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {p.is_active ? "✅ Certified" : "⏳ Pending Review"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.category} · {p.district}
                    </p>
                    <p className="text-sm font-medium text-green-700 mt-1">
                      ₹{p.price}/{p.unit} · {p.stock} {p.unit} available
                    </p>
                    {/* Farmer contact — the key info for calling */}
                    <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-gray-500">Farmer:</span>
                      <span className="text-sm font-medium text-gray-800">{p.farmer_name}</span>
                      <a href={`tel:${p.farmer_phone}`}
                        className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1">
                        📞 {p.farmer_phone}
                      </a>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {p.is_active ? (
                      <button
                        onClick={() => certify(p.id, false)}
                        disabled={busy === p.id}
                        className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 text-xs disabled:opacity-50">
                        {busy === p.id ? "…" : "Deactivate"}
                      </button>
                    ) : (
                      <button
                        onClick={() => certify(p.id, true)}
                        disabled={busy === p.id}
                        className="bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 text-xs font-medium disabled:opacity-50 whitespace-nowrap">
                        {busy === p.id ? "…" : "✅ Certify & Activate"}
                      </button>
                    )}
                    <button
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className="border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-xs">
                      {expanded === p.id ? "Hide Notes ▲" : "Add Notes ▼"}
                    </button>
                  </div>
                </div>

                {/* Expandable certification notes */}
                {expanded === p.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Certification Notes (internal — visible to your team only)
                    </label>
                    <textarea
                      rows={3}
                      value={notes[p.id] || ""}
                      onChange={e => updateNote(p.id, e.target.value)}
                      placeholder={`e.g. Called farmer ${p.farmer_name} on ${new Date().toLocaleDateString("en-IN")}. Sample collected and verified. Meets quality standards. Pesticide-free confirmed.`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
                    />
                    {notes[p.id] && (
                      <p className="text-xs text-green-600 mt-1">✓ Notes saved</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
