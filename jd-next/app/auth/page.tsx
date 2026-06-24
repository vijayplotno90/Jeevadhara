"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const roles = [
  {
    id: "farmer",
    emoji: "🌾",
    title: "Farmer",
    telugu: "రైతు",
    tagline: "Sell direct. Earn fair.",
    desc: "List your produce, get fair prices, access mandi rates, service hub, livestock bazar, tools & more.",
    color: "green",
    features: ["List & sell produce", "Live mandi rates", "Service hub access", "Kisan expert connect"],
    href: "/auth/signup/farmer",
  },
  {
    id: "consumer",
    emoji: "🛒",
    title: "Customer",
    telugu: "వినియోగదారు",
    tagline: "Fresh. Traceable. Yours.",
    desc: "Buy farm-fresh vegetables, fruits, grains, honey & eggs directly from verified Telangana farmers.",
    color: "blue",
    features: ["Browse Fresh Harvest", "Buy direct from farmers", "Track your orders", "Verified organic produce"],
    href: "/auth/signup/customer",
  },
  {
    id: "provider",
    emoji: "🏢",
    title: "Service Provider",
    telugu: "సేవా సంస్థ",
    tagline: "Reach the right farmers.",
    desc: "Advertise your agri-services. Get qualified leads from verified farmers in your region.",
    color: "orange",
    features: ["Access farmer leads", "Showcase services", "Region targeting", "IndiaMart-style CRM"],
    href: "/auth/signup/provider",
  },
];

const colorMap: Record<string, string> = {
  green: "border-green-500 bg-green-50 hover:bg-green-100",
  blue: "border-blue-500 bg-blue-50 hover:bg-blue-100",
  orange: "border-orange-500 bg-orange-50 hover:bg-orange-100",
};
const badgeMap: Record<string, string> = {
  green: "bg-green-600 text-white",
  blue: "bg-blue-600 text-white",
  orange: "bg-orange-500 text-white",
};

function AuthContent() {
  const params = useSearchParams();
  const preRole = params.get("role");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Join Jeevadhara</h1>
        <p className="text-gray-500 mt-2">Choose your role to get started</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        {roles.map((r) => (
          <Link
            key={r.id}
            href={r.href}
            className={`block border-2 rounded-2xl p-6 transition-all cursor-pointer ${colorMap[r.color]} ${
              preRole === r.id ? "ring-4 ring-offset-2 ring-green-400 scale-105" : "hover:scale-102 hover:shadow-md"
            }`}
          >
            <div className="text-5xl mb-3">{r.emoji}</div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{r.title}</h2>
              <span className="text-sm text-gray-400">{r.telugu}</span>
            </div>
            <p className={`text-sm font-semibold mb-3 ${r.color === "green" ? "text-green-700" : r.color === "blue" ? "text-blue-700" : "text-orange-700"}`}>
              {r.tagline}
            </p>
            <p className="text-sm text-gray-600 mb-4">{r.desc}</p>
            <ul className="space-y-1">
              {r.features.map((f) => (
                <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className={`mt-5 text-center py-2 rounded-lg text-sm font-semibold ${badgeMap[r.color]}`}>
              Sign up as {r.title} →
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-green-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
