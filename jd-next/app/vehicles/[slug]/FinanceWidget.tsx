"use client";
import { useState } from "react";

interface Props {
  vehicleName: string;
  vehicleType: string;
  minPrice: number;
}

const INSURANCE_BANKS = [
  {
    id: "sbi-general",
    name: "SBI General Insurance",
    logo: "🏦",
    ratePercent: 2.5,
    tagline: "India's most trusted farm vehicle cover",
    coverage: ["Accidental damage", "Theft", "Natural calamity", "Third-party liability"],
    claim_days: 7,
    color: "blue",
  },
  {
    id: "hdfc-ergo",
    name: "HDFC Ergo Motor",
    logo: "🛡️",
    ratePercent: 3.2,
    tagline: "Zero depreciation + roadside assistance",
    coverage: ["Zero depreciation cover", "Engine protection", "Roadside assistance 24×7", "Consumables cover"],
    claim_days: 5,
    color: "red",
  },
  {
    id: "icici-lombard",
    name: "ICICI Lombard",
    logo: "🔵",
    ratePercent: 2.8,
    tagline: "Instant claim settlement via app",
    coverage: ["Own damage", "Third-party", "Fire & explosion", "Self-ignition & lightning"],
    claim_days: 3,
    color: "orange",
  },
];

const LOAN_BANKS = [
  {
    id: "sbi-kisan",
    name: "SBI Kisan Tractor Loan",
    logo: "🏦",
    ratePercent: 9.5,
    ltvPercent: 90,
    maxTenorYears: 7,
    tagline: "Lowest rate — up to 90% of vehicle value",
    features: ["Up to 90% LTV", "Flexible repayment — post harvest", "No prepayment penalty", "KCC linkage available"],
    color: "blue",
  },
  {
    id: "union-bank",
    name: "Union Bank Agri Loan",
    logo: "🌾",
    ratePercent: 10.2,
    ltvPercent: 85,
    maxTenorYears: 5,
    tagline: "Faster approval — 3 working days",
    features: ["Up to 85% LTV", "3-day disbursal", "Seasonal EMI option", "FPO group loans eligible"],
    color: "purple",
  },
  {
    id: "hdfc-agri",
    name: "HDFC Bank Farm Equipment",
    logo: "🔶",
    ratePercent: 11.5,
    ltvPercent: 80,
    maxTenorYears: 7,
    tagline: "Digital process — paperless approval",
    features: ["Up to 80% LTV", "100% digital process", "Overdraft facility", "Insurance bundled free"],
    color: "red",
  },
];

