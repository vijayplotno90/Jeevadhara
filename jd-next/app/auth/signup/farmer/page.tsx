"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DISTRICTS = [
  "Hyderabad","Rangareddy","Medchal","Sangareddy","Nizamabad","Karimnagar",
  "Warangal","Khammam","Nalgonda","Mahbubnagar","Adilabad","Vikarabad",
  "Siddipet","Jangaon","Suryapet","Yadadri","Medak","Peddapalli","Rajanna Sircilla",
  "Bhadradri Kothagudem","Mulugu","Narayanpet","Mahabubabad","Wanaparthy","Gadwal","Nagarkurnool"
];

const CROPS = [
  "Rice","Wheat","Maize","Jowar","Bajra","Cotton","Sugarcane",
  "Tomato","Onion","Chilli","Brinjal","Okra","Cucumber","Cabbage",
  "Turmeric","Ginger","Garlic","Mango","Banana","Papaya","Guava",
  "Toor Dal","Urad Dal","Moong Dal","Groundnut","Sunflower","Sesame",
  "Honey","Eggs","Mushrooms","Other"
];

export default function FarmerSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "",
    district: "", village: "", aadhar: "",
    land_acres: "", crops: [] as string[], storage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleCrop(crop: string) {
    setForm((f) => ({
      ...f,
      crops: f.crops.includes(crop) ? f.crops.filter((c) => c !== crop) : [...f.crops, crop],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", role: "farmer", ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      localStorage.setItem("jd_token", data.token);
      localStorage.setItem("jd_role", "farmer");
      localStorage.setItem("jd_name", data.name);
      localStorage.setItem("jd_user_id", data.id);
      router.push("/farmer/dashboard");
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/auth" className="text-sm text-gray-500 hover:text-green-600 mb-4 inline-block">← Back to role selection</Link>
          <div className="text-5xl mb-3">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">Register as Farmer</h1>
          <p className="text-gray-500 text-sm mt-1">రైతు నమోదు · Sell direct, earn fair</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    placeholder="Your full name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                    placeholder="9876543210" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    placeholder="farmer@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input required type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                    placeholder="Min 6 chars" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                  <input value={form.aadhar} onChange={e=>setForm(f=>({...f,aadhar:e.target.value}))}
                    placeholder="XXXX XXXX XXXX" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Farm Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <select required value={form.district} onChange={e=>setForm(f=>({...f,district:e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                    <option value="">Select district</option>
                    {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village / Mandal</label>
                  <input value={form.village} onChange={e=>setForm(f=>({...f,village:e.target.value}))}
                    placeholder="e.g. Solipeta" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land (Acres)</label>
                  <input type="number" step="0.5" value={form.land_acres} onChange={e=>setForm(f=>({...f,land_acres:e.target.value}))}
                    placeholder="e.g. 5" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                  <input value={form.storage} onChange={e=>setForm(f=>({...f,storage:e.target.value}))}
                    placeholder="e.g. Home / Warehouse" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>

            {/* Crops */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Crops You Grow</h3>
              <div className="flex flex-wrap gap-2">
                {CROPS.map(c=>(
                  <button type="button" key={c}
                    onClick={()=>toggleCrop(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.crops.includes(c) ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
                    }`}
                  >{c}</button>
                ))}
              </div>
              {form.crops.length > 0 && (
                <p className="text-xs text-green-600 mt-2">Selected: {form.crops.join(", ")}</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors text-base">
              {loading ? "Creating account..." : "🌾 Register as Farmer"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <Link href="/auth/login" className="text-green-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
