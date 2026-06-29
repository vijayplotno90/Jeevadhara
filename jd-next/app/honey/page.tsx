"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HoneyRow {
  slug: string;
  name: string;
  image_url: string;
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
  image_url: string | null;
  district: string | null;
  is_organic: boolean;
  seller_name: string | null;
  seller_phone: string | null;
  seller_village: string | null;
  seller_district: string | null;
}

const HONEY_IMG: Record<string, string> = {
  "raw-forest-honey":       "/honey/forest-wild-honey.jpg",
  "multiflora-wild-honey":  "/honey/multiflora-wild-honey.jpg",
  "apis-cerana-beebox":     "/honey/beeboxes.webp",
  "mellifera-beebox":       "/honey/beeboxes.webp",
  "raw-honeycomb":          "/honey/honeycomb.jpg",
  "pure-beeswax":           "/honey/beewax.jpg",
  "propolis-extract":       "/honey/propolis.jpg",
  "royal-jelly":            "/honey/royal-jelly.jpg",
};

const HONEY_EMOJIS: Record<string, string> = {
  "raw-forest-honey":       "Forest Honey",
  "multiflora-wild-honey":  "Wild Honey",
  "apis-cerana-beebox":     "Cerana Box",
  "mellifera-beebox":       "Mellifera Box",
  "raw-honeycomb":          "Honeycomb",
  "pure-beeswax":           "Beeswax",
  "propolis-extract":       "Propolis",
  "royal-jelly":            "Royal Jelly",
};

export default function HoneyPage() {
  const [products, setProducts] = useState<HoneyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; slug: string; name: string }>({
    open: false, slug: "", name: "",
  });
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);

  useEffect(() => {
    fetch("/api/honey")
      .then((r) => r.json())
      .then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function openModal(slug: string, name: string) {
    setModal({ open: true, slug, name });
    setSellers([]);
    setSellersLoading(true);
    fetch(`/api/honey/${slug}`)
      .then((r) => r.json())
      .then((d) => { setSellers(Array.isArray(d) ? d : []); setSellersLoading(false); })
      .catch(() => setSellersLoading(false));
  }

  function closeModal() {
    setModal({ open: false, slug: "", name: "" });
    setSellers([]);
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🍯 Honey & Bee Products</h1>
          <p className="text-amber-100 text-sm mt-1">
            Raw honey, beeswax, propolis and royal jelly — direct from India's beekeepers
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <button
                key={p.slug}
                onClick={() => openModal(p.slug, p.name)}
                className="bg-white rounded-2xl shadow hover:shadow-md transition-all text-left overflow-hidden group"
              >
                <div className="relative h-44 bg-amber-50 flex items-center justify-center">
                  {(p.image_url || HONEY_IMG[p.slug]) ? (
                    <Image src={p.image_url || HONEY_IMG[p.slug]} alt={p.name} fill className="object-cover"
                      sizes="(max-width:640px) 50vw, 33vw" />
                  ) : (
                    <span className="text-3xl text-amber-600">{HONEY_EMOJIS[p.slug] || "Honey"}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold bg-amber-600/80 px-2 py-0.5 rounded-full">
                    {p.seller_count} farmer{p.seller_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-amber-700">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-amber-600 font-bold text-sm">
                        Rs{Number(p.min_price).toLocaleString("en-IN")}
                      </span>
                      {p.min_price !== p.max_price && (
                        <span className="text-gray-400 text-xs"> - Rs{Number(p.max_price).toLocaleString("en-IN")}</span>
                      )}
                      <span className="text-gray-400 text-xs"> / {p.unit}</span>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Compare</span>
                  </div>
                </div>
              </button>
            ))}
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
                <p className="text-sm text-gray-500">{sellers.length} farmer{sellers.length !== 1 ? "s" : ""} selling</p>
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
                <div className="text-center py-8 text-gray-400">No sellers.</div>
              ) : sellers.map((s) => (
                <div key={s.id} className="border rounded-xl p-4 space-y-2 hover:border-amber-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {s.is_organic && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Organic</span>
                      )}
                      <p className="text-gray-700 text-sm mt-1 leading-snug">{s.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-amber-600 font-bold text-base">Rs{Number(s.price).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-gray-400">/ {s.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Stock: {s.stock} units</span>
                    {s.seller_district && (
                      <span>{s.seller_village || s.seller_district}, {s.seller_district}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.seller_name || "Farmer"}</p>
                      {s.seller_phone && <p className="text-xs text-gray-500">{s.seller_phone}</p>}
                    </div>
                    {s.seller_phone && (
                      <a href={`tel:${s.seller_phone}`}
                        className="bg-amber-500 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                        Call Farmer
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-1">
              <p className="text-xs text-center text-gray-400">All honey farmers verified by Jeevadhara admin team</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
