"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "hand", label: "Hand Tool (fork, trowel, hoe, rake…)" },
  { value: "powered", label: "Powered Equipment (sprayer, weeder…)" },
  { value: "irrigation", label: "Irrigation Equipment" },
];
const UNITS = ["piece", "set", "pair"];

export default function SellToolPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", slug: "", category: "hand", brand: "",
    description: "", price: "", unit: "piece", stock: "10",
    district: "", village: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("jd_token");
    const uid = localStorage.getItem("jd_user_id");
    if (!token) { router.push("/auth/login"); return; }
    setUserId(uid || "");
  }, [router]);

  function set(k: string, v: string) {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      if (k === "name") updated.slug = v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      return updated;
    });
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: imageFile.name, contentType: imageFile.type }),
      });
      const { presignedUrl, publicUrl } = await res.json();
      await fetch(presignedUrl, { method: "PUT", body: imageFile, headers: { "Content-Type": imageFile.type } });
      return publicUrl;
    } catch { return null; }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.district) {
      setError("Tool name, price, and district are required."); return;
    }
    setSubmitting(true); setError("");
    try {
      const imageUrl = await uploadImage();
      const res = await fetch("/api/sell/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId,
          "x-token": localStorage.getItem("jd_token") || "" },
        body: JSON.stringify({
          ...form, seller_id: userId, image_url: imageUrl, condition: "new",
          price: parseFloat(form.price), stock: parseInt(form.stock) || 10,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Submission failed"); return; }
      setSuccess(true);
    } catch { setError("Network error. Try again."); }
    finally { setSubmitting(false); }
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Tool Listed!</h2>
        <p className="text-gray-600 text-sm">Submitted for admin review. Goes live within 24 hours after approval.</p>
        <button onClick={() => router.push("/implements")} className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold">View Tools</button>
        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, name: "", slug: "", brand: "", price: "", description: "" })); setImageFile(null); setImagePreview(null); }}
          className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">List Another</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-6">
        <button onClick={() => router.back()} className="text-orange-200 text-sm mb-2">← Back</button>
        <h1 className="text-xl font-bold">🛠️ List a Farm Tool</h1>
        <p className="text-orange-100 text-sm mt-1">New equipment only — admin reviews before going live</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Tool Details</p>

          <div>
            <label className="text-xs text-gray-500 font-medium">Tool Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Garden Fork, Knapsack Sprayer"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Brand / Manufacturer</label>
            <input value={form.brand} onChange={e => set("brand", e.target.value)}
              placeholder="e.g. Aspee, Agro India, Krishna Tools"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Material, size, capacity, usage, features…"
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Pricing & Stock</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="e.g. 550"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Unit</label>
              <select value={form.unit} onChange={e => set("unit", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Stock Available</label>
            <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)}
              min="1"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">District *</label>
              <input value={form.district} onChange={e => set("district", e.target.value)}
                placeholder="e.g. Warangal"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Village / Town</label>
              <input value={form.village} onChange={e => set("village", e.target.value)}
                placeholder="e.g. Hanamkonda"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Photo</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Remove</button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors">
              <span className="text-2xl">📷</span>
              <span className="text-sm">Tap to add photo</span>
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-700 transition-colors disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit for Admin Approval"}
        </button>
        <p className="text-xs text-center text-gray-400 pb-4">Reviewed and approved by Jeevadhara team before going live.</p>
      </form>
    </div>
  );
}
