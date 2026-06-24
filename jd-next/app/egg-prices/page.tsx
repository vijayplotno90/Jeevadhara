"use client";
import { useEffect, useMemo, useState } from "react";
import { TrendingDown, TrendingUp, IndianRupee } from "lucide-react";

type EggRate = { id: string; city: string; state: string; price_per_100: number; rate_date: string };

const CITY_TIERS: Record<string, string> = {
  Namakkal: "Source Hub", Hyderabad: "Major City", Bengaluru: "Major City",
  Mumbai: "Metro", "Delhi (CC)": "Metro", Kolkata: "Metro", Pune: "Major City",
};

export default function EggPricesPage() {
  const [rates, setRates] = useState<EggRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/egg-rates")
      .then(r => r.json())
      .then(d => { setRates(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const avg = useMemo(() => rates.length ? Math.round(rates.reduce((s, r) => s + r.price_per_100, 0) / rates.length) : 0, [rates]);
  const sorted = useMemo(() => [...rates].sort((a, b) => b.price_per_100 - a.price_per_100), [rates]);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-5xl">🥚</span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">Egg Prices</h1>
          <p className="mt-2 text-gray-500">Daily wholesale egg rates across major Indian cities</p>
          {!loading && avg > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-xl bg-white border border-amber-200 px-5 py-3 shadow-soft">
                <p className="text-xs text-gray-500">National Average</p>
                <p className="font-serif text-2xl font-bold text-amber-700">₹{avg}<span className="text-sm font-normal text-gray-400">/100 eggs</span></p>
              </div>
              {highest && (
                <div className="rounded-xl bg-white border border-red-100 px-5 py-3 shadow-soft flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Highest — {highest.city}</p>
                    <p className="font-serif text-xl font-bold text-red-600">₹{highest.price_per_100}</p>
                  </div>
                </div>
              )}
              {lowest && (
                <div className="rounded-xl bg-white border border-green-100 px-5 py-3 shadow-soft flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Lowest — {lowest.city}</p>
                    <p className="font-serif text-xl font-bold text-green-700">₹{lowest.price_per_100}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading rates...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((r, i) => {
              const pct = Math.round(((r.price_per_100 - (lowest?.price_per_100 ?? r.price_per_100)) / Math.max(1, (highest?.price_per_100 ?? r.price_per_100) - (lowest?.price_per_100 ?? r.price_per_100))) * 100);
              return (
                <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft hover:shadow-card transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">Highest</span>}
                        {i === sorted.length - 1 && <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Lowest</span>}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-gray-900 mt-1">{r.city}</h3>
                      <p className="text-sm text-gray-500">{r.state}</p>
                      {CITY_TIERS[r.city] && <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">{CITY_TIERS[r.city]}</span>}
                    </div>
                    <span className="text-4xl">🥚</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <IndianRupee className="h-4 w-4 text-amber-700" />
                    <span className="font-serif text-3xl font-bold text-amber-700">{r.price_per_100}</span>
                    <span className="text-sm text-gray-400">/ 100 eggs</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">₹{(r.price_per_100 / 100).toFixed(2)} per egg</div>
                  <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <h3 className="font-serif text-lg font-bold text-amber-900">🐔 Want to sell eggs?</h3>
          <p className="mt-2 text-sm text-amber-800">List your farm-fresh eggs on Jeevadhara and reach consumers directly.</p>
          <a href="/list-produce" className="mt-3 inline-block rounded-lg bg-amber-600 text-white px-5 py-2 text-sm font-semibold hover:bg-amber-700">Start selling</a>
        </div>
      </div>
    </div>
  );
}
