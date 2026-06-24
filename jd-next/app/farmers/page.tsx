import Link from "next/link";

type Farmer = {
  id: string; name: string; phone: string; email?: string;
  district: string; village?: string; created_at?: string;
  farm_id?: string; farm_name?: string; total_acres?: number;
  is_organic?: boolean; jeevadhara_certified?: boolean;
  product_count?: number;
};

async function getFarmers(): Promise<Farmer[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  try {
    const res  = await fetch(`${baseUrl}/api/farmers`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.farmers || [];
  } catch { return []; }
}

export default async function FarmersPage() {
  const farmers = await getFarmers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">👨‍🌾 Our Farmers</h1>
          <p className="text-gray-500 mt-1">
            Certified farmers from across Telangana — {farmers.length} registered
          </p>
        </div>
        <Link href="/register"
          className="bg-green-700 text-white px-5 py-2 rounded-full font-medium hover:bg-green-600 transition text-sm">
          + Join as Farmer
        </Link>
      </div>

      {farmers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👨‍🌾</div>
          <p className="text-gray-500">No farmers registered yet.</p>
          <Link href="/register" className="mt-4 inline-block bg-green-700 text-white px-6 py-2 rounded-full">
            Be the First Farmer
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmers.map(f => (
            <div key={f.id} className="bg-white rounded-xl p-5 shadow-sm card-hover border border-green-50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                  👨‍🌾
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{f.name}</h3>
                    {f.jeevadhara_certified && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                  </div>
                  <p className="text-green-600 text-sm">📍 {f.village}, {f.district}</p>
                  <p className="text-gray-500 text-sm mt-1">🌿 {f.farm_name}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {f.total_acres && (
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-green-700">{f.total_acres}</div>
                    <div className="text-green-600 text-xs">Acres</div>
                  </div>
                )}
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-green-700">{f.product_count ?? 0}</div>
                  <div className="text-green-600 text-xs">Products</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {f.is_organic && (
                  <span className="text-xs bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">🌿 Organic</span>
                )}
                {f.jeevadhara_certified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Jeevadhara Certified</span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <a href={`tel:${f.phone}`}
                  className="flex-1 text-center border border-green-700 text-green-700 py-1.5 rounded-lg text-sm hover:bg-green-50 transition">
                  📞 Call
                </a>
                <Link href={`/products?farmer=${f.id}`}
                  className="flex-1 text-center bg-green-700 text-white py-1.5 rounded-lg text-sm hover:bg-green-600 transition">
                  View Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
