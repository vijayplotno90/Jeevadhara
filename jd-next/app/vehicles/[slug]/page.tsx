import { query } from "../../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import FinanceWidget from "./FinanceWidget";
import DealerCTAButtons from "./DealerCTAButtons";

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
    about: "Sonalika 745 DI is one of the most popular 50HP tractors in Telangana — known for heavy-duty performance in wet paddy fields and upland cotton farms. Strong hydraulics and fuel efficiency are key strengths.",
    highlights: ["50HP 3-cylinder turbocharged diesel","2WD, dual clutch","Heavy-duty hydraulics — 1600 kg lift","Air-cleaner with pre-cleaner for dusty fields","Ideal for paddy transplanting, rotary tilling, cane harvesting"],
  },
  "new-holland-3630": {
    about: "New Holland 3630 TX Special is a premium 55HP tractor renowned for all-crop versatility. Widely used for paddy, sugarcane, and horticultural crops in Telangana. Dealer warranty and CNH finance available.",
    highlights: ["55HP 3-cylinder turbo-charged engine","8F + 2R synchromesh gearbox","1800 kg hydraulic lift capacity","PTO 540/1000 RPM dual speed","4WD available — better traction in wet fields"],
  },
  "ashok-leyland-dost": {
    about: "Ashok Leyland Dost is the most popular small commercial vehicle for farm produce transport in Telangana. 1.25 ton payload, rugged build, and low maintenance cost make it ideal for vegetable and grain transport.",
    highlights: ["1.25 ton payload capacity","70HP diesel BS6 engine","FC valid multi-year","Multi-utility — vegetables, grains, inputs, dairy","Low cost of ownership vs 4-tyre trucks"],
  },
  "ashok-leyland-bada-dost": {
    about: "Ashok Leyland Bada Dost i3/i4 is the upgraded version with 1.5 ton payload and more powerful engine. Preferred by FPOs and agri-input distributors for reliable last-mile and inter-district transport.",
    highlights: ["1.5 ton payload — 20% more than Dost","85HP turbocharged diesel","Wider cargo body — fits more crates","Available in flat deck and side-open body","GPS and BS6 compliant in newer variants"],
  },
  "ashok-leyland-boss": {
    about: "Ashok Leyland Boss Series is a heavy commercial truck for bulk agricultural commodity transport. Used by rice millers, FCI depots, and large agri traders for inter-state movement.",
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
    about: "JCB 4DX is the next generation backhoe loader with 4-wheel drive and 4-wheel steering. 92HP engine with greater digging reach than 3DX. Preferred for large earthwork projects.",
    highlights: ["92HP engine — 24% more power than 3DX","4WD + 4-wheel steering — full site agility","Backhoe digging depth: 5.97m","GPS telematics fitted in new models","JCB SmartPlus hydraulics — faster cycle time"],
  },
};

// ─── USED vehicle seller row (joins users table) ───────────────
interface UsedSellerRow {
  id: string; name: string; slug: string; vehicle_type: string; condition: string;
  brand: string | null; model: string | null; year: number | null;
  engine_hp: number | null; hours_used: number | null; km_driven: number | null;
  fuel_type: string | null; color: string | null; description: string | null;
  image_url: string | null; price: number; is_negotiable: boolean;
  district: string | null; village: string | null;
  seller_name: string; seller_phone: string;
  seller_village: string; seller_district: string;
}

// ─── NEW vehicle dealer row ────────────────────────────────────
interface NewDealerRow {
  id: string; name: string; slug: string; vehicle_type: string;
  brand: string | null; model: string | null; year: number | null;
  engine_hp: number | null; fuel_type: string | null; description: string | null;
  image_url: string | null; price: number;
  on_road_price: number | null; colors_available: string | null;
  warranty_years: number | null;
  dealer_name: string | null; dealer_city: string | null;
  dealer_showroom: string | null; dealer_phone: string | null;
}

