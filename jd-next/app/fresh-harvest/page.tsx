import { query } from "../../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  is_organic: boolean;
  farm_name: string;
  farm_district: string;
  jeevadhara_certified: boolean;
  farmer_name: string;
  farmer_phone: string;
  category_name: string;
  images: string[] | null;
}

// Map product names to local images
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

function getProductImage(product: Product): string {
  // Check S3/stored images first
  if (product.images && product.images.length > 0) return product.images[0];
  // Fallback to name-based local mapping
  const key = product.name.toLowerCase().trim();
  for (const [k, v] of Object.entries(IMAGE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "/products/organic tomatoes.jpg"; // default
}

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Pulses", "Spices", "Honey", "Eggs", "Mushrooms"];

export default async function FreshHarvestPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const cat = searchParams.category || "All";
  const search = searchParams.search || "";

  let sql = `
    SELECT p.id, p.name, p.name_telugu, p.price_per_unit, p.unit, p.available_qty, p.is_organic,
           p.images,
           f.farm_name, f.district AS farm_district, f.jeevadhara_certified,
           u.name AS farmer_name, u.phone AS farmer_phone,
           COALESCE(c.name, 'Other') AS category_name
    FROM products p
    JOIN farms f ON f.id = p.farm_id
    JOIN users u ON u.id = p.farmer_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = TRUE
  `;
  const params: string[] = [];

  if (cat !== "All") {
    params.push(cat);
    sql += ` AND LOWER(COALESCE(c.name,'Other')) = LOWER($${params.length})`;
  }
  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (p.name ILIKE $${params.length} OR p.name_telugu ILIKE $${params.length} OR f.district ILIKE $${params.length})`;
  }
  sql += ` ORDER BY f.jeevadhara_certified DESC, p.created_at DESC`;

  let products: Product[] = [];
  try {
    products = await query<Product>(sql, params);
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🌿 Fresh Harvest</h1>
        <p className="text-gray-500 mt-1">Farm-fresh produce, direct from Telangana farmers</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2" method="GET">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search vegetables, rice, honey..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {cat !== "All" && <input type="hidden" name="category" value={cat} />}
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700">Search</button>
        </form>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/fresh-harvest?category=${c}${search ? `&search=${search}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              cat === c
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-500 hover:text-green-600"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
        <span>{products.length} products found</span>
        {products.filter((p) => p.is_organic).length > 0 && (
          <span className="text-green-600">
            🌱 {products.filter((p) => p.is_organic).length} organic
          </span>
        )}
        {products.filter((p) => p.jeevadhara_certified).length > 0 && (
          <span className="text-blue-600">
            ✓ {products.filter((p) => p.jeevadhara_certified).length} Jeevadhara certified
          </span>
        )}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🌾</p>
          <p className="text-lg">No products found</p>
          <Link href="/fresh-harvest" className="text-green-600 text-sm mt-2 inline-block">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => {
            const img = getProductImage(p);
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/products/organic tomatoes.jpg";
                    }}
                  />
                  {p.is_organic && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      🌱 Organic
                    </span>
                  )}
                  {p.jeevadhara_certified && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      ✓ Certified
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</h3>
                  {p.name_telugu && (
                    <p className="text-xs text-gray-400 mt-0.5">{p.name_telugu}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {p.farm_district} · {p.farmer_name}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-green-700 font-bold text-base">
                        ₹{Number(p.price_per_unit).toFixed(0)}
                      </span>
                      <span className="text-gray-400 text-xs">/{p.unit}</span>
                    </div>
                    {p.available_qty && (
                      <span className="text-xs text-gray-400">{p.available_qty} {p.unit} avail.</span>
                    )}
                  </div>

                  <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA for farmers */}
      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold">🌾 Are you a farmer?</p>
        <p className="text-green-700 text-sm mt-1">List your fresh produce and reach thousands of customers directly.</p>
        <Link
          href="/auth?role=farmer"
          className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Register as Farmer
        </Link>
      </div>
    </div>
  );
}
