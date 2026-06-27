"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Condition = "new" | "used";

const VEHICLE_TYPES = ["Tractor", "Mini Truck", "Light Truck", "Heavy Truck", "JCB / Excavator", "Other"];
const FUEL_TYPES = ["Diesel", "Petrol", "Electric", "CNG"];
const BRANDS = ["Mahindra", "Sonalika", "John Deere", "New Holland", "TAFE", "Ashok Leyland", "Eicher", "JCB", "Other"];

export default function SellVehiclePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  const [condition, setCondition] = useState<Condition>("used");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Shared fields
  const [form, setForm] = useState({
    name: "", vehicle_type: "Tractor", brand: "Mahindra", model: "",
    year: new Date().getFullYear().toString(),
    engine_hp: "", fuel_type: "Diesel",
    description: "", price: "", district: "", village: "",
    // New-dealer fields
    on_road_price: "", colors_available: "", warranty_years: "5",
    dealer_name: "", dealer_showroom: "", dealer_city: "", dealer_phone: "",
    // Used-individual fields
    hours_used: "", km_driven: "", color: "", is_negotiable: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("jd_token");
    const uid = localStorage.getItem("jd_user_id");
    if (!token) { router.push("/auth/login"); return; }
    setUserId(uid || "");
  }, [router]);

  function set(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
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
      setError("Vehicle name, price, and district are required."); return;
    }
    setSubmitting(true);
    setError("");
    try {
      const imageUrl = await uploadImage();
      const payload = {
        ...form,
        condition,
        seller_id: userId,
        image_url: imageUrl,
        year: parseInt(form.year) || new Date().getFullYear(),
        engine_hp: form.engine_hp ? parseFloat(form.engine_hp) : null,
        price: parseFloat(form.price),
        on_road_price: form.on_road_price ? parseFloat(form.on_road_price) : null,
        warranty_years: form.warranty_years ? parseInt(form.warranty_years) : null,
        hours_used: form.hours_used ? parseInt(form.hours_used) : null,
        km_driven: form.km_driven ? parseInt(form.km_driven) : null,
      };
      const res = await fetch("/api/sell/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "x-user-id": userId,
          "x-token": localStorage.getItem("jd_token") || "" },
        body: JSON.stringify(payload),
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
        <h2 className="text-xl font-bold text-gray-900">Listing Submitted!</h2>
        <p className="text-gray-600 text-sm">Your vehicle listing is under admin review. It will go live within 24 hours after approval.</p>
        <button onClick={() => router.push("/vehicles")} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
          View Vehicles
        </button>
        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, name: "", model: "", price: "", description: "" })); setImageFile(null); setImagePreview(null); }}
          className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">
          List Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-6">
        <button onClick={() => router.back()} className="text-blue-200 text-sm mb-2">← Back</button>
        <h1 className="text-xl font-bold">🚜 List a Vehicle</h1>
        <p className="text-blue-100 text-sm mt-1">Fill all details — admin reviews before going live</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Condition toggle */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Listing Type</p>
          <div className="grid grid-cols-2 gap-3">
            {(["used", "new"] as Condition[]).map((c) => (
              <button key={c} type="button" onClick={() => setCondition(c)}
                className={`py-3 rounded-xl font-semibold text-sm border-2 transition-colors ${
                  condition === c
                    ? c === "new" ? "border-green-600 bg-green-50 text-green-700" : "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 text-gray-500"
                }`}>
                {c === "new" ? "🏪 New — Dealer" : "👤 Used — Individual"}
              </button>
            ))}
          </div>
          {condition === "new" && <p className="text-xs text-gray-500">Current year vehicles only. You must be an authorized dealer.</p>}
          {condition === "used" && <p className="text-xs text-gray-500">Used vehicles listed by individual farmers / owners.</p>}
        </div>

        {/* Vehicle basics */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Vehicle Details</p>

          <div>
            <label className="text-xs text-gray-500 font-medium">Vehicle Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Mahindra 575 DI"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Type</label>
              <select value={form.vehicle_type} onChange={e => set("vehicle_type", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Brand</label>
              <select value={form.brand} onChange={e => set("brand", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Model</label>
              <input value={form.model} onChange={e => set("model", e.target.value)}
                placeholder="e.g. 575 DI"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Year</label>
              <input type="number" value={form.year} onChange={e => set("year", e.target.value)}
                min="1990" max={new Date().getFullYear()}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Engine HP</label>
              <input type="number" value={form.engine_hp} onChange={e => set("engine_hp", e.target.value)}
                placeholder="e.g. 50"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Fuel Type</label>
              <select value={form.fuel_type} onChange={e => set("fuel_type", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Pricing</p>

          <div>
            <label className="text-xs text-gray-500 font-medium">
              {condition === "new" ? "Ex-Showroom Price (₹) *" : "Asking Price (₹) *"}
            </label>
            <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
              placeholder="e.g. 650000"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {condition === "new" && (
            <div>
              <label className="text-xs text-gray-500 font-medium">On-Road Price (₹) — optional</label>
              <input type="number" value={form.on_road_price} onChange={e => set("on_road_price", e.target.value)}
                placeholder="ex-showroom + taxes + insurance"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          )}

          {condition === "used" && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_negotiable as boolean}
                onChange={e => set("is_negotiable", e.target.checked)}
                className="w-4 h-4 rounded" />
              Price is negotiable
            </label>
          )}
        </div>

        {/* Condition-specific fields */}
        {condition === "new" ? (
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <p className="font-semibold text-gray-800">Dealer & Showroom Details</p>
            <div>
              <label className="text-xs text-gray-500 font-medium">Dealer / Showroom Name *</label>
              <input value={form.dealer_name} onChange={e => set("dealer_name", e.target.value)}
                placeholder="e.g. Raju Mahindra Showroom"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Showroom Address</label>
              <input value={form.dealer_showroom} onChange={e => set("dealer_showroom", e.target.value)}
                placeholder="e.g. NH-44, Karimnagar Road"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Dealer City</label>
                <input value={form.dealer_city} onChange={e => set("dealer_city", e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Dealer Phone</label>
                <input type="tel" value={form.dealer_phone} onChange={e => set("dealer_phone", e.target.value)}
                  placeholder="10-digit number"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Available Colors (comma separated)</label>
              <input value={form.colors_available} onChange={e => set("colors_available", e.target.value)}
                placeholder="Red, White, Blue"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Warranty (years)</label>
              <input type="number" value={form.warranty_years} onChange={e => set("warranty_years", e.target.value)}
                min="0" max="10"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <p className="font-semibold text-gray-800">Vehicle Condition</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Hours Used</label>
                <input type="number" value={form.hours_used} onChange={e => set("hours_used", e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">KM Driven (trucks)</label>
                <input type="number" value={form.km_driven} onChange={e => set("km_driven", e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Color</label>
              <input value={form.color} onChange={e => set("color", e.target.value)}
                placeholder="e.g. Red"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">District *</label>
              <input value={form.district} onChange={e => set("district", e.target.value)}
                placeholder="e.g. Karimnagar"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Village / City</label>
              <input value={form.village} onChange={e => set("village", e.target.value)}
                placeholder="e.g. Huzurabad"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Description</p>
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Describe condition, features, reason for selling, any known issues…"
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
        </div>

        {/* Image */}
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
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
              <span className="text-2xl">📷</span>
              <span className="text-sm">Tap to add photo</span>
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition-colors disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit for Admin Approval"}
        </button>

        <p className="text-xs text-center text-gray-400 pb-4">
          Your listing will be reviewed and approved by the Jeevadhara team before it appears publicly.
        </p>
      </form>
    </div>
  );
}
