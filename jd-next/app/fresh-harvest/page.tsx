import { query } from "../../lib/db";
import Link from "next/link";
import FreshHarvestClient from "./FreshHarvestClient";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  price_per_unit: number;
  unit: string;
  available_qty: number;
  is_organic: boolean;
  farm_district: string;
  jeevadhara_certified: boolean;
  farmer_name: string;
  images: string[] | null;
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

function getProductImage(name: string, images: string[] | null): string {
  if (images && images.length > 0) return images[0];
  const k = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (k.includes(key) || key.includes(k)) return val;
  }
  return "/products/organic tomatoes.jpg";
}

const CATEGORIES = ["All","Vegetables","Fruits","Grains","Pulses","Spices","Honey","Eggs","Mushrooms"];

export default async function FreshHarvestPage({ searchParams }: { searchParams: { category?: string; search?: string } }) {
  const cat = searchParams.category || "All";
  const search = searchParams.search || "";

  let sql = `
    SELECT p.id, p.name, p.name_telugu, p.price_per_unit, p.unit, p.available_qty,
           p.is_organic, p.images, f.district AS farm_district, f.jeevadhara_certified,
           u.name AS farmer_name
    FROM products p JOIN farms f ON f.id = p.farm_id JOIN users u ON u.id = p.farmer_id
    LEFT JOIN categories c ON c.id = p.category_id WHERE p.is_active = TRUE
  `;
  const params: string[] = [];
  if (cat !== "All") { params.push(cat); sql += ` AND LOWER(COALESCE(c.name,'Other')) = LOWER($${params.length})`; }
  if (search) { params.push(`%${search}%`); sql += ` AND p.name ILIKE $${params.length}`; }
  sql += " ORDER BY f.jeevadhara_certified DESC, p.created_at DESC";

  let products: Product[] = [];
  try { products = await query<Product>(sql, params); } catch (e) { console.error(e); }

  const productsWithImages = products.map(p => ({
    ...p,
    price_per_unit: Number(p.price_per_unit),
    resolved_image: getProductImage(String(p.name), p.images),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🌿 Fresh Harvest</h1>
        <p className="text-gray-500 mt-1">Farm-fresh produce, direct from Telangana farmers</p>
      </div>
      <form className="flex gap-2 mb-6" method="GET">
        <input name="search" defaultValue={search} placeholder="Search vegetables, rice, honey..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        {cat !== "All" && <input type="hidden" name="category" value={cat} />}
        <button className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700">Search</button>
      </form>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map(c => (
          <Link key={c} href={`/fresh-harvest?category=${c}${search ? `&search=${search}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              cat === c ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{c}</Link>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-5">{productsWithImages.length} products {productsWithImages.filter(p=>p.is_organic).length > 0 && `· 🌱 ${productsWithImages.filter(p=>p.is_organic).length} organic`}</p>
      {productsWithImages.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🌾</p><p>No products found</p>
          <Link href="/fresh-harvest" className="text-green-600 text-sm mt-2 inline-block">Clear filters</Link>
        </div>
      ) : (
        <FreshHarvestClient products={productsWithImages} />
      )}
      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-semibold">🌾 Are you a farmer?</p>
        <p className="text-green-700 text-sm mt-1">List your produce and reach thousands of customers.</p>
        <Link href="/auth?role=farmer" className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Register as Farmer</Link>
      </div>
    </div>
  );
}
