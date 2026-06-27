import { query } from "../../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinanceWidget from "./FinanceWidget";

export const dynamic = "force-dynamic";

const TYPE_EMOJI: Record<string, string> = {
  tractor: "🚜", commercial: "🚛", construction: "🏗️",
};

const VEHICLE_INFO: Record<string, { about: string; highlights: string[] }> = {
  "mahindra-575-di": {
    about: "Mahindra 575 DI is India's best-selling tractor — trusted by millions of farmers across Telangana for paddy, cotton, turmeric, and vegetable cultivation. Robust 47HP engine with excellent torque at low RPM.",
    highlights: ["47HP 3-cylinder water-cooled diesel","2WD with optional 4WD","Power steering standard","1400 kg hydraulic lift capacity","Compatible with rotavator, plough, cultivator, trailer"],
  },
  "sonalika-745-di": {
    about: "Sonalika 745 DI is one of the most popular 50HP tractors in Telangana — known for heavy-duty performance in wet paddy fields and upland cotton farms. Strong hydraulics and fuel efficiency are its key strengths.",
    highlights: ["50HP 3-cylinder turbocharged diesel","2WD, dual clutch","Heavy-duty hydraulics — 1600 kg lift","Air-cleaner with pre-cleaner for dusty conditions","Ideal for paddy transplanting, rotary tilling, and cane harvesting"],
  },
  "new-holland-3630": {
    about: "New Holland 3630 TX Special is a premium 55HP tractor renowned for all-crop versatility. Widely used for paddy, sugarcane, and horticultural crops in Telangana. Dealer warranty and CNH finance available.",
    highlights: ["55HP 3-cylinder turbo-charged engine","8F + 2R synchromesh gearbox","1800 kg hydraulic lift capacity","PTO 540/1000 RPM dual speed","4WD available — better traction in wet fields"],
  },
  "ashok-leyland-dost": {
    about: "Ashok Leyland Dost is the most popular small commercial vehicle (SCV) for farm produce transport in Telangana. 1.25 ton payload, rugged build, and low maintenance cost make it the first choice for vegetable and grain transport.",
    highlights: ["1.25 ton payload capacity","70HP diesel BS6 engine","FC valid multi-year","Multi-utility — vegetables, grains, inputs, dairy","Low cost of ownership vs 4-tyre trucks"],
  },
  "ashok-leyland-bada-dost": {
    about: "Ashok Leyland Bada Dost i3/i4 is the upgraded version with 1.5 ton payload and more powerful engine. Preferred by FPOs and agri-input distributors for reliable last-mile and inter-district transport.",
    highlights: ["1.5 ton payload — 20% more than Dost","85HP turbocharged diesel","Wider cargo body — fits more crates","Available in flat deck and side-open body","GPS and BS6 compliant in newer variants"],
  },
  "ashok-leyland-boss": {
    about: "Ashok Leyland Boss Series is a heavy commercial truck designed for bulk agricultural commodity transport. Used by rice millers, FCI depots, and large agri traders for inter-state and inter-district movement.",
    highlights: ["16 to 25 ton GVW depending on variant","160–230HP turbocharged engine","5-year manufacturer warranty","BS6 compliant — clean fuel economy","Suitable for FCI rice transport, fertilizer fleets"],
  },
  "ashok-leyland-partner": {
    about: "Ashok Leyland Partner 4 Tyre is a compact mini-truck ideal for village-to-mandi produce transport. Its small turning radius and 4-tyre design make it perfect for narrow village roads.",
    highlights: ["1.5 ton payload, 4-tyre mini truck","90HP BS6 diesel engine","Excellent ground clearance for village roads","Low tare weight — more payload efficiency","Wide service network across Telangana"],
  },
  "jcb-3dx": {
    about: "JCB 3DX is the most widely used backhoe loader in rural Telangana for farm pond construction, land leveling, bund making, and irrigation canal work. 74HP engine with world-class hydraulics.",
    highlights: ["74HP turbocharged engine","Backhoe digging depth: 4.7m","Loader bucket capacity: 1.0 m³","Ideal for PMKSY farm ponds and MGNREGS bunding","Wide dealer service network across Telangana"],
  },
  "jcb-4dx": {
    about: "JCB 4DX is the next generation backhoe loader with 4-wheel drive and 4-wheel steering — offering superior maneuverability on farm sites. 92HP engine with greater digging reach than 3DX. Preferred for large earthwork projects.",
    highlights: ["92HP engine — 24% more power than 3DX","4WD + 4-wheel steering — full site agility","Backhoe digging depth: 5.97m (30% deeper)","GPS telematics fitted in new models","JCB SmartPlus hydraulics — faster cycle time"],
  },
};

interface SellerRow {
  id: string;
  name: string;
  slug: string;
  vehicle_type: string;
  condition: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  engine_hp: number | null;
  hours_used: number | null;
  km_driven: number | null;
  fuel_type: string | null;
  color: string | null;
  description: string | null;
  image_url: string | null;
  price: number;
  is_negotiable: boolean;
  district: string | null;
  village: string | null;
  seller_name: string;
  seller_phone: string;
  seller_village: string;
  seller_district: string;
}

