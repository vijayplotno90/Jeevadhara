"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EggRate = {
  id: string;
  city: string;
  state: string;
  price_per_100: number;
  rate_date: string;
};

const EGG_TYPES = [
  { id: "white", name: "White Layer (NECC)", tagline: "Standard NECC commercial layer",
    description: "Benchmark NECC wholesale rate - eggs from Leghorn-type white-feathered layer hens. Most widely traded in India.",
    premiumPct: 0, badge: null, color: "amber" },
  { id: "brown", name: "Brown Eggs", tagline: "Rhode Island Red and similar breeds",
    description: "Thicker shell, slightly larger yolk, mild taste difference. From brown-feathered layer breeds. ~18% premium over white eggs.",
    premiumPct: 18, badge: null, color: "orange" },
  { id: "country", name: "Country / Naatu Kodi", tagline: "Desi free-range",
    description: "Traditional desi hens, free-roaming, corn-grass fed. Deep orange yolk, richer flavour, smaller size. Most preferred in Telangana.",
    premiumPct: 220, badge: "Most preferred in South India", color: "red" },
  { id: "kadaknath", name: "Kadaknath", tagline: "GI-tagged black-meat breed",
    description: "GI-tagged Kali Masi breed from MP. Black flesh, bones, and organs. Extremely low-fat, high-protein eggs. Prized for medicinal value.",
    premiumPct: 380, badge: "GI Tagged - Premium", color: "purple" },
  { id: "quail", name: "Quail (Bater) Eggs", tagline: "Small, speckled, protein-dense",
    description: "Tiny speckled eggs from Japanese quail. Rich in B12, iron, and selenium. 3-4 quail eggs = 1 chicken egg in nutrition.",
    premiumPct: -20, badge: null, color: "teal" },
  { id: "duck", name: "Duck Eggs", tagline: "Coastal and wetland farms",
    description: "Larger than chicken eggs, creamier whites, richer dark yolk. Popular for baking. Major production in Krishna, West Godavari districts.",
    premiumPct: 60, badge: null, color: "blue" },
];

const ACCENT: Record<string, string> = {
  amber: "text-amber-700 bg-amber-50 border-amber-200",
  orange: "text-orange-700 bg-orange-50 border-orange-200",
  red: "text-red-700 bg-red-50 border-red-200",
  purple: "text-purple-700 bg-purple-50 border-purple-200",
  teal: "text-teal-700 bg-teal-50 border-teal-200",
  blue: "text-blue-700 bg-blue-50 border-blue-200",
};

const ACTIVE_HEADER: Record<string, string> = {
  amber: "from-amber-500 to-yellow-400",
  orange: "from-orange-500 to-amber-400",
  red: "from-red-600 to-orange-400",
  purple: "from-purple-700 to-violet-500",
  teal: "from-teal-600 to-cyan-400",
  blue: "from-blue-600 to-sky-400",
};

function fmt(n: number) {
  return Number(n).toFixed(2).replace(/\.00$/, "");
}