function calcEMI(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export default function FinanceWidget({ vehicleName, vehicleType, minPrice }: Props) {
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [tenorYears, setTenorYears] = useState(5);
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  const chosenInsurance = INSURANCE_BANKS.find(b => b.id === selectedInsurance);
  const chosenLoan = LOAN_BANKS.find(b => b.id === selectedLoan);

  const annualInsurance = chosenInsurance
    ? Math.round((minPrice * chosenInsurance.ratePercent) / 100)
    : 0;

  const downPayment = Math.round((minPrice * downPaymentPct) / 100);
  const loanAmount = minPrice - downPayment;
  const emi = chosenLoan ? calcEMI(loanAmount, chosenLoan.ratePercent, tenorYears) : 0;

  const totalMonthly = Math.round(annualInsurance / 12) + emi;

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-4">
        <h2 className="text-white font-bold text-lg">💳 Finance Your {vehicleName}</h2>
        <p className="text-indigo-200 text-sm mt-0.5">
          Select insurance + loan independently. Mix &amp; match the best offer from each bank.
        </p>
      </div>

      <div className="bg-white p-5">
        {/* Vehicle Value */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-6">
          <span className="text-sm text-gray-500">Vehicle value (min price)</span>
          <span className="text-xl font-bold text-gray-900">₹{minPrice.toLocaleString()}</span>
        </div>

        {/* ────────────────────────────────────── */}
        {/* INSURANCE */}
        {/* ────────────────────────────────────── */}
        <div className="mb-7">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">STEP 1</span>
            🛡️ Choose Insurance Bank
            <span className="text-xs text-gray-400 font-normal ml-auto">(select one)</span>
          </h3>

          <div className="space-y-3">
            {INSURANCE_BANKS.map(bank => {
              const annual = Math.round((minPrice * bank.ratePercent) / 100);
              const monthly = Math.round(annual / 12);
              const isSelected = selectedInsurance === bank.id;

              return (
                <label key={bank.id}
                  className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-indigo-300"
                  }`}>
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setSelectedInsurance(isSelected ? null : bank.id)}
                      className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xl">{bank.logo}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{bank.name}</p>
                          <p className="text-xs text-gray-400">{bank.tagline}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {bank.coverage.map(c => (
                          <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">✓ {c}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">⚡ Claim in {bank.claim_days} working days</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-indigo-800">₹{annual.toLocaleString()}<span className="text-xs font-normal text-gray-400">/yr</span></p>
                    <p className="text-xs text-indigo-500">{bank.ratePercent}% of value</p>
                    <p className="text-xs text-gray-400 mt-0.5">or ₹{monthly.toLocaleString()}/mo</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* LOAN */}
        {/* ────────────────────────────────────── */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">STEP 2</span>
            🏦 Choose Loan Bank
            <span className="text-xs text-gray-400 font-normal ml-auto">(select one)</span>
          </h3>

          {/* Loan configurator */}
          <div className="bg-gray-50 rounded-xl p-4 mb-3 grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Down Payment</label>
              <select
                value={downPaymentPct}
                onChange={e => setDownPaymentPct(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                {[10, 15, 20, 25, 30].map(p => (
                  <option key={p} value={p}>{p}% — ₹{Math.round((minPrice * p) / 100).toLocaleString()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Loan Tenure</label>
              <select
                value={tenorYears}
                onChange={e => setTenorYears(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
                {[3, 5, 7].map(y => (
                  <option key={y} value={y}>{y} years ({y * 12} EMIs)</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 bg-white rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Loan amount needed</span>
              <span className="font-bold text-gray-800">₹{(minPrice - downPayment).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            {LOAN_BANKS.map(bank => {
              const lAmt = minPrice - downPayment;
              const monthlyEMI = calcEMI(lAmt, bank.ratePercent, tenorYears);
              const totalPay = monthlyEMI * tenorYears * 12;
              const interest = totalPay - lAmt;
              const isSelected = selectedLoan === bank.id;
              const maxLoan = Math.round((minPrice * bank.ltvPercent) / 100);
              const canCover = lAmt <= maxLoan;

              return (
                <label key={bank.id}
                  className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}>
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setSelectedLoan(isSelected ? null : bank.id)}
                      className="mt-1 w-4 h-4 accent-green-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xl">{bank.logo}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{bank.name}</p>
                          <p className="text-xs text-gray-400">{bank.tagline}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {bank.features.map(f => (
                          <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">✓ {f}</span>
                        ))}
                      </div>
                      {!canCover && (
                        <p className="text-xs text-red-500 mt-1">⚠ Max loan ₹{maxLoan.toLocaleString()} — increase down payment</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-green-800">₹{monthlyEMI.toLocaleString()}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                    <p className="text-xs text-green-600">{bank.ratePercent}% p.a.</p>
                    <p className="text-xs text-gray-400 mt-0.5">Interest: ₹{Math.round(interest / 1000)}K</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ────────────────────────────────────── */}
        {/* SUMMARY */}
        {/* ────────────────────────────────────── */}
        {(chosenInsurance || chosenLoan) && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-green-900 mb-4 text-base">📋 Your Finance Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle price</span>
                <span className="font-semibold text-gray-800">₹{minPrice.toLocaleString()}</span>
              </div>
              {chosenLoan && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down payment ({downPaymentPct}%)</span>
                    <span className="font-semibold text-gray-800">₹{downPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan from {chosenLoan.name}</span>
                    <span className="font-semibold text-gray-800">₹{(minPrice - downPayment).toLocaleString()} @ {chosenLoan.ratePercent}%</span>
                  </div>
                  <div className="flex justify-between text-green-800 font-semibold">
                    <span>Monthly EMI ({tenorYears} yrs)</span>
                    <span>₹{emi.toLocaleString()}/mo</span>
                  </div>
                </>
              )}
              {chosenInsurance && (
                <div className="flex justify-between text-indigo-800 font-semibold">
                  <span>Insurance ({chosenInsurance.name.split(" ")[0]})</span>
                  <span>₹{Math.round(annualInsurance / 12).toLocaleString()}/mo</span>
                </div>
              )}
              <div className="border-t border-green-200 mt-2 pt-2 flex justify-between text-base font-bold text-green-900">
                <span>Total monthly outflow</span>
                <span>₹{totalMonthly.toLocaleString()}/mo</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Your interest in ${vehicleName} with ${chosenInsurance?.name || "no insurance"} and ${chosenLoan?.name || "no loan"} has been noted. Our finance team will call you within 24 hours.`)}
              className="w-full mt-4 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors text-sm">
              ✅ Submit Finance Interest — Get Call Back in 24 hrs
            </button>
          </div>
        )}

        {!chosenInsurance && !chosenLoan && (
          <div className="text-center py-4 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
            Select insurance and/or loan above to see your total monthly cost
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          * EMI calculated at flat rate for illustration. Actual disbursement subject to bank KYC and valuation. Insurance premium based on IDV.
        </p>
      </div>
    </div>
  );
}
