type MandiRate = {
  id: string; crop: string; crop_hi?: string;
  market: string; state: string;
  min_price: number; modal_price: number; max_price: number;
  unit: string; rate_date?: string;
};

async function getMandiRates(): Promise<MandiRate[]> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  try {
    const res  = await fetch(`${baseUrl}/api/mandi-rates`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.rates || [];
  } catch { return []; }
}

export default async function MandiRatesPage() {
  const rates = await getMandiRates();

  // Group by district
  const byDistrict: Record<string, MandiRate[]> = {};
  for (const r of rates) {
    const d = r.state || "Other";
    if (!byDistrict[d]) byDistrict[d] = [];
    byDistrict[d].push(r);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">📊 Mandi Rates</h1>
        <p className="text-gray-500 mt-1">
          Live market prices from Telangana Agricultural Marketing Board · {rates.length} entries
        </p>
      </div>

      {rates.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">No mandi rates available.</p>
          <p className="text-gray-400 text-sm mt-2">Data updates daily from Aurora DB.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byDistrict).map(([district, distRates]) => (
            <div key={district} className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100">
              <div className="bg-green-800 text-white px-5 py-3">
                <h2 className="font-semibold">📍 {district}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Crop</th>
                      <th className="px-4 py-2 text-left font-semibold">Telugu</th>
                      <th className="px-4 py-2 text-left font-semibold">Mandi</th>
                      <th className="px-4 py-2 text-right font-semibold">Min ₹</th>
                      <th className="px-4 py-2 text-right font-semibold">Modal ₹</th>
                      <th className="px-4 py-2 text-right font-semibold">Max ₹</th>
                      <th className="px-4 py-2 text-center font-semibold">Unit</th>
                      <th className="px-4 py-2 text-center font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distRates.map((r, i) => (
                      <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{r.crop}</td>
                        <td className="px-4 py-2.5 text-green-600">{r.crop_hi || "—"}</td>
                        <td className="px-4 py-2.5 text-gray-500">{r.market}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">₹{r.min_price}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-green-700 text-base">₹{r.modal_price}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">₹{r.max_price}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400 text-xs">{r.unit}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400 text-xs">
                          {r.rate_date?.slice(0, 10) || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-xs text-gray-400">
        Source: Telangana State Agricultural Marketing Board · Stored in AWS Aurora PostgreSQL (eu-north-1)
      </div>
    </div>
  );
}
