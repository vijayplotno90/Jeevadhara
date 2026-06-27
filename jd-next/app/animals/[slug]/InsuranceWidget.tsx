"use client";

interface Props {
  breed: string;
  category: string;
  minPrice: number;
}

const BANKS = [
  {
    name: "SBI Pashudhan Bima",
    logo: "🏦",
    color: "blue",
    ratePercent: 3.5,
    coverage: ["Natural death", "Accident & injury", "Disease (certified vet)"],
    claim_days: 7,
    tagline: "India's most trusted livestock insurance",
    plans: [
      { label: "Annual (1 pay)", discount: 0 },
      { label: "Half-yearly (2 pays)", discount: 0.5 },
      { label: "Quarterly (4 pays)", discount: 1.2 },
    ],
  },
  {
    name: "HDFC Ergo Farm Shield",
    logo: "🛡️",
    color: "red",
    ratePercent: 4.2,
    coverage: ["Natural death", "Accident & injury", "Disease (all types)", "Theft (cattle)"],
    claim_days: 5,
    tagline: "Comprehensive cover including theft",
    plans: [
      { label: "Annual (1 pay)", discount: 0 },
      { label: "Monthly EMI (12 pays)", discount: 1.8 },
    ],
  },
];

export default function InsuranceWidget({ breed, category, minPrice }: Props) {
  const animalValue = minPrice;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🏦</span>
        <h2 className="text-lg font-bold text-indigo-900">Livestock Insurance Add-On</h2>
      </div>
      <p className="text-sm text-indigo-700 mb-4">
        Protect your investment. Compare plans from 2 banks for your <strong>{breed}</strong> (value ₹{animalValue.toLocaleString()}).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BANKS.map(bank => {
          const annualPremium = (animalValue * bank.ratePercent) / 100;
          const monthlyEMI   = annualPremium / 12;

          return (
            <div key={bank.name}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{bank.logo}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{bank.name}</p>
                  <p className="text-xs text-gray-400">{bank.tagline}</p>
                </div>
              </div>

              {/* Premium display */}
              <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-indigo-500 mb-0.5">Annual Premium ({bank.ratePercent}%)</p>
                <p className="text-2xl font-bold text-indigo-800">₹{Math.round(annualPremium).toLocaleString()}</p>
                <p className="text-xs text-indigo-500">or ₹{Math.round(monthlyEMI).toLocaleString()}/month (EMI)</p>
              </div>

              {/* EMI plans */}
              <div className="mb-3 space-y-1.5">
                {bank.plans.map(plan => {
                  const extraCost = (annualPremium * plan.discount) / 100;
                  const totalCost = annualPremium + extraCost;
                  const installments = plan.label.includes("Monthly") ? 12
                    : plan.label.includes("Half") ? 2
                    : plan.label.includes("Quarterly") ? 4 : 1;
                  const perInstallment = totalCost / installments;

                  return (
                    <div key={plan.label}
                      className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-600">{plan.label}</span>
                      <span className="font-semibold text-gray-800">
                        ₹{Math.round(perInstallment).toLocaleString()}
                        {plan.discount > 0 && (
                          <span className="text-amber-500 ml-1">(+{plan.discount}%)</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coverage */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Coverage includes:</p>
                {bank.coverage.map(c => (
                  <p key={c} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-green-500">✓</span>{c}
                  </p>
                ))}
                <p className="text-xs text-gray-500 mt-1.5">⚡ Claim settlement in {bank.claim_days} working days</p>
              </div>

              <button
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                onClick={() => alert(`Apply for ${bank.name} insurance — our team will contact you within 24 hours.`)}>
                Apply for {bank.name.split(" ")[0]} Insurance
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-indigo-400 text-center mt-3">
        * Premiums calculated on declared animal value. Final premium subject to vet inspection report. EMI subject to bank approval.
      </p>
    </div>
  );
}
