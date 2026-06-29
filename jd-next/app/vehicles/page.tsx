import { query } from "../../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPE_TABS = [
  { value: "all",          label: "All Vehicles" },
  { value: "tractor",      label: "Tractors" },
  { value: "commercial",   label: "Commercial" },
  { value: "construction", label: "JCB / Earth-Moving" },
];

const COND_TABS = [
  { value: "all",  label: "All" },
  { value: "new",  label: "New" },
  { value: "used", label: "Used" },
];

const VEH_IMG: Record<string, string> = {
  "mahindra-575-ramu":    "/vehicles/mahindra-575-di.jpg",
  "sonalika-750-venkat":  "/vehicles/sonalika-750-di.jpg",
};

interface VehicleRow {
  slug:         string;
  name:         string;
  vehicle_type: string;
  condition:    string;
  image_url:    string | null;
  seller_count: number;
  min_price:    number;
  max_price:    number;
  min_year:     number | null;
  max_year:     number | null;
  min_hp:       number | null;
  max_hp:       number | null;
  districts:    string | null;
  dealer_cities: string | null;
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: { type?: string; condition?: string };
}) {
  const vtype = searchParams?.type || "all";
  const vcond = searchParams?.condition || "all";

  let vehicles: VehicleRow[] = [];
  let dbError: string | null = null;

  try {
    const params: unknown[] = [];
    let where = "WHERE v.is_active = TRUE";
    if (vtype && vtype !== "all") {
      params.push(vtype);
      where += ` AND v.vehicle_type = $${params.length}`;
    }
    if (vcond && vcond !== "all") {
      params.push(vcond);
      where += ` AND v.condition = $${params.length}`;
    }

    vehicles = await query<VehicleRow>(
      `SELECT
         v.slug, MIN(v.name) AS name,
         v.vehicle_type, v.condition,
         COUNT(*)::int                           AS seller_count,
         MIN(v.price)                            AS min_price,
         MAX(v.price)                            AS max_price,
         MIN(v.year)                             AS min_year,
         MAX(v.year)                             AS max_year,
         MIN(v.engine_hp)                        AS min_hp,
         MAX(v.engine_hp)                        AS max_hp,
         STRING_AGG(DISTINCT v.district, ', ')   AS districts,
         STRING_AGG(DISTINCT v.dealer_city, ', ') AS dealer_cities
       FROM vehicles v
       ${where}
       GROUP BY v.slug, v.vehicle_type, v.condition
       ORDER BY seller_count DESC, MIN(v.name) ASC`,
      params
    );
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">🚜 Farm Vehicle Bazaar</h1>
          <p className="text-blue-200 mt-1">
            <span className="text-white font-semibold">New</span> — Authorized Dealers &middot;{" "}
            <span className="text-yellow-300 font-semibold">Used</span> — Direct from Farmers
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            {["🏪 Authorized Dealers","🤝 Farmer-to-Farmer","🔧 Service Support","📋 RC Transfer Help"].map(b => (
              <span key={b} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium">{b}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="flex gap-3 flex-wrap mb-5">
        {["Loan from 3 Banks", "Insurance from 3 Banks", "Verified Dealers", "Direct Farmer Listings"].map(b => (
          <span key={b} className="text-xs bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded-full font-medium">{b}</span>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {TYPE_TABS.map(t => (
          <Link key={t.value} href={`/vehicles?type=${t.value}&condition=${vcond}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              vtype === t.value
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{t.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {COND_TABS.map(c => (
          <Link key={c.value} href={`/vehicles?type=${vtype}&condition=${c.value}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              vcond === c.value
                ? c.value === "new"  ? "bg-green-600 text-white border-green-600"
                : c.value === "used" ? "bg-amber-500 text-white border-amber-500"
                :                      "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
            }`}>{c.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {vehicles.length} listing{vehicles.length !== 1 ? "s" : ""} &middot; Click to view dealers/sellers, specs and finance options
      </p>

      {dbError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-lg font-mono break-all">
          DB Error: {dbError}
        </div>
      )}

      {vehicles.length === 0 && !dbError ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">No vehicles yet.</p>
          <Link href="/vehicles" className="text-green-600 text-sm mt-2 inline-block">View all</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            v.condition === "new"
              ? <NewVehicleCard key={`${v.slug}-new`} v={v} vtype={vtype} vcond={vcond} />
              : <UsedVehicleCard key={`${v.slug}-used`} v={v} vtype={vtype} vcond={vcond} />
          ))}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="font-semibold text-green-900">Sell your used vehicle?</p>
          <p className="text-green-700 text-sm mt-1">List direct - reach buyers across Telangana.</p>
          <Link href="/sell/vehicle"
            className="inline-block mt-3 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
            List Your Vehicle
          </Link>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
          <p className="font-semibold text-blue-900">Are you a dealer?</p>
          <p className="text-blue-700 text-sm mt-1">List new stock and connect with farm buyers.</p>
          <Link href="/auth/signup/farmer"
            className="inline-block mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            Register as Dealer
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

function NewVehicleCard({ v, vtype, vcond }: { v: VehicleRow; vtype: string; vcond: string }) {
  void vtype; void vcond;
  return (
    <Link href={`/vehicles/${v.slug}?condition=new`}
      className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden hover:shadow-lg transition-all group relative">

      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-between">
        <span>AUTHORIZED DEALER</span>
        <span>{v.min_year === v.max_year ? v.min_year : `${v.min_year}-${v.max_year}`} STOCK</span>
      </div>

      <div className="relative h-52 bg-gray-100 overflow-hidden pt-7">
        {VEH_IMG[v.slug] ? (
          <img src={VEH_IMG[v.slug]} alt={v.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl">🚜</div>
        )}
        {v.min_hp && (
          <span className="absolute bottom-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {v.min_hp === v.max_hp ? `${v.min_hp} HP` : `${v.min_hp}-${v.max_hp} HP`}
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          {v.seller_count} dealer{v.seller_count !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{v.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {v.dealer_cities || v.districts || "Telangana"}
        </p>
        <div className="mt-2 flex gap-2 flex-wrap">
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">Warranty</span>
          <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Finance</span>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">Test Drive</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Ex-Showroom from</p>
            <p className="text-green-700 font-bold text-xl">Rs{Number(v.min_price).toLocaleString()}</p>
            {Number(v.max_price) > Number(v.min_price) && (
              <p className="text-xs text-gray-400">up to Rs{Number(v.max_price).toLocaleString()}</p>
            )}
          </div>
          <span className="text-sm text-blue-600 font-semibold group-hover:underline">View Dealers</span>
        </div>
      </div>
    </Link>
  );
}

function UsedVehicleCard({ v, vtype, vcond }: { v: VehicleRow; vtype: string; vcond: string }) {
  void vtype; void vcond;
  return (
    <Link href={`/vehicles/${v.slug}?condition=used`}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">

      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {VEH_IMG[v.slug] ? (
          <img src={VEH_IMG[v.slug]} alt={v.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl">🚜</div>
        )}
        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Used</span>
        <span className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">Individual</span>
        {v.min_hp && (
          <span className="absolute bottom-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {v.min_hp === v.max_hp ? `${v.min_hp} HP` : `${v.min_hp}-${v.max_hp} HP`}
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          {v.seller_count} seller{v.seller_count !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{v.name}</h3>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
          {v.min_year && (
            <span>{v.min_year === v.max_year ? v.min_year : `${v.min_year}-${v.max_year}`}</span>
          )}
          {v.districts && <span className="truncate">{v.districts}</span>}
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Loan available</span>
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">Insurance</span>
          <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">Negotiable</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-amber-700 font-bold text-xl">Rs{Number(v.min_price).toLocaleString()}
              {Number(v.max_price) > Number(v.min_price) && (
                <span className="text-sm font-normal text-gray-400"> - Rs{Number(v.max_price).toLocaleString()}</span>
              )}
            </p>
            <p className="text-xs text-gray-400">asking price - negotiate directly</p>
          </div>
          <span className="text-sm text-blue-600 font-medium group-hover:underline">View Sellers</span>
        </div>
      </div>
    </Link>
  );
}