export default async function VehicleDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { condition?: string };
}) {
  const { slug } = params;
  const cond = searchParams?.condition || "";
  let sellers: SellerRow[] = [];

  try {
    const qparams: unknown[] = [slug];
    let condWhere = "";
    if (cond && cond !== "all") {
      qparams.push(cond);
      condWhere = ` AND v.condition = $${qparams.length}`;
    }

    sellers = await query<SellerRow>(
      `SELECT
         v.id, v.name, v.slug, v.vehicle_type, v.condition,
         v.brand, v.model, v.year,
         v.engine_hp, v.hours_used, v.km_driven, v.fuel_type, v.color,
         v.description, v.image_url, v.price, v.is_negotiable,
         v.district, v.village,
         u.name   AS seller_name,
         u.phone  AS seller_phone,
         u.village AS seller_village,
         u.district AS seller_district
       FROM vehicles v
       JOIN users u ON u.id::text = v.seller_id::text
       WHERE v.slug = $1 AND v.is_active = TRUE${condWhere}
       ORDER BY v.price ASC`,
      qparams
    );
  } catch { /* fall through to notFound */ }

  if (sellers.length === 0) return notFound();

  const first = sellers[0];
  const info = VEHICLE_INFO[slug];
  const minPrice = Math.min(...sellers.map(s => Number(s.price)));
  const maxPrice = Math.max(...sellers.map(s => Number(s.price)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/vehicles" className="text-sm text-green-700 hover:underline mb-4 inline-block">
        ← Back to Vehicle Bazaar
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="relative h-64 sm:h-80 bg-gray-100">
          <img src={first.image_url || "/vehicles/Mahindra_575_DI_2021.jpg"} alt={first.name}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs uppercase tracking-wider opacity-80">
              {TYPE_EMOJI[first.vehicle_type]} {first.vehicle_type}
            </p>
            <h1 className="text-3xl font-bold">{first.name}</h1>
            <p className="text-sm opacity-90 mt-1">
              {sellers.length} seller{sellers.length !== 1 ? "s" : ""} ·
              ₹{minPrice.toLocaleString()}
              {maxPrice > minPrice ? ` – ₹${maxPrice.toLocaleString()}` : ""}
            </p>
          </div>
          <span className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold capitalize ${
            first.condition === "new" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
          }`}>{first.condition}</span>
        </div>

        {/* About */}
        {info && (
          <div className="p-5 border-t border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-2">About {first.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{info.about}</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {info.highlights.map((h, i) => (
                <p key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-600 shrink-0">✓</span>{h}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sellers */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Available Listings ({sellers.length} seller{sellers.length !== 1 ? "s" : ""})
      </h2>

      <div className="space-y-4 mb-8">
        {sellers.map((s, i) => (
          <div key={s.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              i === 0 ? "border-green-200 ring-1 ring-green-100" : "border-gray-100"
            }`}>
            {/* Seller header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                  {s.seller_name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.seller_name}</p>
                  <p className="text-xs text-gray-500">📍 {s.seller_village}, {s.seller_district}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">₹{Number(s.price).toLocaleString()}</p>
                {s.is_negotiable && <p className="text-xs text-amber-600 font-medium">Negotiable</p>}
              </div>
            </div>

            <div className="p-5">
              {s.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.description}</p>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {s.year && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Year</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.year}</p>
                  </div>
                )}
                {s.engine_hp && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 mb-0.5">⚡ Engine</p>
                    <p className="font-bold text-green-700 text-sm">{s.engine_hp} HP</p>
                  </div>
                )}
                {s.hours_used != null && s.hours_used > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-amber-600 mb-0.5">⏱ Hours Used</p>
                    <p className="font-bold text-amber-700 text-sm">{s.hours_used.toLocaleString()} hrs</p>
                  </div>
                )}
                {s.km_driven != null && s.km_driven > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 mb-0.5">🛣️ KM Driven</p>
                    <p className="font-bold text-blue-700 text-sm">{s.km_driven.toLocaleString()} km</p>
                  </div>
                )}
                {s.color && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Color</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.color}</p>
                  </div>
                )}
                {s.fuel_type && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Fuel</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.fuel_type}</p>
                  </div>
                )}
                <div className={`rounded-lg p-3 ${s.condition === "new" ? "bg-green-50" : "bg-amber-50"}`}>
                  <p className="text-xs text-gray-400 mb-0.5">Condition</p>
                  <p className={`font-semibold text-sm capitalize ${s.condition === "new" ? "text-green-700" : "text-amber-700"}`}>
                    {s.condition}
                  </p>
                </div>
                {s.model && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Variant</p>
                    <p className="font-semibold text-gray-800 text-sm truncate">{s.model}</p>
                  </div>
                )}
              </div>

              {/* Contact CTA */}
              <a href={`tel:${s.seller_phone}`}
                className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                📞 Contact {s.seller_name.split(" ")[0]} — {s.seller_phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Finance Widget */}
      <FinanceWidget vehicleName={first.name} vehicleType={first.vehicle_type} minPrice={minPrice} />

      {/* Footer nav */}
      <div className="mt-8 text-center">
        <Link href="/vehicles" className="text-green-700 text-sm hover:underline">
          ← View all vehicles
        </Link>
      </div>
    </div>
  );
}
