import { query } from "../../lib/db";
import Link from "next/link";
import ProductGrid, { GroupedProduct } from "./ProductGrid";

export const dynamic = "force-dynamic";

const IMAGE_MAP: Record<string, string> = {
  // Rice & Grains
  "sona masoori rice":     "/products/sona masoori rice.jpg",
  "bpt rice":              "/products/bpt rice.jpg",
  "jowar":                 "/products/jowar.jpg",
  "black sesame":          "/products/black sesame.jpg",
  "groundnuts":            "/products/groundnuts.jpg",
  // Pulses
  "toor dal":              "/products/toor dal.jpg",
  "toor dal (pigeon pea)": "/products/toor dal.jpg",
  "chana dal":             "/products/chana dal.jpg",
  "moong dal":             "/products/moong dal.jpg",
  "urad dal":              "/products/urad dal.webp",
  // Vegetables
  "organic tomatoes":      "/products/organic tomatoes.jpg",
  "organic brinjal":       "/products/organic brinjal.jpg",
  "red onions":            "/products/red onions.jpg",
  "green chillies":        "/products/green chillies.jpg",
  "moringa leaves":        "/products/moringa leaves.webp",
  "bottle gourd":          "/products/bottle gourd.jpg",
  "sunflower microgreens": "/products/Fresh-Bunch-of-Sunflower-Microgreens-1.jpg",
  // Spices
  "guntur red chilli":     "/products/guntur dry red chilli.jpg",
  "guntur dry red chilli": "/products/guntur dry red chilli.jpg",
  "dry red chilli":        "/products/guntur dry red chilli.jpg",
  "red chilli":            "/products/guntur dry red chilli.jpg",
  "raw turmeric":          "/products/raw turmeric.jpg",
  // Others
  "forest wild honey":     "/products/forest wild honey.jpg",
  "country eggs":          "/products/country eggs.jpg",
  "oyster mushrooms":      "/products/oyster mushrooms.jpg",
};

function getImg(name: string, image_url: string | null): string {
  if (image_url) return image_url;
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (k.includes(key) || key.includes(k)) return val;
  }
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (k.split(" ").some(word => word.length > 3 && key.includes(word))) return val;
  }
  return "/products/sona masoori rice.jpg";
}

const CATS = ["All","Vegetables","Fruits","Grains","Pulses","Spices","Honey","Eggs","Mushrooms"];

interface RawGroup {
  name: string;
  category: string | null;
  min_price: number;
  max_price: number;
  total_stock: number;
  seller_count: number;
  has_organic: boolean;
  image_url: string | null;
  districts: string | null;
  unit: string | null;
}

export default async function FreshHarvestPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const cat    = searchParams?.category || "All";
  const search = searchParams?.search   || "";

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

  let products: GroupedProduct[] = [];
  let dbError: string | null = null;
  try {
    const rows = await query<RawGroup>(
      `SELECT
         MIN(p.name)                              AS name,
         MIN(p.category)                          AS category,
         MIN(p.price)                             AS min_price,
         MAX(p.price)                             AS max_price,
         SUM(p.stock)::int                        AS total_stock,
         COUNT(*)::int                            AS seller_count,
         BOOL_OR(COALESCE(p.is_organic, FALSE))   AS has_organic,
         MIN(p.image_url)                         AS image_url,
         STRING_AGG(DISTINCT p.district, ', ')    AS districts,
         MIN(p.unit)                              AS unit
       FROM products p
       ${where}
       GROUP BY LOWER(p.name)
       ORDER BY COUNT(*) DESC, MIN(p.price) ASC`,
      params
    );

    products = rows.map(r => ({
      ...r,
      min_price:      Number(r.min_price),
      max_price:      Number(r.max_price),
      resolved_image: getImg(r.name, r.image_url),
    }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Fresh Harvest query error:", msg);
    dbError = msg;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🌿 Fresh Harvest</h1>
        <p className="text-gray-500 mt-1">Farm-to-doorstep produce · Click any product to compare sellers &amp; prices</p>
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
          <Link key={c}
            href={`/fresh-harvest?category=${c}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              cat === c
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{c}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {products.length} unique products · click to see all sellers &amp; compare prices
      </p>

      {dbError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-lg font-mono break-all">
          DB Error: {dbError}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🌾</p>
          <p className="text-lg">No products found</p>
          <Link href="/fresh-harvest" className="text-green-600 text-sm mt-2 inline-block">Clear filters</Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold">🌾 Are you a farmer?</p>
        <p className="text-green-700 text-sm mt-1">List your produce and reach thousands of customers.</p>
        <Link href="/auth?role=farmer"
          className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          Register as Farmer
        </Link>
      </div>
    </div>
  );
}
