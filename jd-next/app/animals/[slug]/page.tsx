import { query } from "../../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import InsuranceWidget from "./InsuranceWidget";

export const dynamic = "force-dynamic";

const CAT_EMOJI: Record<string, string> = {
  cattle: "🐄", buffalo: "🐃", poultry: "🐔", sheep: "🐑", fish: "🐟",
};

const BREED_INFO: Record<string, { about: string; uses: string[] }> = {
  "gir-cow": {
    about: "Gir cow is one of India's most prized indigenous dairy breeds, originating from Gujarat. Known for producing high-quality A2 beta-casein milk, which is easier to digest and preferred for health-conscious families.",
    uses: ["A2 milk production — 10–13L/day", "Organic bio-fertilizer from dung", "Biogas/gobar gas generation", "Organic farming — superior manure", "Gaushalas and cow sanctuaries"],
  },
  "murrah-buffalo": {
    about: "Murrah is the highest milk-producing buffalo breed in the world, originating from Haryana. Known for extremely high fat content (7–8%), making it ideal for paneer, ghee, and curd production.",
    uses: ["High-fat milk — 12–16L/day", "Paneer and ghee production", "Organic manure for farming", "Draft work for cultivation", "Biogas generation"],
  },
  "jersey-cross": {
    about: "Jersey × Sahiwal cross combines the high yield of Jersey with the heat tolerance and disease resistance of Sahiwal. A top choice for commercial dairy farmers across Telangana.",
    uses: ["Commercial milk production — 15–20L/day", "Hybrid vigor — disease resistant", "Low-cost feed conversion", "Ideal for small and medium dairy farms", "Organic manure"],
  },
  "kadaknath": {
    about: "Kadaknath is an indigenous poultry breed from Madhya Pradesh with unique black plumage, black skin, and black bones. The eggs are rich in protein (13g/egg vs 8g standard) and low in cholesterol — highly prized for medicinal properties.",
    uses: ["Protein-rich, low-cholesterol eggs", "80–110 eggs/year", "Medicinal and health food segment", "Premium organic egg farming", "Bio-pesticide from droppings for organic farms"],
  },
  "deccani-sheep": {
    about: "Deccani sheep is the native breed of Telangana and AP, known for its exceptional drought tolerance and adaptability to harsh Deccan plateau conditions. Low-maintenance and hardy — ideal for dry-land farmers.",
    uses: ["Wool production — 1.5–2kg/shear", "Rich organic manure for cultivation", "Bio-fertilizer for dry-land farming", "Low water and feed requirement", "Suitable for MGNREGS and small farmers"],
  },
  "rohu": {
    about: "Rohu (Labeo rohita) is the most popular freshwater fish for aquaculture in India. Fast-growing, high-demand, and thrives in pond systems. A single crop of 1,000 Rohu can yield ₹1.5–2L profit in 12 months.",
    uses: ["Freshwater pond aquaculture", "Carp polyculture systems", "Fingerling to market-size in 10–12 months", "High-protein food for local markets", "Fish pond water as organic fertilizer for crops"],
  },
};

interface SellerRow {
  id: string;
  breed: string;
  slug: string;
  category: string;
  age_years: number;
  age_months: number;
  color: string;
  body_weight_kg: number | null;
  milk_liters_per_day: number | null;
  lactation_number: number | null;
  last_calving_date: string | null;
  eggs_per_year: number | null;
  health_condition: string;
  vaccination_status: string;
  disease_history: string;
  is_vet_certified: boolean;
  vet_notes: string | null;
  vet_certified_date: string | null;
  price: number;
  unit: string;
  quantity_available: number;
  description: string | null;
  image_url: string | null;
  district: string | null;
  village: string | null;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  farmer_village: string;
  farmer_district: string;
}

