import { query } from "../../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CATS = [
  { value: "all",     label: "All Livestock" },
  { value: "cattle",  label: "🐄 Cattle" },
  { value: "buffalo", label: "🐃 Buffalo" },
  { value: "poultry", label: "🐔 Poultry" },
  { value: "sheep",   label: "🐑 Sheep" },
  { value: "fish",    label: "🐟 Fish Seeds" },
];

const CAT_IMG: Record<string, string> = {
  cattle:  "/livestock/gir1.png",
  buffalo: "/livestock/murrah.png",
  poultry: "/livestock/Kadaknath.webp",
  sheep:   "/livestock/Deccani-Sheep.webp",
  fish:    "/livestock/Rohu.webp",
  goat:    "/livestock/gir1.png",
};

const CAT_COLOR: Record<string, string> = {
  cattle:  "bg-amber-100 text-amber-800",
  buffalo: "bg-slate-100 text-slate-700",
  poultry: "bg-orange-100 text-orange-700",
  sheep:   "bg-emerald-100 text-emerald-700",
  fish:    "bg-blue-100 text-blue-700",
};

interface BreedRow {
  slug: string;
  breed: string;
  category: string;
  image_url: string | null;
  seller_count: number;
  min_price: number;
  max_price: number;
  unit: string | null;
  max_milk_liters: number | null;
  max_eggs_per_year: number | null;
  has_vet_certified: boolean;
  districts: string | null;
}

export default async function AnimalsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const cat = searchParams?.category || "all";
  let breeds: BreedRow[] = [];
  let dbError: string | null = null;

  try {
    const params: unknown[] = [];
    let where = "WHERE l.is_active = TRUE";
    if (cat !== "all") {
      params.push(cat);
      where += ` AND l.category = $${params.length}`;
    }
    breeds = await query<BreedRow>(
      `SELECT
         l.slug, l.breed, l.category,
         MIN(l.image_url) AS image_url,
         COUNT(*)::int AS seller_count,
         MIN(l.price) AS min_price,
         MAX(l.price) AS max_price,
         MIN(l.unit) AS unit,
         MAX(l.milk_liters_per_day) AS max_milk_liters,
         MAX(l.eggs_per_year) AS max_eggs_per_year,
         BOOL_OR(l.is_vet_certified) AS has_vet_certified,
         STRING_AGG(DISTINCT l.district, ', ') AS districts
       FROM livestock l
       ${where}
       GROUP BY l.slug, l.breed, l.category
       ORDER BY seller_count DESC, l.breed ASC`,
      params
    );
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">🐄 Livestock Bazaar</h1>
          <p className="text-amber-100 mt-1">Verified breeds · Vet-certified · Buy direct from Telangana farmers · Fish Seeds for pond stocking</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATS.map(c => (
          <Link key={c.value} href={`/animals?category=${c.value}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              cat === c.value
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{c.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap mb-6">
        {["🩺 Vet-Certified","📋 Full Health Records","🏦 Insurance Available","🤝 Farmer-to-Farmer Direct"].map(b => (
          <span key={b} className="text-xs bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded-full font-medium">{b}</span>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {breeds.length} breed{breeds.length !== 1 ? "s" : ""} available · Click to view sellers &amp; health records
      </p>

      {dbError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-lg font-mono break-all">
          DB Error: {dbError}
        </div>
      )}

      {breeds.length === 0 && !dbError ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🐄</p>
          <p>No livestock listed in this category yet.</p>
          <Link href="/animals" className="text-green-600 text-sm mt-2 inline-block">View all</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {breeds.map(b => (
            <Link key={b.slug} href={`/animals/${b.slug}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img src={b.image_url || CAT_IMG[b.category] || "/livestock/gir1.png"} alt={b.breed}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {b.has_vet_certified && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    🩺 Vet Certified
                  </span>
                )}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CAT_COLOR[b.category] || "bg-gray-100 text-gray-700"}`}>
                  {b.category}
                </span>
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {b.seller_count} seller{b.seller_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{b.breed}</h3>
                {b.districts && <p className="text-xs text-gray-500 mt-0.5 truncate">📍 {b.districts}</p>}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {(b.category === "cattle" || b.category === "buffalo") && b.max_milk_liters && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      🥛 Up to {Number(b.max_milk_liters).toFixed(1)}L/day
                    </span>
                  )}
                  {b.category === "poultry" && b.max_eggs_per_year && (
                    <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                      🥚 {b.max_eggs_per_year} eggs/year
                    </span>
                  )}
                  {b.category === "sheep" && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      🌿 Wool + Bio-Fertilizer
                    </span>
                  )}
                  {b.category === "fish" && (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      🐟 Fingerlings — stock your pond
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-green-700 font-bold text-xl">
                      ₹{Number(b.min_price).toLocaleString()}
                      {Number(b.max_price) > Number(b.min_price) && (
                        <span className="text-sm font-normal text-gray-400"> – ₹{Number(b.max_price).toLocaleString()}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">per {b.unit || "head"}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium group-hover:underline">View sellers →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      </div>{/* end max-w wrapper */}
      <div className="bg-amber-50 border-t border-amber-200 px-4 py-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-amber-900 font-semibold text-lg">🐄 Do you have livestock to sell?</p>
        <p className="text-amber-700 text-sm mt-1">List your animals, get vet certified, and reach thousands of verified buyers.</p>
        <Link href="/auth?role=farmer"
          className="inline-block mt-3 bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600">
          Register as Farmer
          </Link>
      </div>
      </div>
    </div>
  );
}
