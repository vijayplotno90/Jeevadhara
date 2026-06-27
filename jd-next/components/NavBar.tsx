"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Sprout, Tag, ShoppingCart, LogOut, User as UserIcon,
  ChevronLeft, ChevronRight
} from "lucide-react";

type Role = "farmer" | "consumer" | "provider" | null;

const NAV = [
  { href: "/fresh-harvest", label: "Fresh Harvest" },
  { href: "/animals", label: "Livestock Bazaar" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/implements", label: "Tools" },
  { href: "/plantation", label: "Nursery" },
  { href: "/honey", label: "Honey" },
  { href: "/mandi-rates", label: "Mandi Rates" },
  { href: "/egg-prices", label: "Egg Prices" },
  { href: "/services", label: "Service Hub" },
  { href: "/jankari", label: "Kisan Expert Desk" },
  { href: "/web-stories", label: "Web Stories" },
];

function ScrollableNav({ pathname }: { pathname: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="relative">
      {canLeft && (
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-240)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white shadow-soft hover:border-green-600 hover:text-green-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canRight && (
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(240)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white shadow-soft hover:border-green-600 hover:text-green-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
      <div
        ref={ref}
        className="flex gap-1 overflow-x-auto scroll-smooth py-2 px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-green-700 text-white"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const r = localStorage.getItem("jd_role") as Role;
    const n = localStorage.getItem("jd_name") || "";
    setRole(r);
    setName(n);
    const cart = JSON.parse(localStorage.getItem("jd_cart") || "[]");
    const count = Array.isArray(cart)
      ? cart.reduce((s: number, i: { qty?: number }) => s + (i.qty || 1), 0)
      : 0;
    setCartCount(count);
  }, [pathname]);

  const dashHref =
    role === "farmer"
      ? "/farmer/dashboard"
      : role === "provider"
      ? "/provider/dashboard"
      : "/dashboard/consumer";

  function logout() {
    localStorage.removeItem("jd_token");
    localStorage.removeItem("jd_role");
    localStorage.removeItem("jd_name");
    setRole(null);
    setName("");
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      {/* Row 1: brand + utilities */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white shadow-soft">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-gray-900">Jeevadhara</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Sell CTA */}
          <Link
            href="/list-produce"
            className="relative inline-flex h-10 items-center gap-1.5 rounded-lg bg-amber-400 px-3 sm:px-4 text-sm font-bold text-amber-900 shadow-glow ring-2 ring-amber-400/40 transition hover:scale-105 hover:bg-amber-300"
          >
            <Tag className="h-4 w-4" />
            <span>Sell</span>
            <span className="absolute -right-1.5 -top-1.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white" />
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:border-green-600 hover:text-green-700"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {role ? (
            <>
              {role === "consumer" && (
                <Link
                  href="/my-orders"
                  className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-green-600 hover:text-green-700 sm:inline-flex"
                >
                  <ShoppingCart className="h-4 w-4" />
                  My Orders
                </Link>
              )}
              <Link
                href={dashHref}
                className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition hover:border-green-600 hover:text-green-700 sm:inline-flex"
              >
                <UserIcon className="h-4 w-4" />
                {name.split(" ")[0] || "Account"}
              </Link>
              <button
                onClick={logout}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-green-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-green-800"
              >
                <LogOut className="mr-1.5 h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-green-700 sm:inline-block"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-green-700 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-green-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Row 2: scrollable nav strip */}
      <nav className="border-t border-gray-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <ScrollableNav pathname={pathname} />
        </div>
      </nav>
    </header>
  );
}
