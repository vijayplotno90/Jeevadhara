"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const PLANT_TYPES = [
  "Alphonso Mango Sapling", "G9 Banana TC Plant", "West Coast Tall Coconut",
  "Teak Sapling", "Moringa PKM-1", "Sitaphal NA-1", "Amla NA-7", "L-49 Guava",
  "Pomegranate Bhagwa", "Papaya Taiwan 786", "Drumstick PKM-2", "Other",
];
const UNITS = ["plant", "sapling", "bunch", "dozen"];

export default function SellNurseryPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "Alphonso Mango Sapling", custom_name: "",
    age_description: "", grafted: true,
    price: "", unit: "plant", stock: "100",
    description: "", is_organic: false,
    district: "", village: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("jd_token");
    const uid = localStorage.getItem("jd_user_id");
    if (!token) { router.push("/auth/login"); return; }
    setUserId(uid || "");
  }, [router]);

  function set(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })); }

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
    const finalName = form.name === "Other" ? form.custom_name : form.name;
    if (!finalName || !form.price || !form.district) {
      setError("Plant name, price, and district are required."); return;
    }
    setSubmitting(true); setError("");
    try {
      const imageUrl = await uploadImage();
      const fullDesc = [
        form.grafted ? "Grafted variety." : "Seedling.",
        form.age_description ? `Age: ${form.age_description}.` : "",
        form.description,
      ].filter(Boolean).join(" ");

      const res = await fetch("/api/sell/nursery", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId,
          "x-token": localStorage.getItem("jd_token") || "" },
        body: JSON.stringify({
          name: finalName,
          category: "nursery",
          farmer_id: userId,
          image_url: imageUrl,
          price: parseFloat(form.price),
          unit: form.unit,
          stock: parseInt(form.stock) || 100,
          description: fullDesc,
          is_organic: form.is_organic,
          district: form.district,
          village: form.village,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Submission failed"); return; }
      setSuccess(true);
    } catch { setError("Network error. Try again."); }
    finally { setSubmitting(false); }
  }

  if (success) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">Plant Listed!</h2>
        <p className="text-gray-600 text-sm">Submitted for admin review. Goes live within 24 hours.</p>
        <button onClick={() => router.push("/plantation")} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">View Nursery</button>
        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, price: "", description: "" })); setImageFile(null); setImagePreview(null); }}
          className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">List Another</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-lime-500 text-white px-4 py-6">
        <button onClick={() => router.back()} className="text-green-100 text-sm mb-2">← Back</button>
        <h1 className="text-xl font-bold">🌱 List Nursery Plant</h1>
        <p className="text-green-100 text-sm mt-1">Saplings, TC plants, grafts — admin reviews before going live</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Plant Details</p>

          <div>
            <label className="text-xs text-gray-500 font-medium">Plant / Variety *</label>
            <select value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              {PLANT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {form.name === "Other" && (
            <div>
              <label className="text-xs text-gray-500 font-medium">Custom Plant Name *</label>
              <input value={form.custom_name} onChange={e => set("custom_name", e.target.value)}
                placeholder="e.g. Sapota Cricket Ball"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 font-medium">Plant Age / Stage</label>
            <input value={form.age_description} onChange={e => set("age_description", e.target.value)}
              placeholder="e.g. 1.5 year old, 2 year grafted, 3-week hardened TC"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.grafted as boolean}
                onChange={e => set("grafted", e.target.checked)} className="w-4 h-4 rounded" />
              Grafted Variety
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_organic as boolean}
                onChange={e => set("is_organic", e.target.checked)} className="w-4 h-4 rounded" />
              🌿 Organic Nursery
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Fruiting timeline, certifications, minimum order, transport availability…"
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Pricing & Stock</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Price (₹) per unit *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="e.g. 120"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Unit</label>
              <select value={form.unit} onChange={e => set("unit", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Plants Available</label>
            <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} min="1"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">District *</label>
              <input value={form.district} onChange={e => set("district", e.target.value)}
                placeholder="e.g. Ranga Reddy"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Village / Town</label>
              <input value={form.village} onChange={e => set("village", e.target.value)}
                placeholder="e.g. Ibrahimpatnam"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors">
              <span className="text-2xl">📷</span>
              <span className="text-sm">Tap to add photo</span>
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base hover:bg-green-700 transition-colors disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit for Admin Approval"}
        </button>
        <p className="text-xs text-center text-gray-400 pb-4">Reviewed by Jeevadhara team before going live.</p>
      </form>
    </div>
  );
}
