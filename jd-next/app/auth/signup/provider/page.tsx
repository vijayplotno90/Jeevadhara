"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SERVICE_TYPES = [
  "Tractor & Equipment Rental","Pesticide & Fertilizer Dealer","Seed Supplier",
  "Cold Storage","Transport & Logistics","Livestock & Veterinary","Agri Input Dealer",
  "Farm Machinery Dealer","Drip Irrigation Installer","Agri Consultant / Expert",
  "Honey Processing","Nursery & Plant Nursery","Animal Feed Supplier","Other"
];

export default function ProviderSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name:"", phone:"", email:"", password:"",
    business_name:"", service_type:"", website:"", years_exp:"",
    regions:[] as string[], description:"",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ action:"register", role:"provider", ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      localStorage.setItem("jd_token", data.token);
      localStorage.setItem("jd_role", "provider");
      localStorage.setItem("jd_name", data.name || form.business_name);
      localStorage.setItem("jd_user_id", data.id);
      router.push("/provider/dashboard");
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/auth" className="text-sm text-gray-500 hover:text-orange-600 mb-4 inline-block">← Back to role selection</Link>
          <div className="text-5xl mb-3">🏢</div>
          <h1 className="text-2xl font-bold text-gray-900">Register as Service Provider</h1>
          <p className="text-gray-500 text-sm mt-1">సేవా సంస్థ · Reach verified Telangana farmers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Person</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    placeholder="Contact person name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                    placeholder="9876543210" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    placeholder="business@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input required type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                    placeholder="Min 6 chars" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Business Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input required value={form.business_name} onChange={e=>setForm(f=>({...f,business_name:e.target.value}))}
                    placeholder="Your company / shop name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select required value={form.service_type} onChange={e=>setForm(f=>({...f,service_type:e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">Select your service</option>
                    {SERVICE_TYPES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                  <input value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))}
                    placeholder="https://yourbusiness.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
                  <input type="number" value={form.years_exp} onChange={e=>setForm(f=>({...f,years_exp:e.target.value}))}
                    placeholder="e.g. 5" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Your Service</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                    placeholder="Describe what you offer to farmers..." rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800">
              <p className="font-semibold">📋 What you get:</p>
              <ul className="mt-1 space-y-0.5 text-xs">
                <li>✓ Access to leads from verified farmers in Telangana</li>
                <li>✓ See customer interest and contact requests</li>
                <li>✓ IndiaMart-style lead management dashboard</li>
                <li>✓ Regional targeting by district</li>
              </ul>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors text-base">
              {loading ? "Creating account..." : "🏢 Register Business"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <Link href="/auth/login" className="text-orange-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
