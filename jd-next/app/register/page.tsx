"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ farmer: { name: string } } | null>(null);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "",
    district: "", village: "",
    farm_name: "", total_acres: "", soil_type: "",
    water_source: "", description: "", is_organic: false,
  });

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/farmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setResult(data);
      setStep("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-green-800 mb-3">Welcome to Jeevadhara!</h1>
        <p className="text-gray-600 mb-2">
          {result?.farmer?.name}, your farm is now registered.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Our team will contact you for Jeevadhara certification within 3–5 working days.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/products" className="bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600">
            Browse Products
          </a>
          <button onClick={() => { setStep("form"); setForm({ name:"",phone:"",email:"",password:"",district:"",village:"",farm_name:"",total_acres:"",soil_type:"",water_source:"",description:"",is_organic:false }); }}
            className="border border-green-700 text-green-700 px-6 py-3 rounded-full font-medium hover:bg-green-50">
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Register Your Farm</h1>
      <p className="text-gray-500 mb-8">Join Jeevadhara — sell directly to consumers across Telangana, zero commission.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
          <h2 className="font-semibold text-green-800 mb-4">👤 Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Ravi Kumar"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input required value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="9848012345" type="tel"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="optional" type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input required value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="Min 6 chars" type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <select required value={form.district} onChange={e => set("district", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Select district</option>
                {["Nalgonda","Warangal","Medak","Karimnagar","Adilabad","Hyderabad","Khammam","Nizamabad","Mahbubnagar","Rangareddy"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
              <input required value={form.village} onChange={e => set("village", e.target.value)}
                placeholder="Village name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        {/* Farm Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
          <h2 className="font-semibold text-green-800 mb-4">🌾 Farm Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name *</label>
              <input required value={form.farm_name} onChange={e => set("farm_name", e.target.value)}
                placeholder="e.g. Ravi Organic Farm"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Acres</label>
              <input value={form.total_acres} onChange={e => set("total_acres", e.target.value)}
                placeholder="2.5" type="number" step="0.1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
              <select value={form.soil_type} onChange={e => set("soil_type", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Select soil</option>
                <option>Black Cotton Soil</option>
                <option>Red Soil</option>
                <option>Alluvial Soil</option>
                <option>Sandy Loam</option>
                <option>Clay Soil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Source</label>
              <select value={form.water_source} onChange={e => set("water_source", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">Select source</option>
                <option>Borewell</option>
                <option>Canal</option>
                <option>Tank / Pond</option>
                <option>Rainwater</option>
                <option>River</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Tell buyers about your farm, crops grown, farming practices..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_organic}
                  onChange={e => set("is_organic", e.target.checked)}
                  className="w-5 h-5 rounded text-green-600" />
                <span>
                  <span className="font-medium text-gray-700">🌿 I practice organic farming</span>
                  <span className="text-gray-400 text-xs block">No chemical pesticides or synthetic fertilizers</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? "⏳ Registering..." : "✅ Register My Farm on Jeevadhara"}
        </button>
        <p className="text-center text-xs text-gray-400">
          Free registration · No commission · Certification support provided
        </p>
      </form>
    </div>
  );
}
