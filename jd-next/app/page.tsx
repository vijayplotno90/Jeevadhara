import Link from "next/link";
import {
  ArrowRight, Leaf, ShieldCheck, Sprout, Star, Tractor,
  Users, IndianRupee, BarChart3, Egg, BookOpen, TestTube2
} from "lucide-react";

const HERO_CATEGORIES = [
  { href: "/mandi-rates", label: "Mandi Rates", emoji: "📊", grad: "from-emerald-200 to-green-100" },
  { href: "/fresh-harvest", label: "Fresh Harvest", emoji: "🌾", grad: "from-amber-200 to-yellow-100" },
  { href: "/animals", label: "Livestock Bazaar", emoji: "🐄", grad: "from-orange-200 to-rose-100" },
  { href: "/vehicles", label: "Vehicles", emoji: "🚜", grad: "from-red-200 to-orange-100" },
  { href: "/implements", label: "Tools", emoji: "🛠️", grad: "from-slate-200 to-zinc-100" },
  { href: "/plantation", label: "Nursery", emoji: "🌱", grad: "from-green-200 to-lime-100" },
  { href: "/egg-prices", label: "Egg Prices", emoji: "🥚", grad: "from-yellow-200 to-amber-100" },
  { href: "/jankari", label: "Kisan Expert Desk", emoji: "📚", grad: "from-blue-200 to-sky-100" },
] as const;

const VALUE_PROPS = [
  { icon: IndianRupee, title: "Fair prices", desc: "Farmers earn more, you pay less. Transparent pricing on every listing.", tint: "bg-green-50 text-green-700" },
  { icon: ShieldCheck, title: "Quality you can trust", desc: "Graded, fresh and traceable produce delivered to your door.", tint: "bg-amber-50 text-amber-700" },
  { icon: Users, title: "Direct from farms", desc: "Every product comes straight from a verified farmer — no layers, no markups.", tint: "bg-orange-50 text-orange-700" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Customer · Kushaiguda", quote: "The tomatoes arrived the morning after harvest. My family can taste the difference and I love knowing exactly where it came from.", rating: 5 },
  { name: "Rajesh Kumar", role: "Farmer · Solipeta Village", quote: "For 20 years the middleman took 60% of my income. With Jeevadhara I doubled my earnings in the first season.", rating: 5 },
  { name: "Suresh Naidu", role: "Solar Installer · Hyderabad", quote: "Jeevadhara connected me to farmers who actually need solar pumps. Best lead source I've ever had.", rating: 5 },
];

const STEPS = [
  { icon: Sprout, title: "Farmers list fresh harvest", desc: "Crops, grade, quantity, and a fair suggested price — all in minutes." },
  { icon: ShieldCheck, title: "We grade & verify quality", desc: "Independent quality checks with photos and certificates per batch." },
  { icon: Tractor, title: "Delivered to your door", desc: "Fast delivery from farm to family, fully traceable." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-green-50/80 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-2 md:items-center md:gap-16 md:pt-20 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <Leaf className="h-3.5 w-3.5" />
              Farm to Family, Fairly Priced
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Fresh from the farm,{" "}
              <span className="text-green-700">fair for everyone</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-500">
              Buy directly from verified farmers across Telangana — fresh produce, livestock, tools and more, with no middlemen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/fresh-harvest" className="inline-flex h-12 items-center gap-2 rounded-lg bg-green-700 px-6 text-sm font-semibold text-white shadow-glow transition hover:bg-green-800">
                Shop fresh produce
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth" className="inline-flex h-12 items-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-900 transition hover:border-green-600 hover:text-green-700">
                Sell your harvest
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-green-600" />
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-amber-500" />
                  <div className="h-7 w-7 rounded-full border-2 border-white bg-orange-500" />
                </div>
                <span><strong className="text-gray-900">2,400+</strong> Farmers onboarded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span><strong className="text-gray-900">4.9</strong> Average rating</span>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-green-100 to-amber-100 blur-2xl" />
            <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-glow">
              <img src="/hero-farmer.jpg" alt="Telangana farmer with fresh produce" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quality assured</p>
                  <p className="text-sm font-semibold text-gray-900">Grade A · Batch #2847</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-green-700">Explore</span>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl text-gray-900">Everything from the farm</h2>
            </div>
            <Link href="/list-produce" className="hidden sm:inline-flex h-11 items-center gap-2 rounded-lg bg-amber-400 px-5 text-sm font-bold text-amber-900 hover:bg-amber-300">
              List & sell
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-3 lg:grid-cols-8">
            {HERO_CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className="group flex flex-col items-center text-center transition hover:-translate-y-1">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-200 bg-gradient-to-br ${c.grad} text-4xl shadow-soft transition group-hover:border-green-600 group-hover:shadow-glow sm:h-24 sm:w-24`}>
                  {c.emoji}
                </div>
                <p className="mt-3 text-xs font-bold leading-tight text-gray-900 sm:text-sm">{c.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { href: "/mandi-rates", icon: BarChart3, label: "Mandi Rates", sub: "Today's wholesale prices", grad: "from-emerald-50 to-green-50", color: "text-emerald-700" },
            { href: "/egg-prices", icon: Egg, label: "Egg Prices", sub: "Daily rates by city", grad: "from-amber-50 to-yellow-50", color: "text-amber-700" },
            { href: "/jankari", icon: TestTube2, label: "Soil Test", sub: "Know your soil health", grad: "from-orange-50 to-amber-50", color: "text-orange-700" },
            { href: "/jankari", icon: BookOpen, label: "Kisan Expert Desk", sub: "Schemes & advisory", grad: "from-sky-50 to-blue-50", color: "text-sky-700" },
          ].map((item) => (
            <Link key={item.href + item.label} href={item.href} className={`group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br ${item.grad} p-5 transition hover:-translate-y-0.5 hover:border-green-500 hover:shadow-card`}>
              <item.icon className={`h-10 w-10 ${item.color}`} />
              <div>
                <p className="font-serif text-lg font-bold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.tint}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-green-700">How it works</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">Three simple steps</h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 font-serif text-lg font-bold text-white">
                  {i + 1}
                </span>
                <s.icon className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-700">Loved by farmers & families</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">What people say</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((tt) => (
              <figure key={tt.name} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: tt.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700">"{tt.quote}"</blockquote>
                <figcaption className="mt-6 border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{tt.name}</p>
                  <p className="text-xs text-gray-500">{tt.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-10 text-white shadow-glow sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-base text-white/85">Join thousands of farmers and families building a fairer food system across Telangana.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth" className="inline-flex h-12 items-center gap-2 rounded-lg bg-amber-400 px-6 text-sm font-semibold text-amber-900 transition hover:bg-amber-300">
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/fresh-harvest" className="inline-flex h-12 items-center rounded-lg border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Browse marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-bold text-gray-900">Jeevadhara</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-gray-500">Direct farmer-to-consumer marketplace. Fresh produce, fair prices, no middlemen.</p>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-gray-900">Marketplace</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/fresh-harvest" className="hover:text-green-700">Browse produce</Link></li>
              <li><Link href="/list-produce" className="hover:text-green-700">Sell with us</Link></li>
              <li><Link href="/mandi-rates" className="hover:text-green-700">Mandi Rates</Link></li>
              <li><Link href="/jankari" className="hover:text-green-700">Workshops</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-green-700">About us</Link></li>
              <li><Link href="/contact" className="hover:text-green-700">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-400 sm:px-6 lg:px-8">
            © {new Date().getFullYear()} Jeevadhara AgriTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
