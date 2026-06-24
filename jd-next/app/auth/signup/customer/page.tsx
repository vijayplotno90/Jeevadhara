"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PREFS = ["Vegetables","Fruits","Grains","Pulses","Spices","Honey","Eggs","Organic only","Local produce"];
const FREQ = ["Daily","Weekly","Bi-weekly","Monthly"];

export default function CustomerSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name:"", phone:"", email:"", password:"",
    city:"", pincode:"", frequency:"Weekly", prefs:[] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function togglePref(p: string) {
    setForm(f=>({ ...f, prefs: f.prefs.includes(p) ? f.prefs.filter(x=>x!==p) : [...f.prefs, p] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ action:"register", role:"consumer", ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      localStorage.setItem("jd_token", data.token);
      localStorage.setItem("jd_role", "consumer");
      localStorage.setItem("jd_name", data.name);
      localStorage.setItem("jd_user_id", data.id);
      router.push("/fresh-harvest");
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/auth" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">← Back to role selection</Link>
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Customer Account</h1>
          <p className="text-gray-500 text-sm mt-1">వినియోగదారు · Fresh, traceable, yours</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  placeholder="Your name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input required type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                  placeholder="9876543210" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  placeholder="you@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input required type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                  placeholder="Min 6 characters" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}
                  placeholder="Hyderabad" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                <input value={form.pincode} onChange={e=>setForm(f=>({...f,pincode:e.target.value}))}
                  placeholder="500001" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shopping Frequency</label>
              <div className="flex gap-2 flex-wrap">
                {FREQ.map(f=>(
                  <button type="button" key={f} onClick={()=>setForm(fm=>({...fm,frequency:f}))}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.frequency===f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}>{f}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Preferences</label>
              <div className="flex flex-wrap gap-2">
                {PREFS.map(p=>(
                  <button type="button" key={p} onClick={()=>togglePref(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.prefs.includes(p) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}>{p}</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors text-base">
              {loading ? "Creating account..." : "🛒 Start Shopping Fresh"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
