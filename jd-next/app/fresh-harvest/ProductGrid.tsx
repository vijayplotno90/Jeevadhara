"use client";
import { useState } from "react";

export interface GroupedProduct {
  name: string;
  category: string;
  min_price: number;
  max_price: number;
  total_stock: number;
  seller_count: number;
  has_organic: boolean;
  image_url: string | null;
  districts: string;
  unit: string;
  resolved_image: string;
}

interface Seller {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  is_organic: boolean;
  district: string;
  description: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  village: string;
  farmer_district: string;
}

interface CartItem {
  id: string; name: string; image: string; price: number; unit: string;
  farmer: string; district: string; farmer_id: string; stock: number; qty: number;
}

export default function ProductGrid({ products }: { products: GroupedProduct[] }) {
  const [selected,       setSelected]       = useState<GroupedProduct | null>(null);
  const [sellers,        setSellers]        = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [cartMsg,        setCartMsg]        = useState<string | null>(null);
  const [addedId,        setAddedId]        = useState<string | null>(null);

  async function openProduct(p: GroupedProduct) {
    setSelected(p);
    setSellers([]);
    setCartMsg(null);
    setLoadingSellers(true);
    try {
      const res = await fetch(`/api/products/sellers?name=${encodeURIComponent(p.name)}`);
      if (res.ok) setSellers(await res.json());
    } catch { /* ignore */ }
    setLoadingSellers(false);
  }

  function addToCart(seller: Seller) {
    if (seller.stock === 0) return;
    try {
      const raw  = localStorage.getItem("jd_cart") || "[]";
      const cart: CartItem[] = JSON.parse(raw);
      const existing = cart.find(i => i.id === seller.id);
      if (existing) {
        existing.qty = Math.min(existing.qty + 1, seller.stock);
      } else {
        cart.push({
          id: seller.id, name: seller.name,
          image: seller.image_url || selected?.resolved_image || "",
          price: Number(seller.price), unit: seller.unit,
          farmer: seller.farmer_name, district: seller.farmer_district,
          farmer_id: seller.farmer_id, stock: seller.stock, qty: 1,
        });
      }
      localStorage.setItem("jd_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      setAddedId(seller.id);
      setCartMsg(`✅ Added ${seller.farmer_name}'s ${seller.name} to cart!`);
      setTimeout(() => { setAddedId(null); setCartMsg(null); }, 2000);
    } catch (e) { console.error(e); }
  }

  return (
    <>
      {/* ── Product Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(p => (
          <button key={p.name} onClick={() => openProduct(p)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all text-left group focus:outline-none focus:ring-2 focus:ring-green-400">
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img src={p.resolved_image} alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { (e.target as HTMLImageElement).src = "/products/sona masoori rice.jpg"; }} />
              {p.has_organic && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  🌱 Organic
                </span>
              )}
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                ✓ Certified
              </span>
              {p.seller_count > 1 && (
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {p.seller_count} sellers
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{p.category}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">📍 {p.districts}</p>
              <div className="mt-2 flex items-end justify-between gap-1">
                <div>
                  <p className="text-green-700 font-bold text-base">
                    {p.seller_count > 1 ? "From " : ""}₹{Number(p.min_price).toFixed(0)}
                    <span className="text-xs text-gray-400 font-normal">/{p.unit || "kg"}</span>
                  </p>
                  {p.seller_count > 1 && Number(p.max_price) > Number(p.min_price) && (
                    <p className="text-xs text-gray-400">up to ₹{Number(p.max_price).toFixed(0)}</p>
                  )}
                </div>
                <span className="text-xs text-blue-600 font-medium whitespace-nowrap">View →</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Seller Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-gray-100 flex-shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={selected.resolved_image} alt={selected.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/products/sona masoori rice.jpg"; }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 text-lg leading-tight">{selected.name}</h2>
                <p className="text-sm text-gray-500 capitalize mt-0.5">
                  {selected.category} · {selected.seller_count} verified seller{selected.seller_count !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">📍 {selected.districts}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-3xl leading-none w-8 h-8 flex items-center justify-center flex-shrink-0">
                ×
              </button>
            </div>

            {/* Sort note */}
            <div className="px-5 pt-3 pb-1 flex-shrink-0">
              <p className="text-xs text-gray-400">🏆 Sorted by best deal (lowest price first)</p>
            </div>

            {/* Cart toast */}
            {cartMsg && (
              <div className="mx-5 mt-2 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2 rounded-lg flex-shrink-0">
                {cartMsg}
              </div>
            )}

            {/* Sellers */}
            <div className="overflow-y-auto flex-1 px-5 pb-5 pt-2 space-y-3">
              {loadingSellers ? (
                <div className="text-center py-10 text-gray-400">
                  <div className="text-4xl mb-3">🌾</div>
                  <p className="text-sm">Loading sellers...</p>
                </div>
              ) : sellers.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p>No sellers available right now.</p>
                </div>
              ) : sellers.map((s, i) => (
                <div key={s.id}
                  className={`border rounded-xl p-4 transition-colors ${
                    i === 0
                      ? "border-green-300 bg-green-50"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Grade + Best Deal badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          s.is_organic
                            ? "bg-green-500 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {s.is_organic ? "🌱 Grade A · Organic" : "⭐ Grade B · Standard"}
                        </span>
                        {i === 0 && (
                          <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                            🏆 Best Deal
                          </span>
                        )}
                      </div>

                      {/* Farmer */}
                      <p className="font-semibold text-gray-800 text-sm">{s.farmer_name}</p>
                      <p className="text-xs text-gray-500">
                        📍 {s.village ? `${s.village}, ` : ""}{s.farmer_district}
                        {s.farmer_phone && (
                          <> · <a href={`tel:${s.farmer_phone}`}
                            onClick={e => e.stopPropagation()}
                            className="text-blue-600 hover:underline">📞 {s.farmer_phone}</a></>
                        )}
                      </p>

                      {/* Description */}
                      {s.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{s.description}</p>
                      )}

                      {/* Stock */}
                      <p className="text-xs mt-1.5">
                        {s.stock === 0
                          ? <span className="text-red-500 font-medium">Out of stock</span>
                          : s.stock <= 5
                          ? <span className="text-amber-600 font-medium">⚠️ Only {s.stock} {s.unit} left</span>
                          : <span className="text-gray-400">{s.stock} {s.unit} available</span>
                        }
                      </p>
                    </div>

                    {/* Price + CTA */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-green-700">₹{Number(s.price).toFixed(0)}</p>
                      <p className="text-xs text-gray-400 mb-2">per {s.unit}</p>
                      <button
                        disabled={s.stock === 0}
                        onClick={() => addToCart(s)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          addedId === s.id
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : s.stock === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                        }`}>
                        {addedId === s.id ? "✓ Added!" : s.stock === 0 ? "Sold Out" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0 rounded-b-2xl">
              <p className="text-xs text-gray-400 text-center">
                All sellers verified by Jeevadhara team · Farm-to-door delivery · No middlemen
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
