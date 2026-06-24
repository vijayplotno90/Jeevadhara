import { query } from "../lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  name_telugu: string;
  price_per_unit: number;
  unit: string;
  farm_district: string;
  farmer_name: string;
  jeevadhara_certified: boolean;
  is_organic: boolean;
  images: string[] | null;
}

interface MandiRate {
  id: string;
  crop: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

// Image fallback map
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

function getImg(p: Product): string {
  if (p.images && p.images.length > 0) return p.images[0];
  const k = p.name.toLowerCase().trim();
  for (const [key, val] of Object.entries(IMAGE_MAP)) {
    if (k.includes(key) || key.includes(k)) return val;
  }
  return "/products/organic tomatoes.jpg";
}

async function getHomeData() {
  const [products, rates, farmerCount] = await Promise.all([
    query<Product>(`
      SELECT p.id, p.name, p.name_telugu, p.price_per_unit, p.unit,
             p.images, p.is_organic, f.district AS farm_district,
             u.name AS farmer_name, f.jeevadhara_certified
      FROM products p
      JOIN farms f ON f.id = p.farm_id
      JOIN users u ON u.id = p.farmer_id
      WHERE p.is_active = TRUE
      ORDER BY f.jeevadhara_certified DESC, p.created_at DESC
      LIMIT 8
    `),
    query<MandiRate>(`
      SELECT id, crop_name AS crop, mandi_name AS market,
             min_price, max_price, modal_price
      FROM mandi_rates ORDER BY date DESC, modal_price DESC LIMIT 5
    `),
    query<{ count: string }>(`SELECT COUNT(*) AS count FROM users WHERE role = 'farmer'`),
  ]);
  return { products, rates, farmerCount: parseInt(farmerCount[0]?.count || "0") };
}

export default async function HomePage() {
  let data = { products: [] as Product[], rates: [] as MandiRate[], farmerCount: 0 };
  try { data = await getHomeData(); } catch (e) { console.error(e); }
  const { products, rates, farmerCount } = data;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-4 font-medium">
            🏆 H0 Hackathon 2026 · AWS × Vercel
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            జీవధార AgriTech
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-3">
            Farm Fresh. Direct. Fair.
          </p>
          <p className="text-green-200 mb-8 max-w-xl mx-auto">
            Connecting Telangana farmers directly to consumers — no middlemen, verified produce, real-time mandi rates.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/fresh-harvest"
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors text-base">
              🌿 Shop Fresh Harvest
            </Link>
            <Link href="/auth?role=farmer"
              className="bg-green-800/60 text-white border border-white/30 px-8 py-3 rounded-xl font-bold hover:bg-green-800/80 transition-colors text-base">
              🌾 List Your Produce
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-green-800 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center text-sm">
          <div><span className="font-bold text-xl text-green-300">{products.length}+</span> <br className="hidden md:block" /> Products Listed</div>
          <div><span className="font-bold text-xl text-green-300">{farmerCount}+</span> <br className="hidden md:block" /> Verified Farmers</div>
          <div><span className="font-bold text-xl text-green-300">{rates.length}+</span> <br className="hidden md:block" /> Mandi Prices</div>
          <div><span className="font-bold text-xl text-green-300">26</span> <br className="hidden md:block" /> Telangana Districts</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🌿 Fresh Harvest</h2>
            <p className="text-gray-500 text-sm mt-1">Direct from Telangana farms</p>
          </div>
          <Link href="/fresh-harvest" className="text-green-600 font-medium hover:underline text-sm">View all →</Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🌾</p>
            <p>Products loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.slice(0,8).map((p) => {
              const img = getImg(p);
              return (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {p.is_organic && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">🌱 Organic</span>
                    )}
                    {p.jeevadhara_certified && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">✓</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {p.farm_district}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-700 font-bold">₹{Number(p.price_per_unit).toFixed(0)}<span className="text-xs text-gray-400 font-normal">/{p.unit}</span></span>
                      <button className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700">Buy</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Live Mandi Rates */}
      <section className="bg-white border-y border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Live Mandi Rates</h2>
              <p className="text-gray-500 text-sm">Real-time prices from Telangana mandis</p>
            </div>
            <Link href="/mandi-rates" className="text-green-600 text-sm font-medium hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Crop</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Market</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Min</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Max</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Modal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rates.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{r.crop}</td>
                    <td className="px-5 py-3 text-gray-500">{r.market}</td>
                    <td className="px-5 py-3 text-right text-gray-600">₹{r.min_price}</td>
                    <td className="px-5 py-3 text-right text-gray-600">₹{r.max_price}</td>
                    <td className="px-5 py-3 text-right font-bold text-green-700">₹{r.modal_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Role CTA */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Join Jeevadhara</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon:"🌾", role:"Farmer", desc:"List produce, get fair prices, access service hub and mandi rates.", color:"green", href:"/auth/signup/farmer" },
            { icon:"🛒", role:"Customer", desc:"Buy fresh, traceable produce directly from verified Telangana farmers.", color:"blue", href:"/auth/signup/customer" },
            { icon:"🏢", role:"Service Provider", desc:"Reach thousands of farmers in your region. IndiaMart-style lead system.", color:"orange", href:"/auth/signup/provider" },
          ].map(c=>(
            <Link key={c.role} href={c.href}
              className={`block rounded-2xl p-6 text-center border-2 hover:shadow-lg transition-all ${
                c.color==="green" ? "border-green-200 bg-green-50 hover:border-green-400" :
                c.color==="blue" ? "border-blue-200 bg-blue-50 hover:border-blue-400" :
                "border-orange-200 bg-orange-50 hover:border-orange-400"
              }`}>
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{c.role}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
              <span className={`inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white ${
                c.color==="green" ? "bg-green-600" : c.color==="blue" ? "bg-blue-600" : "bg-orange-500"
              }`}>Get Started →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