export default async function LivestockDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  let sellers: SellerRow[] = [];

  try {
    sellers = await query<SellerRow>(
      `SELECT l.id, l.breed, l.slug, l.category,
         l.age_years, l.age_months, l.color, l.body_weight_kg,
         l.milk_liters_per_day, l.lactation_number, l.last_calving_date,
         l.eggs_per_year,
         l.health_condition, l.vaccination_status, l.disease_history,
         l.is_vet_certified, l.vet_notes, l.vet_certified_date,
         l.price, l.unit, l.quantity_available, l.description, l.image_url,
         l.district, l.village,
         u.id AS farmer_id, u.name AS farmer_name, u.phone AS farmer_phone,
         u.village AS farmer_village, u.district AS farmer_district
       FROM livestock l
       JOIN users u ON u.id::text = l.farmer_id::text
       WHERE l.slug = $1 AND l.is_active = TRUE
       ORDER BY l.is_vet_certified DESC, l.price ASC`,
      [slug]
    );
  } catch { /* show not found */ }

  if (sellers.length === 0) return notFound();

  const first = sellers[0];
  const info = BREED_INFO[slug];
  const minPrice = Math.min(...sellers.map(s => Number(s.price)));
  const maxPrice = Math.max(...sellers.map(s => Number(s.price)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/animals" className="text-sm text-green-700 hover:underline mb-4 inline-block">
        ← Back to Livestock Bazaar
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="relative h-64 sm:h-80 bg-gray-100">
          <img src={first.image_url || "/livestock/gir1.png"} alt={first.breed}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs uppercase tracking-wider opacity-80 capitalize">
              {CAT_EMOJI[first.category]} {first.category}
            </p>
            <h1 className="text-3xl font-bold">{first.breed}</h1>
            <p className="text-sm opacity-90 mt-1">
              {sellers.length} verified seller{sellers.length !== 1 ? "s" : ""} ·
              ₹{minPrice.toLocaleString()}
              {maxPrice > minPrice ? ` – ₹${maxPrice.toLocaleString()}` : ""}
              /{first.unit}
            </p>
          </div>
          {sellers.some(s => s.is_vet_certified) && (
            <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              🩺 Vet Certified Available
            </span>
          )}
        </div>

        {/* Breed info */}
        {info && (
          <div className="p-5 border-t border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-2">About {first.breed}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{info.about}</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {info.uses.map((u, i) => (
                <p key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-600 shrink-0">✓</span>{u}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sellers */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {first.category === "fish" ? "Available Fingerlings" : "Available Animals"} ({sellers.length} sellers)
      </h2>

      <div className="space-y-4 mb-8">
        {sellers.map((s, i) => (
          <div key={s.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              i === 0 ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"
            }`}>
            {/* Seller header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                  {s.farmer_name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.farmer_name}</p>
                  <p className="text-xs text-gray-500">📍 {s.farmer_village}, {s.farmer_district}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">₹{Number(s.price).toLocaleString()}</p>
                <p className="text-xs text-gray-400">per {s.unit}</p>
              </div>
            </div>

            <div className="p-5">
              {/* Description */}
              {s.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.description}</p>
              )}

              {/* Animal specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Age</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {s.age_years > 0 ? `${s.age_years}yr` : ""} {s.age_months > 0 ? `${s.age_months}mo` : ""}
                    {s.age_years === 0 && s.age_months === 0 ? "—" : ""}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Color</p>
                  <p className="font-semibold text-gray-800 text-sm">{s.color || "—"}</p>
                </div>
                {s.body_weight_kg && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Weight</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.body_weight_kg}kg</p>
                  </div>
                )}
                {s.milk_liters_per_day && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-amber-600 mb-0.5">🥛 Milk/Day</p>
                    <p className="font-bold text-amber-700 text-sm">{s.milk_liters_per_day}L</p>
                  </div>
                )}
                {s.lactation_number && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Lactation No.</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.lactation_number}</p>
                  </div>
                )}
                {s.eggs_per_year && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs text-orange-600 mb-0.5">🥚 Eggs/Year</p>
                    <p className="font-bold text-orange-700 text-sm">{s.eggs_per_year}</p>
                  </div>
                )}
                {s.quantity_available > 1 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Available</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.quantity_available} {s.unit}s</p>
                  </div>
                )}
              </div>

              {/* Health section */}
              <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">🏥 Health Record</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs">Condition</span>
                    <p className={`font-medium ${
                      s.health_condition === "Excellent" ? "text-green-600" :
                      s.health_condition === "Good" ? "text-blue-600" : "text-amber-600"
                    }`}>{s.health_condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Vaccination</span>
                    <p className="font-medium text-gray-700 text-xs mt-0.5">{s.vaccination_status}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Disease History</span>
                    <p className="font-medium text-gray-700 text-xs mt-0.5">{s.disease_history}</p>
                  </div>
                </div>
              </div>

              {/* Vet Certification */}
              {s.is_vet_certified ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-700 font-semibold text-sm">🩺 Jeevadhara Vet Certified</span>
                    {s.vet_certified_date && (
                      <span className="text-xs text-blue-500">
                        {new Date(s.vet_certified_date).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}
                      </span>
                    )}
                  </div>
                  {s.vet_notes && (
                    <p className="text-sm text-blue-700 italic">"{s.vet_notes}"</p>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-amber-700">⏳ Vet inspection pending — certification in progress</p>
                </div>
              )}

              {/* CTA */}
              <a href={`tel:${s.farmer_phone}`}
                className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                📞 Contact {s.farmer_name.split(" ")[0]} — {s.farmer_phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Insurance Widget */}
      <InsuranceWidget breed={first.breed} category={first.category} minPrice={minPrice} />

      {/* Footer nav */}
      <div className="mt-8 text-center">
        <Link href="/animals" className="text-green-700 text-sm hover:underline">
          ← View all livestock breeds
        </Link>
      </div>
    </div>
  );
}
