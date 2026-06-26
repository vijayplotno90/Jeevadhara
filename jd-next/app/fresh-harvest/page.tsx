import { query } from "../../lib/db";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  image_url: string | null;
  farm_district: string;
  category: string;
  farmer_name: string;
}

const IMAGE_MAP: Record<string, string> = {
  "sunflower microgreens": "/products/Fresh-Bunch-of-Sunflower-Microgreens-1.jpg",
  "country eggs": "/products/country eggs.jpg",
  "forest wild honey": "/products/forest wild honey.jpg",
  "green chillies": "/products/green chillies.jpg",
  "guntur dry red chilli": "/products/guntur dry red chilli.jpg",
  "organic brinjal": "/products/organic brinjal.jpg",
  "organic tomatoes": "/products/organic tomatoes.jpg",
  "oyster mushrooms": "/products/oyster mushrooms.jpg",
  "raw turmeric": "/products/raw turmeric.jpg",
  "red onions": "/products/red onions.jpg",
  "sona masoori rice": "/products/sona masoori rice.jpg",
  "toor dal": "/products/toor dal.jpg",
  "toor dal (pigeon pea)": "/products/toor dal.jpg",
};

function getImg(name: string, image_url: string | null): string {
  if (image_url) return image_url;
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (k.includes(key) || key.includes(k)) return val;
  }
  return "/products/organic tomatoes.jpg";
}

const CATS = ["All","Vegetables","Fruits","Grains","Pulses","Spices","Honey","Eggs","Mushrooms"];

export default async function FreshHarvestPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const cat = searchParams?.category || "All";
  const search = searchParams?.search || "";

  const params: unknown[] = [];
  let where = "WHERE p.is_active = TRUE";
  if (cat !== "All") {
    params.push(`%${cat.toLowerCase()}%`);
    where += ` AND LOWER(COALESCE(p.category,'')) LIKE $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    where += ` AND p.name ILIKE $${params.length}`;
  }

  let products: (Product & { resolved_image: string })[] = [];
  try {
    const rows = await query<Product>(
      `SELECT p.id, p.name,
              p.price       AS price_per_unit,
              p.unit,
              p.stock       AS available_qty,
              p.image_url,
              p.district    AS farm_district,
              p.category,
              u.name        AS farmer_name
       FROM products p
       JOIN users u ON u.id::text = p.farmer_id::text
       ${where}
       ORDER BY p.created_at DESC`,
      params
    );
    products = rows.map(p => ({
      ...p,
      price_per_unit: Number(p.price_per_unit),
      resolved_image: getImg(p.name, p.image_url),
    }));
  } catch (e) {
    console.error("Fresh Harvest query error:", e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🌿 Fresh Harvest</h1>
        <p className="text-gray-500 mt-1">Farm-to-doorstep produce from verified Telangana farmers</p>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2 mb-6">
        <input name="search" defaultValue={search} placeholder="Search vegetables, rice, honey..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        {cat !== "All" && <input type="hidden" name="category" value={cat} />}
        <button className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 font-medium">Search</button>
      </form>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATS.map(c => (
          <Link key={c} href={`/fresh-harvest?category=${c}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              cat === c ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{c}</Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {products.length} certified products available
      </p>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌾</p>
          <p className="text-lg">No products found</p>
          <Link href="/fresh-harvest" className="text-green-600 text-sm mt-2 inline-block">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={p.resolved_image} alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">✓ Certified</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{p.category}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {p.farm_district} · {p.farmer_name}</p>
                <p className="text-green-700 font-bold mt-2">
                  ₹{p.price_per_unit}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span>
                </p>
                <AddToCartButton product={{
                  id: p.id, name: p.name, image: p.resolved_image,
                  price: Number(p.price_per_unit), unit: p.unit,
                  farmer: p.farmer_name, district: p.farm_district
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold">🌾 Are you a farmer?</p>
        <p className="text-green-700 text-sm mt-1">List your produce and reach thousands of customers.</p>
        <Link href="/auth?role=farmer" className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Register as Farmer</Link>
      </div>
    </div>
  );
}
