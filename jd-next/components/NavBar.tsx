"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "farmer" | "consumer" | "provider" | null;

export default function NavBar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const r = localStorage.getItem("jd_role") as Role;
    const n = localStorage.getItem("jd_name");
    setRole(r);
    setUserName(n);

    // Cart count
    try {
      const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    } catch { setCartCount(0); }
  }, [pathname]);

  function logout() {
    localStorage.removeItem("jd_token");
    localStorage.removeItem("jd_role");
    localStorage.removeItem("jd_name");
    localStorage.removeItem("jd_user_id");
    window.location.href = "/";
  }

  const active = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")
      ? "text-green-600 font-semibold"
      : "text-gray-700 hover:text-green-600";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <div>
            <span className="font-bold text-green-700 text-lg leading-none">Jeevadhara</span>
            <span className="block text-xs text-gray-500 leading-none">జీవధార AgriTech</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={active("/")}>Home</Link>
          <Link href="/fresh-harvest" className={active("/fresh-harvest")}>🌿 Fresh Harvest</Link>
          <Link href="/mandi-rates" className={active("/mandi-rates")}>📊 Mandi Rates</Link>

          {role === "farmer" && (
            <>
              <Link href="/farmer/dashboard" className={active("/farmer/dashboard")}>🌾 Dashboard</Link>
              <Link href="/list-produce" className={active("/list-produce")}>+ List Produce</Link>
            </>
          )}
          {role === "provider" && (
            <Link href="/provider/dashboard" className={active("/provider/dashboard")}>📋 My Leads</Link>
          )}
        </div>

        {/* Auth + Cart */}
        <div className="flex items-center gap-3 text-sm">
          {/* Cart icon — consumers and guests */}
          {role !== "farmer" && role !== "provider" && (
            <Link href="/cart" className="relative text-gray-600 hover:text-green-600">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {!role ? (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-green-600 font-medium">Log In</Link>
              <Link href="/auth" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="text-gray-600 text-sm hidden md:inline">
                {role === "farmer" ? "🌾" : role === "provider" ? "🏢" : "🛒"} {userName || role}
              </span>
              <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100 px-4 py-2 flex gap-4 text-sm overflow-x-auto">
        <Link href="/" className={active("/")}>Home</Link>
        <Link href="/fresh-harvest" className={active("/fresh-harvest")}>Fresh Harvest</Link>
        <Link href="/mandi-rates" className={active("/mandi-rates")}>Mandi Rates</Link>
        <Link href="/cart" className={active("/cart")}>🛒 Cart</Link>
        {role === "farmer" && <Link href="/farmer/dashboard" className={active("/farmer/dashboard")}>Dashboard</Link>}
        {role === "provider" && <Link href="/provider/dashboard" className={active("/provider/dashboard")}>Leads</Link>}
        {!role && <Link href="/auth" className={active("/auth")}>Sign Up</Link>}
      </div>
    </nav>
  );
}
