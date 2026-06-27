"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "cattle", label: "🐄 Cattle (cow, bull, ox)" },
  { value: "buffalo", label: "🐃 Buffalo" },
  { value: "poultry", label: "🐓 Poultry (hen, cock, chick)" },
  { value: "sheep", label: "🐑 Sheep / Goat" },
  { value: "fish", label: "🐟 Fish / Aquaculture" },
];

const HEALTH_CONDITIONS = ["Excellent", "Good", "Fair", "Needs Vet Check"];
const VAC_STATUSES = ["Vaccinated", "Partially Vaccinated", "Not Vaccinated", "Unknown"];

export default function SellLivestockPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    breed: "", category: "cattle", color: "",
    age_years: "0", age_months: "0", body_weight_kg: "",
    milk_liters_per_day: "", lactation_number: "", last_calving_date: "",
    eggs_per_year: "",
    health_condition: "Good", vaccination_status: "Vaccinated", disease_history: "None",
    price: "", quantity_available: "1",
    district: "", village: "", description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("jd_token");
    const uid = localStorage.getItem("jd_user_id");
    if (!token) { router.push("/auth/login"); return; }
    setUserId(uid || "");
  }, [router]);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

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
    if (!form.breed || !form.price || !form.district) {
      setError("Breed, price, and district are required."); return;
    }
    setSubmitting(true); setError("");
    try {
      const imageUrl = await uploadImage();
      const res = await fetch("/api/sell/livestock", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId,
          "x-token": localStorage.getItem("jd_token") || "" },
        body: JSON.stringify({
          ...form,
          farmer_id: userId,
          image_url: imageUrl,
          slug: form.breed.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          price: parseFloat(form.price),
          age_years: parseInt(form.age_years) || 0,
          age_months: parseInt(form.age_months) || 0,
          body_weight_kg: form.body_weight_kg ? parseFloat(form.body_weight_kg) : null,
          milk_liters_per_day: form.milk_liters_per_day ? parseFloat(form.milk_liters_per_day) : null,
          lactation_number: form.lactation_number ? parseInt(form.lactation_number) : null,
          eggs_per_year: form.eggs_per_year ? parseInt(form.eggs_per_year) : null,
          quantity_available: parseInt(form.quantity_available) || 1,
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
        <h2 className="text-xl font-bold text-gray-900">Livestock Listed!</h2>
        <p className="text-gray-600 text-sm">Submitted for admin review. Approved within 24 hours.</p>
        <button onClick={() => router.push("/animals")} className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold">View Livestock</button>
        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, breed: "", price: "", description: "" })); setImageFile(null); setImagePreview(null); }}
          className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">List Another</button>
      </div>
    </div>
  );

  const isCattle = form.category === "cattle" || form.category === "buffalo";
  const isPoultry = form.category === "poultry";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white px-4 py-6">
        <button onClick={() => router.back()} className="text-green-200 text-sm mb-2">← Back</button>
        <h1 className="text-xl font-bold">🐄 List Livestock</h1>
        <p className="text-green-100 text-sm mt-1">Fill all details — vet certification done by admin after review</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">

        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Animal Details</p>

          <div>
            <label className="text-xs text-gray-500 font-medium">Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Breed Name *</label>
            <input value={form.breed} onChange={e => set("breed", e.target.value)}
              placeholder="e.g. HF Cross, Murrah Buffalo, Kadaknath"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 font-medium">Age (years)</label>
              <input type="number" value={form.age_years} onChange={e => set("age_years", e.target.value)} min="0"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Months</label>
              <input type="number" value={form.age_months} onChange={e => set("age_months", e.target.value)} min="0" max="11"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Weight (kg)</label>
              <input type="number" value={form.body_weight_kg} onChange={e => set("body_weight_kg", e.target.value)}
                placeholder="e.g. 380"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Color / Markings</label>
            <input value={form.color} onChange={e => set("color", e.target.value)}
              placeholder="e.g. Black & White, Brown"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* Production — cattle/buffalo */}
        {isCattle && (
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <p className="font-semibold text-gray-800">Milk Production</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Milk / day (litres)</label>
                <input type="number" value={form.milk_liters_per_day} onChange={e => set("milk_liters_per_day", e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Lactation No.</label>
                <input type="number" value={form.lactation_number} onChange={e => set("lactation_number", e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Last Calving Date</label>
              <input type="date" value={form.last_calving_date} onChange={e => set("last_calving_date", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        )}

        {/* Production — poultry */}
        {isPoultry && (
          <div className="bg-white rounded-2xl p-4 shadow space-y-3">
            <p className="font-semibold text-gray-800">Egg Production</p>
            <div>
              <label className="text-xs text-gray-500 font-medium">Eggs per year</label>
              <input type="number" value={form.eggs_per_year} onChange={e => set("eggs_per_year", e.target.value)}
                placeholder="e.g. 280"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        )}

        {/* Health */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Health Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Health Condition</label>
              <select value={form.health_condition} onChange={e => set("health_condition", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {HEALTH_CONDITIONS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Vaccination</label>
              <select value={form.vaccination_status} onChange={e => set("vaccination_status", e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {VAC_STATUSES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Disease History (if any)</label>
            <input value={form.disease_history} onChange={e => set("disease_history", e.target.value)}
              placeholder="e.g. None / Had FMD in 2023, fully recovered"
              className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* Pricing & quantity */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Pricing</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">Price (₹) per head *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="e.g. 45000"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Quantity</label>
              <input type="number" value={form.quantity_available} onChange={e => set("quantity_available", e.target.value)} min="1"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <p className="font-semibold text-gray-800">Location</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium">District *</label>
              <input value={form.district} onChange={e => set("district", e.target.value)}
                placeholder="e.g. Nalgonda"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Village</label>
              <input value={form.village} onChange={e => set("village", e.target.value)}
                placeholder="e.g. Devarkonda"
                className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="text-xs text-gray-500 font-medium">Additional Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Temperament, feeding routine, reason for selling, pedigree details…"
            className="w-full mt-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
        </div>

        {/* Photo */}
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
          className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-base hover:bg-green-800 transition-colors disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit for Admin Approval"}
        </button>
        <p className="text-xs text-center text-gray-400 pb-4">Vet certification is added by Jeevadhara team after inspection.</p>
      </form>
    </div>
  );
}
