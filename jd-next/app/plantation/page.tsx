"use client";
import { useEffect, useState } from "react";

interface PlantRow {
  slug: string;
  name: string;
  image_url: string | null;
  min_price: number;
  max_price: number;
  seller_count: number;
  unit: string;
}

interface SellerRow {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  description: string | null;
  district: string | null;
  is_organic: boolean;
  seller_name: string | null;
  seller_phone: string | null;
  seller_village: string | null;
  seller_district: string | null;
}

const PLANT_COLOR: Record<string, string> = {
  "alphonso-mango-sapling": "from-yellow-500 to-orange-400",
  "g9-banana-tc-plant": "from-yellow-400 to-lime-400",
  "west-coast-tall-coconut": "from-green-600 to-teal-500",
  "teak-sapling-1yr": "from-amber-700 to-orange-600",
  "moringa-pkm-1": "from-green-500 to-emerald-400",
  "sitaphal-na-1": "from-lime-500 to-green-400",
  "amla-na-7": "from-purple-500 to-violet-400",
  "l-49-guava": "from-green-400 to-lime-300",
};

export default function PlantationPage() {
  const [plants, setPlants] = useState<PlantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; slug: string; name: string }>({
    open: false, slug: "", name: "",
  });
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);

  useEffect(() => {
    fetch("/api/nursery")
      .then((r) => r.json())
      .then((d) => { setPlants(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function openModal(slug: string, name: string) {
    setModal({ open: true, slug, name });
    setSellers([]);
    setSellersLoading(true);
    fetch(`/api/nursery/${slug}`)
      .then((r) => r.json())
      .then((d) => { setSellers(Array.isArray(d) ? d : []); setSellersLoading(false); })
      .catch(() => setSellersLoading(false));
  }

  function closeModal() {
    setModal({ open: false, slug: "", name: "" });
    setSellers([]);
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white px-4 py-8">
        <h1 className="text-2xl font-bold">Nursery and Plantation</h1>
        <p className="text-green-100 text-sm mt-1">
          Certified saplings from verified nursery dealers - mango, banana, coconut, teak and more
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading plants...</div>
        ) : plants.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No plants found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {plants.map((p) => {
              const gradient = PLANT_COLOR[p.slug] || "from-green-500 to-teal-400";
              return (
                <button key={p.slug} onClick={() => openModal(p.slug, p.name)}
                  className="bg-white rounded-2xl shadow hover:shadow-md transition-all text-left overflow-hidden group">
                  <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                    <span className="text-4xl drop-shadow">{p.slug.includes("mango") ? "Mango" : p.slug.includes("banana") ? "Banana" : p.slug.includes("coconut") ? "Coconut" : "Plant"}</span>
                    <span className="absolute bottom-2 right-2 text-white text-xs bg-black/30 px-2 py-0.5 rounded-full">
                      {p.seller_count} dealer{p.seller_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-green-700">{p.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-green-700 font-bold text-sm">Rs{Number(p.min_price).toLocaleString("en-IN")}</span>
                        {p.min_price !== p.max_price && (
                          <span className="text-gray-400 text-xs"> - Rs{Number(p.max_price).toLocaleString("en-IN")}</span>
                        )}
                        <span className="text-gray-400 text-xs"> / {p.unit}</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Compare</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{modal.name}</h2>
                <p className="text-sm text-gray-500">{sellers.length} nursery dealer{sellers.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                X
              </button>
            </div>

            <div className="p-4 space-y-3">
              {sellersLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : sellers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No dealers.</div>
              ) : sellers.map((s) => (
                <div key={s.id} className="border rounded-xl p-4 space-y-2 hover:border-green-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {s.is_organic && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Certified Organic</span>
                      )}
                      <p className="text-gray-700 text-sm mt-1 leading-snug">{s.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-green-700 font-bold text-base">Rs{Number(s.price).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-gray-400">/ {s.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{s.stock.toLocaleString("en-IN")} plants</span>
                    {s.seller_district && (
                      <span>{s.seller_village || s.seller_district}, {s.seller_district}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.seller_name || "Nursery Dealer"}</p>
                      {s.seller_phone && <p className="text-xs text-gray-500">{s.seller_phone}</p>}
                    </div>
                    {s.seller_phone && (
                      <a href={`tel:${s.seller_phone}`}
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                        Call Dealer
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-1">
              <p className="text-xs text-center text-gray-400">All nurseries verified by Jeevadhara admin team before listing</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