export default async function VehicleDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { condition?: string };
}) {
  const { slug } = params;
  const cond = searchParams?.condition || "used";
  const info = VEHICLE_INFO[slug];

  // ── NEW vehicle path ───────────────────────────────────────
  if (cond === "new") {
    let dealers: NewDealerRow[] = [];
    try {
      dealers = await query<NewDealerRow>(
        `SELECT v.id, v.name, v.slug, v.vehicle_type,
           v.brand, v.model, v.year, v.engine_hp, v.fuel_type,
           v.description, v.image_url, v.price,
           v.on_road_price, v.colors_available, v.warranty_years,
           v.dealer_name, v.dealer_city, v.dealer_showroom, v.dealer_phone
         FROM vehicles v
         WHERE v.slug = $1 AND v.condition = 'new' AND v.is_active = TRUE
         ORDER BY v.price ASC`,
        [slug]
      );
    } catch { /* fall through */ }

    if (dealers.length === 0) return notFound();

    const first = dealers[0];
    const minEx = Math.min(...dealers.map(d => Number(d.price)));
    const maxEx = Math.max(...dealers.map(d => Number(d.price)));
    const minOnRoad = Math.min(...dealers.filter(d => d.on_road_price).map(d => Number(d.on_road_price)));
    const allColors = Array.from(new Set(dealers.flatMap(d => (d.colors_available || "").split(",").map(c => c.trim()).filter(Boolean))));
    const maxWarranty = Math.max(...dealers.map(d => d.warranty_years || 0));

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/vehicles" className="text-sm text-green-700 hover:underline mb-4 inline-block">
          ← Back to Vehicle Bazaar
        </Link>

        {/* ── Hero ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-green-200 mb-6">
          {/* Green dealer ribbon */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white px-5 py-2.5 flex items-center justify-between">
            <span className="text-sm font-bold">🏢 AUTHORIZED DEALER LISTING</span>
            <span className="text-sm font-semibold bg-white/20 px-3 py-0.5 rounded-full">
              {Math.min(...dealers.map(d => d.year || 2025))}–{Math.max(...dealers.map(d => d.year || 2026))} NEW STOCK
            </span>
          </div>

          <div className="relative h-64 sm:h-80 bg-gray-100">
            <img src={first.image_url || "/vehicles/Mahindra_575_DI_2021.jpg"} alt={first.name}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs uppercase tracking-wider opacity-80">{TYPE_EMOJI[first.vehicle_type]} {first.vehicle_type}</p>
              <h1 className="text-3xl font-bold">{first.name}</h1>
              <p className="text-sm opacity-90 mt-1">{dealers.length} authorized dealer{dealers.length !== 1 ? "s" : ""} across Telangana</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-5 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-green-600 mb-1">Ex-Showroom (from)</p>
                <p className="text-2xl font-bold text-green-800">₹{minEx.toLocaleString()}</p>
                {maxEx > minEx && <p className="text-xs text-green-600">up to ₹{maxEx.toLocaleString()}</p>}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">On-Road (incl. insurance + RTO)</p>
                <p className="text-2xl font-bold text-blue-800">₹{minOnRoad ? minOnRoad.toLocaleString() : "—"}</p>
                <p className="text-xs text-blue-500">approx · varies by district</p>
              </div>
            </div>

            {/* Key badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {maxWarranty > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                  ✅ Up to {maxWarranty}-Year Warranty
                </span>
              )}
              {first.engine_hp && (
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                  ⚡ {first.engine_hp} HP
                </span>
              )}
              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold">
                📅 Test Drive Available
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                🏦 Finance from 9.5% p.a.
              </span>
            </div>

            {/* Color options */}
            {allColors.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2 font-semibold">🎨 Available Colors</p>
                <div className="flex gap-2 flex-wrap">
                  {allColors.map(c => (
                    <span key={c} className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            {info && (
              <>
                <h2 className="font-semibold text-gray-800 mb-2 mt-3">About {first.name}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{info.about}</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {info.highlights.map((h, i) => (
                    <p key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-600 shrink-0">✓</span>{h}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Dealer cards ── */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🏢 Authorized Dealers ({dealers.length})
        </h2>
        <div className="space-y-4 mb-8">
          {dealers.map((d, i) => {
            const onRoad = d.on_road_price ? Number(d.on_road_price) : Math.round(Number(d.price) * 1.1);
            const regInsurance = onRoad - Number(d.price);
            return (
              <div key={d.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                  i === 0 ? "border-green-300 ring-1 ring-green-100" : "border-gray-100"
                }`}>
                {/* Dealer header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                      🏢
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{d.dealer_name || "Authorized Dealer"}</p>
                      <p className="text-xs text-gray-500">📍 {d.dealer_showroom || d.dealer_city}</p>
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">Best Price</span>
                  )}
                </div>

                <div className="p-5">
                  {d.description && (
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{d.description}</p>
                  )}

                  {/* Price breakdown */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-green-600 mb-0.5">Ex-Showroom</p>
                      <p className="font-bold text-green-800">₹{Number(d.price).toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-blue-600 mb-0.5">RTO + Insurance</p>
                      <p className="font-bold text-blue-800">+₹{regInsurance.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-300 mb-0.5">On-Road Total</p>
                      <p className="font-bold text-white">₹{onRoad.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {d.year && (
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-400">Year</p>
                        <p className="font-semibold text-gray-800 text-sm">{d.year}</p>
                      </div>
                    )}
                    {d.engine_hp && (
                      <div className="bg-green-50 rounded-lg p-2.5">
                        <p className="text-xs text-green-600">Engine</p>
                        <p className="font-bold text-green-700 text-sm">{d.engine_hp} HP</p>
                      </div>
                    )}
                    {d.warranty_years && d.warranty_years > 0 && (
                      <div className="bg-emerald-50 rounded-lg p-2.5">
                        <p className="text-xs text-emerald-600">Warranty</p>
                        <p className="font-bold text-emerald-700 text-sm">{d.warranty_years} Years</p>
                      </div>
                    )}
                    {d.colors_available && (
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-400">Colors</p>
                        <p className="font-semibold text-gray-700 text-xs truncate">{d.colors_available}</p>
                      </div>
                    )}
                  </div>

                  {/* CTAs */}
                  <DealerCTAButtons
                    phone={d.dealer_phone}
                    dealerName={d.dealer_name}
                    vehicleName={d.name}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Finance widget */}
        <FinanceWidget vehicleName={first.name} vehicleType={first.vehicle_type} minPrice={minEx} />

        <div className="mt-8 text-center">
          <Link href="/vehicles" className="text-green-700 text-sm hover:underline">← View all vehicles</Link>
        </div>
      </div>
    );
  }

  // ── USED vehicle path ──────────────────────────────────────
  let sellers: UsedSellerRow[] = [];
  try {
    sellers = await query<UsedSellerRow>(
      `SELECT v.id, v.name, v.slug, v.vehicle_type, v.condition,
         v.brand, v.model, v.year, v.engine_hp,
         v.hours_used, v.km_driven, v.fuel_type, v.color,
         v.description, v.image_url, v.price, v.is_negotiable,
         v.district, v.village,
         u.name    AS seller_name,
         u.phone   AS seller_phone,
         u.village AS seller_village,
         u.district AS seller_district
       FROM vehicles v
       JOIN users u ON u.id::text = v.seller_id::text
       WHERE v.slug = $1 AND v.condition = 'used' AND v.is_active = TRUE
       ORDER BY v.price ASC`,
      [slug]
    );
  } catch { /* fall through */ }

  if (sellers.length === 0) return notFound();

  const first = sellers[0];
  const minPrice = Math.min(...sellers.map(s => Number(s.price)));
  const maxPrice = Math.max(...sellers.map(s => Number(s.price)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            <p className="text-xs uppercase tracking-wider opacity-80">{TYPE_EMOJI[first.vehicle_type]} {first.vehicle_type}</p>
            <h1 className="text-3xl font-bold">{first.name}</h1>
            <p className="text-sm opacity-90 mt-1">
              {sellers.length} individual seller{sellers.length !== 1 ? "s" : ""} ·
              ₹{minPrice.toLocaleString()}{maxPrice > minPrice ? ` – ₹${maxPrice.toLocaleString()}` : ""}
            </p>
          </div>
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Used</span>
        </div>

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

      {/* Used sellers */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        👤 Individual Sellers ({sellers.length})
      </h2>
      <div className="space-y-4 mb-8">
        {sellers.map((s, i) => (
          <div key={s.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
              i === 0 ? "border-amber-200 ring-1 ring-amber-100" : "border-gray-100"
            }`}>
            {/* Seller header */}
            <div className="flex items-center justify-between px-5 py-3 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                  {s.seller_name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.seller_name}</p>
                  <p className="text-xs text-gray-500">📍 {s.seller_village}, {s.seller_district}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-amber-700">₹{Number(s.price).toLocaleString()}</p>
                {s.is_negotiable && <p className="text-xs text-green-600 font-medium">💬 Negotiable</p>}
              </div>
            </div>

            <div className="p-5">
              {s.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.description}</p>
              )}

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {s.year && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Year</p>
                    <p className="font-semibold text-gray-800 text-sm">{s.year}</p>
                  </div>
                )}
                {s.engine_hp && (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-amber-600 mb-0.5">⚡ Engine</p>
                    <p className="font-bold text-amber-700 text-sm">{s.engine_hp} HP</p>
                  </div>
                )}
                {s.hours_used != null && s.hours_used > 0 && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs text-orange-600 mb-0.5">⏱ Hours Used</p>
                    <p className="font-bold text-orange-700 text-sm">{s.hours_used.toLocaleString()} hrs</p>
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
                {s.model && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-0.5">Variant</p>
                    <p className="font-semibold text-gray-800 text-sm truncate">{s.model}</p>
                  </div>
                )}
              </div>

              <a href={`tel:${s.seller_phone}`}
                className="block w-full text-center bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                📞 Contact {s.seller_name.split(" ")[0]} — {s.seller_phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Finance Widget */}
      <FinanceWidget vehicleName={first.name} vehicleType={first.vehicle_type} minPrice={minPrice} />

      <div className="mt-8 text-center">
        <Link href="/vehicles" className="text-green-700 text-sm hover:underline">← View all vehicles</Link>
      </div>
    </div>
  );
}
