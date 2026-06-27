"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  {
    href: "/sell/vehicle",
    emoji: "🚜",
    title: "Vehicle / Equipment",
    desc: "Tractor, truck, JCB — new dealer listing or used individual sale",
    color: "from-blue-600 to-blue-400",
  },
  {
    href: "/sell/tool",
    emoji: "🛠️",
    title: "Farm Tools",
    desc: "Hand tools, sprayers, wheelbarrows — new equipment listing",
    color: "from-orange-600 to-amber-400",
  },
  {
    href: "/sell/livestock",
    emoji: "🐄",
    title: "Livestock",
    desc: "Cattle, buffalo, poultry, sheep, fish — sell your animals",
    color: "from-green-700 to-emerald-400",
  },
  {
    href: "/sell/honey",
    emoji: "🍯",
    title: "Honey & Bee Products",
    desc: "Raw honey, beeswax, propolis, royal jelly — direct from your apiary",
    color: "from-amber-500 to-yellow-400",
  },
  {
    href: "/sell/nursery",
    emoji: "🌱",
    title: "Nursery Plants",
    desc: "Saplings, tissue culture plants, grafted varieties — nursery listings",
    color: "from-green-600 to-lime-400",
  },
  {
    href: "/list-produce",
    emoji: "🥦",
    title: "Fresh Produce",
    desc: "Vegetables, fruits, grains, pulses — daily farm produce",
    color: "from-teal-600 to-cyan-400",
  },
];

export default function SellHubPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jd_token");
    if (!token) router.push("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-800 to-emerald-600 text-white px-4 py-8">
        <h1 className="text-2xl font-bold">📋 List Your Product</h1>
        <p className="text-green-100 text-sm mt-1">
          Choose what you want to sell — your listing goes to admin for approval before going live
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex items-center gap-4 bg-white rounded-2xl shadow hover:shadow-md p-4 transition-all group"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shrink-0`}>
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-green-700">{c.title}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-snug">{c.desc}</p>
            </div>
            <span className="text-gray-300 text-xl shrink-0">›</span>
          </Link>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>⏳ Admin Approval:</strong> All listings are reviewed by the Jeevadhara team before going live. Typically approved within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
