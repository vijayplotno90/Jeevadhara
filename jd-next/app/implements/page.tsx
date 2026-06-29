"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ToolRow {
  slug: string;
  name: string;
  category: string;
  image_url: string;
  min_price: number;
  max_price: number;
  seller_count: number;
}

interface SellerRow {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  condition: string;
  description: string | null;
  image_url: string | null;
  price: number;
  unit: string;
  stock: number;
  district: string | null;
  village: string | null;
  seller_name: string | null;
  seller_phone: string | null;
}

const CAT_LABELS: Record<string, string> = {
  all: "All",
  hand: "Hand Tools",
  powered: "Powered",
  irrigation: "Irrigation",
};

const TOOL_EMOJIS: Record<string, string> = {
  "garden-fork": "Fork",
  "hand-trowel": "Trowel",
  hoe: "Hoe",
  rake: "Rake",
  shovel: "Shovel",
  sickle: "Sickle",
  spade: "Spade",
  "knapsack-sprayer": "Sprayer",
  wheelbarrow: "Barrow",
};

export default function ImplementsPage() {
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [cat, setCat] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; slug: string; name: string }>({
    open: false,
    slug: "",
    name: "",
  });
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tools")
      .then((r) => r.json())
      .then((d) => {
        setTools(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tools.filter((t) => cat === "all" || t.category === cat);

  function openModal(slug: string, name: string) {
    setModal({ open: true, slug, name });
    setSellers([]);
    setSellersLoading(true);
    fetch(`/api/tools/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setSellers(Array.isArray(d) ? d : []);
        setSellersLoading(false);
      })
      .catch(() => setSellersLoading(false));
  }

  function closeModal() {
    setModal({ open: false, slug: "", name: "" });
    setSellers([]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🔧 Farm Tools & Implements</h1>
          <p className="text-orange-100 text-sm mt-1">
            Hand tools and powered equipment — all new, from verified sellers
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto">
          {Object.entries(CAT_LABELS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === k
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tools...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No tools found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <button
                key={t.slug}
                onClick={() => openModal(t.slug, t.name)}
                className="bg-white rounded-2xl shadow hover:shadow-md transition-all text-left overflow-hidden group"
              >
                <div className="relative h-40 bg-orange-50 flex items-center justify-center">
                  {t.image_url ? (
                    <Image
                      src={t.image_url}
                      alt={t.name}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width:640px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-2xl text-orange-400">
                      {TOOL_EMOJIS[t.slug] || "Tool"}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-orange-600">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">
                    {CAT_LABELS[t.category] || t.category}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-orange-600 font-bold text-sm">
                        Rs{Number(t.min_price).toLocaleString("en-IN")}
                      </span>
                      {t.min_price !== t.max_price && (
                        <span className="text-gray-400 text-xs">
                          {" "}- Rs{Number(t.max_price).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {t.seller_count} seller{t.seller_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{modal.name}</h2>
                <p className="text-sm text-gray-500">
                  {sellers.length} seller{sellers.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                X
              </button>
            </div>

            <div className="p-4 space-y-3">
              {sellersLoading ? (
                <div className="text-center py-8 text-gray-400">Loading sellers...</div>
              ) : sellers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No sellers found.</div>
              ) : (
                sellers.map((s) => (
                  <div
                    key={s.id}
                    className="border rounded-xl p-4 space-y-2 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {s.brand && (
                          <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            {s.brand}
                          </span>
                        )}
                        <p className="text-gray-700 text-sm mt-1 leading-snug">
                          {s.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-orange-600 font-bold text-base">
                          Rs{Number(s.price).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-gray-400">/ {s.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Stock: {s.stock}</span>
                      {s.district && <span>{s.village || s.district}, {s.district}</span>}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {s.seller_name || "Seller"}
                        </p>
                        {s.seller_phone && (
                          <p className="text-xs text-gray-500">{s.seller_phone}</p>
                        )}
                      </div>
                      {s.seller_phone && (
                        <a
                          href={`tel:${s.seller_phone}`}
                          className="bg-orange-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                        >
                          Call Seller
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 pb-5 pt-1">
              <p className="text-xs text-center text-gray-400">
                All listings verified by Jeevadhara admin team
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
