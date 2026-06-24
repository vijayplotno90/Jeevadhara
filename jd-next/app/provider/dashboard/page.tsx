"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  crops: string;
  land_acres: number;
  created_at: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("jd_role");
    if (role !== "provider") { router.push("/auth/login"); return; }
    setName(localStorage.getItem("jd_name") || "Provider");

    async function load() {
      try {
        const res = await fetch("/api/farmers");
        if (res.ok) {
          const data = await res.json();
          setLeads(Array.isArray(data) ? data : data.farmers || []);
        }
      } catch(e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [router]);

  const filtered = leads.filter(l =>
    !filter ||
    l.district?.toLowerCase().includes(filter.toLowerCase()) ||
    l.name?.toLowerCase().includes(filter.toLowerCase()) ||
    l.crops?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      <div className="text-center"><div className="text-5xl mb-4">🏢</div><p>Loading leads...</p></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🏢 {name} — Lead Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Verified farmer contacts in Telangana · IndiaMart-style CRM</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-semibold">
          {leads.length} Farmer Leads
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-3xl mb-2">👨‍🌾</div>
          <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total Farmer Leads</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-3xl mb-2">📍</div>
          <div className="text-2xl font-bold text-gray-900">{new Set(leads.map(l=>l.district)).size}</div>
          <div className="text-xs text-gray-500 mt-0.5">Districts Covered</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-3xl mb-2">🌾</div>
          <div className="text-2xl font-bold text-gray-900">{leads.filter(l=>Number(l.land_acres)>5).length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Large Farms (5+ acres)</div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <input
          value={filter}
          onChange={e=>setFilter(e.target.value)}
          placeholder="Filter by name, district or crop..."
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Farmer Contact Database</h2>
          <span className="text-xs text-gray-400">Showing {filtered.length} of {leads.length} leads</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Farmer</th>
                <th className="px-5 py-3 text-left">Location</th>
                <th className="px-5 py-3 text-left">Crops</th>
                <th className="px-5 py-3 text-left">Land</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-400">Joined {new Date(l.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div>{l.district}</div>
                    {l.village && <div className="text-xs text-gray-400">{l.village}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {l.crops ? l.crops.split(",").slice(0,3).map(c=>(
                        <span key={c} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{c.trim()}</span>
                      )) : <span className="text-gray-400 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{l.land_acres ? `${l.land_acres} acres` : "—"}</td>
                  <td className="px-5 py-4">
                    <span className="text-gray-600 font-mono text-xs">{l.phone || "—"}</span>
                  </td>
                  <td className="px-5 py-4">
                    <a href={`tel:${l.phone}`}
                      className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 font-medium">
                      📞 Call
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No leads match your filter</div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5 text-sm text-orange-800">
        <p className="font-semibold mb-1">💼 How it works (IndiaMart model):</p>
        <p>Farmers who sign up on Jeevadhara appear as leads here. You can filter by district, crop type, and farm size to find your ideal customer. Call directly or message via WhatsApp to pitch your services.</p>
      </div>
    </div>
  );
}
