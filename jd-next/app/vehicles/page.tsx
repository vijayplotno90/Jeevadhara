import { query } from "../../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TYPE_TABS = [
  { value: "all",          label: "All Vehicles" },
  { value: "tractor",      label: "🚜 Tractors" },
  { value: "commercial",   label: "🚛 Commercial" },
  { value: "construction", label: "🏗️ JCB / Earth-Moving" },
];

const COND_TABS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];

const TYPE_COLOR: Record<string, string> = {
  tractor:      "bg-green-100 text-green-800",
  commercial:   "bg-blue-100 text-blue-800",
  construction: "bg-amber-100 text-amber-800",
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
  has_new:      boolean;
  has_used:     boolean;
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
         v.slug,
         MIN(v.name)          AS name,
         v.vehicle_type,
         v.condition,
         MIN(v.image_url)     AS image_url,
         COUNT(*)::int        AS seller_count,
         MIN(v.price)         AS min_price,
         MAX(v.price)         AS max_price,
         MIN(v.year)          AS min_year,
         MAX(v.year)          AS max_year,
         MIN(v.engine_hp)     AS min_hp,
         MAX(v.engine_hp)     AS max_hp,
         STRING_AGG(DISTINCT v.district, ', ') AS districts,
         BOOL_OR(v.condition = 'new')  AS has_new,
         BOOL_OR(v.condition = 'used') AS has_used
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🚜 Farm Vehicle Bazaar</h1>
        <p className="text-gray-500 mt-1">Tractors · Commercial · JCB — buy direct from Telangana farmers & dealers</p>
      </div>

      {/* Badges */}
      <div className="flex gap-3 flex-wrap mb-5">
        {["🏦 Loan from 3 Banks","🛡️ Insurance from 3 Banks","📋 RC &amp; Documents Verified","🤝 Farmer-to-Farmer Direct"].map(b => (
          <span key={b} className="text-xs bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded-full font-medium"
            dangerouslySetInnerHTML={{ __html: b }} />
        ))}
      </div>

      {/* Vehicle Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {TYPE_TABS.map(t => (
          <Link key={t.value}
            href={`/vehicles?type=${t.value}&condition=${vcond}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              vtype === t.value
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-500"
            }`}>{t.label}
          </Link>
        ))}
      </div>

      {/* Condition Filter */}
      <div className="flex gap-2 mb-6">
        {COND_TABS.map(c => (
          <Link key={c.value}
            href={`/vehicles?type=${vtype}&condition=${c.value}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              vcond === c.value
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-gray-500 border-gray-300 hover:border-amber-400"
            }`}>{c.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-5">
        {vehicles.length} listing{vehicles.length !== 1 ? "s" : ""} · Click to view sellers, specs &amp; finance options
      </p>

      {dbError && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-lg font-mono break-all">
          DB Error: {dbError}
        </div>
      )}

      {vehicles.length === 0 && !dbError ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🚜</p>
          <p>No vehicles listed in this category yet.</p>
          <Link href="/vehicles" className="text-green-600 text-sm mt-2 inline-block">View all</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <Link key={`${v.slug}-${v.condition}`}
              href={`/vehicles/${v.slug}?condition=${v.condition}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                <img
                  src={v.image_url || "/vehicles/Mahindra_575_DI_2021.jpg"}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Condition badge */}
                <span className={`absolute top-2 left-2 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                  v.condition === "new"
                    ? "bg-green-500 text-white"
                    : "bg-amber-500 text-white"
                }`}>{v.condition}</span>

                {/* Type badge */}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLOR[v.vehicle_type] || "bg-gray-100 text-gray-700"}`}>
                  {v.vehicle_type === "construction" ? "JCB" : v.vehicle_type}
                </span>

                {/* Seller count */}
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {v.seller_count} seller{v.seller_count !== 1 ? "s" : ""}
                </span>

                {/* HP badge */}
                {v.min_hp && (
                  <span className="absolute bottom-2 right-2 bg-white/90 text-gray-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {v.min_hp === v.max_hp ? `${v.min_hp} HP` : `${v.min_hp}–${v.max_hp} HP`}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{v.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {v.min_year && (
                    <span className="text-xs text-gray-400">
                      {v.min_year === v.max_year ? v.min_year : `${v.min_year}–${v.max_year}`}
                    </span>
                  )}
                  {v.districts && (
                    <span className="text-xs text-gray-400 truncate">· 📍 {v.districts}</span>
                  )}
                </div>

                {/* Finance chips */}
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">🏦 Loan available</span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">🛡️ Insurance</span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-green-700 font-bold text-xl">
                      ₹{Number(v.min_price).toLocaleString()}
                      {Number(v.max_price) > Number(v.min_price) && (
                        <span className="text-sm font-normal text-gray-400"> – ₹{Number(v.max_price).toLocaleString()}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">asking price · negotiate directly</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium group-hover:underline">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-900 font-semibold text-lg">🚜 Got a vehicle to sell?</p>
        <p className="text-green-700 text-sm mt-1">List your tractor, truck, or JCB — reach verified buyers across Telangana.</p>
        <Link href="/auth?role=farmer"
          className="inline-block mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
          List Your Vehicle
        </Link>
      </div>
    </div>
  );
}