export default function EggPricesPage() {
  const [rates, setRates] = useState<EggRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("white");

  useEffect(() => {
    fetch("/api/egg-rates")
      .then((r) => r.json())
      .then((d) => { setRates(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const activeType = EGG_TYPES.find((t) => t.id === activeId)!;

  const adjusted = useMemo(() => {
    return rates
      .map((r) => ({
        ...r,
        price_per_100: Math.round(Number(r.price_per_100) * (1 + activeType.premiumPct / 100)),
      }))
      .sort((a, b) => b.price_per_100 - a.price_per_100);
  }, [rates, activeType]);

  const avg = adjusted.length
    ? Math.round(adjusted.reduce((s, r) => s + r.price_per_100, 0) / adjusted.length)
    : 0;
  const highest = adjusted[0];
  const lowest = adjusted[adjusted.length - 1];
  const accent = ACCENT[activeType.color];
  const gradient = ACTIVE_HEADER[activeType.color];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${gradient} text-white px-4 py-8`}>
        <h1 className="text-2xl font-bold">Egg Market</h1>
        <p className="text-white/80 text-sm mt-1">Daily rates by egg type - Telangana and major Indian cities</p>
        <p className="text-white/60 text-xs mt-1">
          Updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="flex overflow-x-auto gap-2 px-3 py-3">
          {EGG_TYPES.map((t) => (
            <button key={t.id} onClick={() => setActiveId(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
                activeId === t.id ? `border-current ${ACCENT[t.color]} shadow-sm` : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
              }`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className={`rounded-2xl border p-4 mb-5 ${accent}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-bold text-base">{activeType.name}</p>
              <p className="text-xs opacity-70">{activeType.tagline}</p>
              <p className="text-sm mt-2 leading-relaxed opacity-80">{activeType.description}</p>
            </div>
            {activeType.badge && (
              <span className="shrink-0 text-xs font-bold bg-black/10 px-3 py-1 rounded-full whitespace-nowrap">
                {activeType.badge}
              </span>
            )}
          </div>
          {activeType.premiumPct !== 0 && (
            <p className="text-xs mt-2 opacity-60">
              Prices estimated from NECC white rate {activeType.premiumPct > 0 ? "+" : ""}{activeType.premiumPct}% typical market premium.
            </p>
          )}
        </div>

        {!loading && avg > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
              <p className="text-xs text-gray-500">National Avg</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">Rs{avg}</p>
              <p className="text-xs text-gray-400">/ 100 eggs</p>
            </div>
            {highest && (
              <div className="bg-white rounded-xl border border-red-100 shadow-sm p-3 text-center">
                <p className="text-xs text-gray-500">Highest</p>
                <p className="text-xl font-bold text-red-600 mt-0.5">Rs{highest.price_per_100}</p>
                <p className="text-xs text-gray-400">{highest.city}</p>
              </div>
            )}
            {lowest && (
              <div className="bg-white rounded-xl border border-green-100 shadow-sm p-3 text-center">
                <p className="text-xs text-gray-500">Lowest</p>
                <p className="text-xl font-bold text-green-700 mt-0.5">Rs{lowest.price_per_100}</p>
                <p className="text-xs text-gray-400">{lowest.city}</p>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading rates...</div>
        ) : adjusted.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No rates available today.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {adjusted.map((r, i) => {
              const range = (highest?.price_per_100 ?? 1) - (lowest?.price_per_100 ?? 0);
              const pct = range > 0
                ? Math.round(((r.price_per_100 - (lowest?.price_per_100 ?? 0)) / range) * 100)
                : 50;
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      {i === 0 && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Highest</span>}
                      {i === adjusted.length - 1 && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Lowest</span>}
                      <p className="font-bold text-gray-900 mt-1">{r.city}</p>
                      <p className="text-xs text-gray-400">{r.state}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-gray-900">Rs{r.price_per_100}</span>
                    <span className="text-xs text-gray-400 ml-1">/ 100</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Rs{fmt(r.price_per_100 / 100)} per egg</p>
                  <div className="mt-3 h-1 rounded-full bg-gray-100">
                    <div className="h-1 rounded-full bg-amber-400 transition-all" style={{ width: `${Math.max(8, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && avg > 0 && (
          <div className="mt-5 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="font-semibold text-amber-900 text-sm">Quick Price Reference - {activeType.name}</p>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[1, 6, 30, 100].map((qty) => (
                <div key={qty} className="text-center">
                  <p className="text-xs text-amber-700 font-medium">{qty} egg{qty > 1 ? "s" : ""}</p>
                  <p className="text-sm font-bold text-amber-900 mt-0.5">Rs{fmt((avg / 100) * qty)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-green-900 text-sm">Sell your eggs on Jeevadhara</p>
            <p className="text-xs text-green-700 mt-0.5">List farm-fresh eggs - reach buyers directly, update price daily</p>
          </div>
          <Link href="/list-produce"
            className="shrink-0 bg-green-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Start Selling
          </Link>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4 pb-4">
          NECC white egg rates used as base. Other types are market estimates. Actual local prices may vary.
        </p>
      </div>
    </div>
  );
}
