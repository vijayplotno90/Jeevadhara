"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, TrendingUp, IndianRupee, X } from "lucide-react";

type MandiRate = {
  id: string; crop: string; crop_hi: string | null; state: string;
  market: string; min_price: number; max_price: number; modal_price: number;
  unit: string; rate_date: string;
};

const CROP_META: Record<string, { emoji: string; gradient: string }> = {
  Tomato:    { emoji: "🍅", gradient: "from-red-200 to-orange-100" },
  Onion:     { emoji: "🧅", gradient: "from-rose-200 to-purple-100" },
  Potato:    { emoji: "🥔", gradient: "from-amber-200 to-yellow-100" },
  Wheat:     { emoji: "🌾", gradient: "from-amber-100 to-yellow-50" },
  Rice:      { emoji: "🍚", gradient: "from-stone-100 to-amber-50" },
  Cotton:    { emoji: "☁️", gradient: "from-slate-100 to-stone-50" },
  Maize:     { emoji: "🌽", gradient: "from-yellow-200 to-amber-100" },
  Soybean:   { emoji: "🫘", gradient: "from-lime-200 to-green-100" },
  Groundnut: { emoji: "🥜", gradient: "from-amber-200 to-orange-100" },
  Chilli:    { emoji: "🌶️", gradient: "from-red-300 to-rose-100" },
  Turmeric:  { emoji: "🟡", gradient: "from-yellow-300 to-orange-200" },
  Mango:     { emoji: "🥭", gradient: "from-yellow-300 to-orange-200" },
  Sugarcane: { emoji: "🎋", gradient: "from-lime-200 to-emerald-100" },
};

const CROP_IMG: Record<string, string> = {
  Tomato:    "/mandi/tomato.jpg",
  Onion:     "/mandi/onion.jpg",
  Wheat:     "/mandi/wheat.jpg",
  Rice:      "/mandi/rice.jpg",
  Cotton:    "/mandi/cotton.jpg",
  Groundnut: "/mandi/groundnut.jpg",
  Chilli:    "/mandi/chilli.jpg",
  Turmeric:  "/mandi/turmeric.jpg",
};

function meta(crop: string) {
  return CROP_META[crop] ?? { emoji: "🌱", gradient: "from-emerald-100 to-green-50" };
}

type CropGroup = {
  crop: string; crop_hi: string | null; avgModal: number;
  minPrice: number; maxPrice: number; marketCount: number; rates: MandiRate[];
};

export default function MandiRatesPage() {
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [q, setQ] = useState("");
  const [state, setState] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mandi-rates")
      .then(r => r.json())
      .then(d => { setRates(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const states = useMemo(() => ["All", ...Array.from(new Set(rates.map(r => r.state))).sort()], [rates]);

  const filtered = useMemo(() => {
    let list = rates;
    if (state !== "All") list = list.filter(r => r.state === state);
    if (q.trim()) list = list.filter(r => r.crop.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [rates, q, state]);

  const groups = useMemo(() => {
    const map = new Map<string, CropGroup>();
    filtered.forEach(r => {
      const g = map.get(r.crop) ?? { crop: r.crop, crop_hi: r.crop_hi, avgModal: 0, minPrice: Infinity, maxPrice: 0, marketCount: 0, rates: [] };
      g.rates.push(r);
      g.minPrice = Math.min(g.minPrice, r.min_price);
      g.maxPrice = Math.max(g.maxPrice, r.max_price);
      g.marketCount++;
      map.set(r.crop, g);
    });
    map.forEach(g => { g.avgModal = Math.round(g.rates.reduce((s, r) => s + r.modal_price, 0) / g.rates.length); });
    return Array.from(map.values()).sort((a, b) => b.avgModal - a.avgModal);
  }, [filtered]);

  const selected = selectedCrop ? groups.find(g => g.crop === selectedCrop) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-5xl">📊</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">Mandi Rates</h1>
          <p className="mt-2 text-gray-500">Today's wholesale prices for major crops across India</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search crop..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200" />
            </div>
            <select value={state} onChange={e => setState(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-green-600">
              {states.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading rates...</div>
        ) : (
          <>
            {/* Crop cards grid */}
            {!selectedCrop && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {groups.map(g => {
                  const m = meta(g.crop);
                  return (
                    <button key={g.crop} onClick={() => setSelectedCrop(g.crop)}
                      className="rounded-2xl border border-gray-100 overflow-hidden text-left shadow-soft hover:-translate-y-0.5 hover:shadow-card transition-all bg-white">
                      {CROP_IMG[g.crop] ? (
                        <div className="h-28 w-full overflow-hidden relative">
                          <img src={CROP_IMG[g.crop]} alt={g.crop}
                            className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className={`h-28 w-full bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
                          <span className="text-4xl">{m.emoji}</span>
                        </div>
                      )}
                      <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{g.marketCount} market{g.marketCount !== 1 ? "s" : ""}</span>
                        <TrendingUp className="h-4 w-4 text-green-700" />
                      </div>
                      <h3 className="mt-2 font-serif font-bold text-gray-900">{g.crop}</h3>
                      {g.crop_hi && <p className="text-xs text-gray-500">{g.crop_hi}</p>}
                      <div className="mt-2 flex items-baseline gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-green-700" />
                        <span className="font-serif text-2xl font-bold text-green-700">{g.avgModal.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">/quintal</span>
                      </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Crop detail drawer */}
            {selected && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-card">
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{meta(selected.crop).emoji}</span>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900">{selected.crop}</h2>
                        {selected.crop_hi && <p className="text-sm text-gray-500">{selected.crop_hi}</p>}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-6 text-sm text-gray-600">
                      <span>Avg modal: <strong className="text-green-700">₹{selected.avgModal.toLocaleString()}/qtl</strong></span>
                      <span>Range: <strong>₹{selected.minPrice.toLocaleString()} – ₹{selected.maxPrice.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCrop(null)} className="rounded-full p-2 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-6 py-3 text-left">Market</th>
                        <th className="px-6 py-3 text-left">State</th>
                        <th className="px-6 py-3 text-right">Min</th>
                        <th className="px-6 py-3 text-right">Max</th>
                        <th className="px-6 py-3 text-right font-bold text-green-700">Modal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selected.rates.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{r.market}</td>
                          <td className="px-6 py-4 text-gray-500">{r.state}</td>
                          <td className="px-6 py-4 text-right text-gray-600">₹{r.min_price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-gray-600">₹{r.max_price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-bold text-green-700">₹{r.modal_price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4">
                  <button onClick={() => setSelectedCrop(null)} className="text-sm text-green-700 hover:underline">← Back to all crops</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
