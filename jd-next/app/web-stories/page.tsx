"use client";
import { useState } from "react";

interface Slide { title: string; body: string; emoji?: string; }
interface Story {
  id: string;
  slug: string;
  title: string;
  cover_emoji: string;
  cover_gradient: string;
  tag: string;
  slides: Slide[];
}

const STORIES: Story[] = [
  {
    id: "1", slug: "tomato-tips", tag: "Horticulture",
    title: "Double your tomato yield this season",
    cover_emoji: "🍅", cover_gradient: "from-red-500 to-orange-500",
    slides: [
      { emoji: "🌱", title: "Pick the right variety", body: "Use Arka Rakshak or US440 — hybrid varieties bred for Telangana's heat and humidity. Avoid local varieties in summer." },
      { emoji: "🪱", title: "Soil prep matters", body: "Target pH 6.0–6.8. Add 2 tons FYM per acre before transplanting. Do soil test first — saves Rs3,000+ in wrong fertiliser." },
      { emoji: "💧", title: "Drip + black mulch", body: "Drip irrigation saves 40% water vs flood. Black mulch suppresses weeds, retains moisture and increases soil temp in winter." },
      { emoji: "🪵", title: "Stake early", body: "Stake within 30 days of transplanting. Prevents lodging and boosts yield by 25%. Use 4-ft bamboo sticks." },
      { emoji: "🛡️", title: "Watch for late blight", body: "Spray copper-oxychloride at first sign. Repeat after every rain. Mancozeb + metalaxyl for severe infection." },
    ],
  },
  {
    id: "2", slug: "pm-kisan", tag: "Schemes",
    title: "PM-KISAN: Claim your Rs6,000 in 5 steps",
    cover_emoji: "💸", cover_gradient: "from-emerald-500 to-teal-600",
    slides: [
      { emoji: "🌐", title: "Open pmkisan.gov.in", body: "Click 'New Farmer Registration' on the homepage. Use Chrome on mobile — it loads faster." },
      { emoji: "📱", title: "Enter Aadhaar", body: "Verify mobile number linked to Aadhaar with OTP. If OTP fails, update your mobile at nearest CSC centre." },
      { emoji: "📄", title: "Fill land details", body: "Enter khasra number, khata, and state/district details exactly as on your Pattadar Passbook." },
      { emoji: "🏦", title: "Link bank account", body: "Use an Aadhaar-seeded account for direct benefit transfer. DBTL must be active — check at your branch." },
      { emoji: "✅", title: "Track your status", body: "Check 'Beneficiary Status' to monitor your Rs2,000 installments. 3 instalments = Rs6,000 per year." },
    ],
  },
  {
    id: "3", slug: "monsoon-checklist", tag: "Seasonal",
    title: "Monsoon farm checklist — 4 must-dos",
    cover_emoji: "🌧️", cover_gradient: "from-blue-500 to-indigo-600",
    slides: [
      { emoji: "🏞️", title: "Clear drain channels", body: "Clear all field bunds and drainage channels before June 1st. Waterlogging for 48 hrs can kill paddy seedlings." },
      { emoji: "🌾", title: "Protect grain storage", body: "Stack grain on wooden pallets, cover with tarpaulin. Keep 1ft gap from wall to prevent moisture seepage." },
      { emoji: "🐛", title: "Scout for pests", body: "Inspect crops weekly. Stem borer and leaf folder peak in July-August. Early catch = no spray needed." },
      { emoji: "📑", title: "Enroll in PMFBY", body: "Enroll in PM Fasal Bima Yojana before your state cut-off date. Just 1.5% premium for Rs50,000 sum insured." },
    ],
  },
  {
    id: "4", slug: "rytu-bandhu", tag: "Telangana",
    title: "Claim Rytu Bandhu — Rs10,000/acre",
    cover_emoji: "🌾", cover_gradient: "from-green-500 to-emerald-600",
    slides: [
      { emoji: "📋", title: "Check eligibility", body: "You need a Pattadar Passbook and Aadhaar seeded to your bank account. Tenant farmers are NOT eligible." },
      { emoji: "💻", title: "Verify Dharani records", body: "Your land must be updated on dharani.telangana.gov.in before the season. Disputes will block payment." },
      { emoji: "🏛️", title: "Visit MeeSeva", body: "Apply at nearest MeeSeva centre with passbook + Aadhaar. No agents needed — it is free." },
      { emoji: "💰", title: "Payment timeline", body: "Rs10,000/acre released before Kharif (June) and Rabi (October). Check VRO list before season." },
    ],
  },
  {
    id: "5", slug: "drip-irrigation", tag: "Technology",
    title: "Set up drip irrigation — save 50% water",
    cover_emoji: "💧", cover_gradient: "from-cyan-500 to-blue-600",
    slides: [
      { emoji: "📐", title: "Plan your layout", body: "1 lateral per 1.2m row for vegetables. 1 lateral per 2 rows for sugarcane. Sketch on paper before buying." },
      { emoji: "🛒", title: "Cost breakdown", body: "1 acre drip kit: Netafim or Rivulis = Rs45,000–65,000. MIDH subsidy covers 40–55% — check your state." },
      { emoji: "🔧", title: "Install in 1 day", body: "Lay mainline, sub-main, then laterals. Flush system before attaching emitters. Use filter at pump end." },
      { emoji: "📅", title: "Schedule smartly", body: "Run drip 1-2 hrs/day for vegetables. Use tensiometer to read soil moisture. Night irrigation saves 15% more." },
      { emoji: "🌱", title: "Fertigation bonus", body: "Inject fertiliser directly into drip system. Saves 30% on urea and DAP. Use venturi injector — no electricity needed." },
    ],
  },
  {
    id: "6", slug: "kcc-loan", tag: "Finance",
    title: "Get KCC loan at 4% interest — how to apply",
    cover_emoji: "🏦", cover_gradient: "from-violet-500 to-purple-700",
    slides: [
      { emoji: "📜", title: "Kisan Credit Card basics", body: "KCC gives revolving credit up to Rs3 lakh at 4% interest (7% - 3% govt subsidy). Valid for 5 years." },
      { emoji: "📁", title: "Documents needed", body: "Land records (Pattadar Passbook), Aadhaar, PAN, 2 photos, 6-month bank statement. That is all." },
      { emoji: "🏛️", title: "Which bank?", body: "SBI, Union Bank, NABARD-linked Co-op banks give fastest approvals. Go to branch nearest to your village." },
      { emoji: "⏱️", title: "Timeline", body: "Application to disbursal: 7-14 working days. Collateral needed only above Rs1.6 lakh." },
      { emoji: "✅", title: "Repayment tip", body: "Repay within 12 months to get 3% interest subvention. Miss deadline = rate jumps to 7%. Set calendar reminder." },
    ],
  },
  {
    id: "7", slug: "pest-organic", tag: "Organic Farming",
    title: "5 organic sprays that actually work",
    cover_emoji: "🌿", cover_gradient: "from-lime-500 to-green-600",
    slides: [
      { emoji: "🧄", title: "Garlic-chilli spray", body: "Blend 250g garlic + 100g green chilli in 1L water. Dilute 1:10 and spray on aphids, thrips, mites. Works in 48 hrs." },
      { emoji: "🌿", title: "Neem oil", body: "3ml neem oil + 1ml soap per litre water. Spray every 7 days. Controls leaf miner, whitefly, mealy bug." },
      { emoji: "🥛", title: "Buttermilk spray", body: "500ml buttermilk in 10L water. Effective against powdery mildew on cucurbits and grapes." },
      { emoji: "🌱", title: "Beejamrutha", body: "5kg cow dung + 5L cow urine + 50g lime in 20L water. Soak seeds 6 hrs before sowing to prevent soil fungus." },
      { emoji: "🍂", title: "Jeevamrutha", body: "10kg cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour in 200L water. Ferment 3 days. Soil drench fortnightly." },
    ],
  },
  {
    id: "8", slug: "cold-storage", tag: "Post-Harvest",
    title: "Reduce post-harvest loss by 40%",
    cover_emoji: "❄️", cover_gradient: "from-sky-500 to-cyan-600",
    slides: [
      { emoji: "📊", title: "The problem", body: "India wastes 30-40% of fruits and vegetables post-harvest. Most loss happens in first 24 hrs after picking." },
      { emoji: "⏰", title: "Harvest at right time", body: "Pick tomatoes at mature green stage for transport, not red. Pick grapes before 10 AM. Avoid midday harvest." },
      { emoji: "📦", title: "Grade before packing", body: "Grade by size and ripeness. Damaged fruit spoils the whole crate. Use ventilated crates — not gunny bags." },
      { emoji: "❄️", title: "Pre-cooling pays", body: "Dip harvest in cold water (10-12C) for 30 min before storage. Removes field heat, extends shelf life by 3-5 days." },
      { emoji: "🚛", title: "Last-mile tip", body: "Wet gunny cloth over crates keeps produce cool during transit. For 100km+ use refrigerated van (Rs2,500/trip)." },
    ],
  },
  {
    id: "9", slug: "soil-health", tag: "Soil",
    title: "Read your soil test report — explained simply",
    cover_emoji: "🧪", cover_gradient: "from-amber-500 to-yellow-600",
    slides: [
      { emoji: "📋", title: "Get tested first", body: "Free soil testing at Agriculture office or Rs50 at private lab. Test every 2 years — soil changes with each crop." },
      { emoji: "🔢", title: "pH: most important number", body: "6.0–7.5 is ideal for most crops. Below 6 = add lime. Above 7.5 = add gypsum or sulphur. Wrong pH blocks nutrients." },
      { emoji: "🟢", title: "N-P-K explained", body: "N (Nitrogen) = leaf growth. P (Phosphorus) = root and flower. K (Potassium) = stem strength and disease resistance." },
      { emoji: "🔬", title: "Micronutrients", body: "Zinc deficiency is #1 problem in Telangana. White patches on young leaves = zinc. Spray zinc sulphate 0.5% to fix." },
      { emoji: "💰", title: "Save on fertiliser", body: "Test report tells exact dosage. Most farmers over-apply urea by 30%. Test = save Rs2,000-4,000 per acre per season." },
    ],
  },
  {
    id: "10", slug: "drone-farming", tag: "Technology",
    title: "Drone spraying — is it worth it?",
    cover_emoji: "🚁", cover_gradient: "from-slate-600 to-gray-800",
    slides: [
      { emoji: "⚡", title: "Speed advantage", body: "Drone covers 1 acre in 7-10 minutes vs 3-4 hours manually. For 10+ acre farms, ROI is positive in first season." },
      { emoji: "💰", title: "Cost in Telangana", body: "Rs400-600 per acre for drone spraying service. Manual labour + chemical = Rs700-900 per acre. Net saving: Rs200-300/acre." },
      { emoji: "🎯", title: "Precision matters", body: "Drones reduce chemical use by 25-30% — sprays exactly where needed. Less chemical = lower residue = better price in market." },
      { emoji: "📋", title: "What to check", body: "Verify DGCA certification of operator. Check nozzle type (flat fan for insecticide, atomiser for fungicide). Confirm battery backup." },
      { emoji: "📱", title: "Book on Jeevadhara", body: "Use Service Hub on Jeevadhara to find certified drone operators near you. Compare prices, read ratings, book directly." },
    ],
  },
  {
    id: "11", slug: "millet-farming", tag: "Crops",
    title: "Millets — the drought-proof crop comeback",
    cover_emoji: "🌾", cover_gradient: "from-orange-500 to-amber-600",
    slides: [
      { emoji: "🌡️", title: "Why millets now", body: "Jowar, bajra and ragi need 40-50% less water than paddy. With irregular monsoon, millets are the smart hedge crop." },
      { emoji: "💵", title: "Price premium", body: "Organic millets fetch Rs60-120/kg vs Rs20-30 for paddy. Urban health food demand is doubling every year." },
      { emoji: "🌱", title: "Easy to grow", body: "Millets need minimal inputs — no pesticide, low fertiliser. Ideal for rainfed conditions in Telangana interiors." },
      { emoji: "🏛️", title: "Govt support", body: "Telangana gives Rs5,000/acre bonus for millet cultivation under Millets Mission. Register at your mandal office." },
      { emoji: "📦", title: "Where to sell", body: "TRIFED and ITC eChoupal buy at MSP. FPO aggregation gets 20% better price. Direct online = 2x farm gate rate." },
    ],
  },
  {
    id: "12", slug: "farmer-producer-org", tag: "FPO",
    title: "Start an FPO — Rs15 lakh grant available",
    cover_emoji: "🤝", cover_gradient: "from-teal-500 to-emerald-700",
    slides: [
      { emoji: "❓", title: "What is an FPO?", body: "Farmer Producer Organisation = farmers own a company together. 10-500 farmers pool together to buy inputs cheap and sell produce at better price." },
      { emoji: "💰", title: "Rs15 lakh grant", body: "Govt gives Rs15 lakh equity grant + Rs2 Cr credit guarantee to every registered FPO. No repayment needed for the grant." },
      { emoji: "📋", title: "How to register", body: "Min 10 farmers. Register as Producer Company under Companies Act. Contact NABARD or SFAC office in your district." },
      { emoji: "📈", title: "Real numbers", body: "FPOs save 15-20% on seeds, fertiliser and pesticide. Sell collectively for 10-25% better price. Break-even in Year 2." },
      { emoji: "📞", title: "Get help", body: "Call NABARD helpline 1800 200 0101. They assign a Business Development Service provider free of cost to help you start." },
    ],
  },
];

const GRADIENTS: Record<string, string> = {
  "from-red-500 to-orange-500": "from-red-500 to-orange-500",
  "from-emerald-500 to-teal-600": "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600": "from-blue-500 to-indigo-600",
  "from-green-500 to-emerald-600": "from-green-500 to-emerald-600",
  "from-cyan-500 to-blue-600": "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-700": "from-violet-500 to-purple-700",
  "from-lime-500 to-green-600": "from-lime-500 to-green-600",
  "from-sky-500 to-cyan-600": "from-sky-500 to-cyan-600",
  "from-amber-500 to-yellow-600": "from-amber-500 to-yellow-600",
  "from-slate-600 to-gray-800": "from-slate-600 to-gray-800",
  "from-orange-500 to-amber-600": "from-orange-500 to-amber-600",
  "from-teal-500 to-emerald-700": "from-teal-500 to-emerald-700",
};

const TAG_COLORS: Record<string, string> = {
  "Horticulture": "bg-red-100 text-red-700",
  "Schemes": "bg-emerald-100 text-emerald-700",
  "Seasonal": "bg-blue-100 text-blue-700",
  "Telangana": "bg-green-100 text-green-700",
  "Technology": "bg-purple-100 text-purple-700",
  "Finance": "bg-violet-100 text-violet-700",
  "Organic Farming": "bg-lime-100 text-lime-700",
  "Post-Harvest": "bg-cyan-100 text-cyan-700",
  "Soil": "bg-amber-100 text-amber-700",
  "Crops": "bg-orange-100 text-orange-700",
  "FPO": "bg-teal-100 text-teal-700",
};

export default function WebStoriesPage() {
  const [active, setActive] = useState<Story | null>(null);
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState("All");

  const tags = ["All", ...Array.from(new Set(STORIES.map(s => s.tag)))];
  const visible = filter === "All" ? STORIES : STORIES.filter(s => s.tag === filter);

  function openStory(s: Story) { setActive(s); setSlide(0); }
  function next() {
    if (active && slide < active.slides.length - 1) setSlide(i => i + 1);
    else close();
  }
  function prev() { if (slide > 0) setSlide(i => i - 1); }
  function close() { setActive(null); setSlide(0); }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="px-4 pt-8 pb-5 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Kisan Web Stories</h1>
        <p className="text-gray-400 text-sm">Quick farm tips in story format — tap to read in under 2 minutes</p>

        {/* Tag filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {tags.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filter === t ? "bg-white text-gray-900" : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Story grid — Instagram-style cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visible.map(s => (
            <button key={s.id} onClick={() => openStory(s)}
              className={`bg-gradient-to-br ${GRADIENTS[s.cover_gradient] ?? "from-green-500 to-teal-600"} rounded-2xl overflow-hidden text-left group hover:scale-[1.02] transition-transform shadow-lg`}
              style={{ aspectRatio: "9/16" }}>
              {/* Top: tag */}
              <div className="p-3 pt-4">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[s.tag] ?? "bg-white/20 text-white"}`}>
                  {s.tag}
                </span>
              </div>

              {/* Middle: emoji */}
              <div className="flex-1 flex items-center justify-center py-4">
                <span className="text-6xl drop-shadow-lg">{s.cover_emoji}</span>
              </div>

              {/* Bottom: title + slide count */}
              <div className="p-3 pb-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-bold text-sm leading-tight">{s.title}</p>
                <p className="text-white/60 text-xs mt-1">{s.slides.length} slides</p>
                {/* Progress dots preview */}
                <div className="flex gap-1 mt-2">
                  {s.slides.map((_, i) => (
                    <div key={i} className="h-0.5 flex-1 rounded-full bg-white/40" />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          {visible.length} stories &middot; Updated weekly by Jeevadhara agri team
        </p>
      </div>

      {/* Story viewer modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}>
          <div
            className={`relative bg-gradient-to-br ${GRADIENTS[active.cover_gradient] ?? "from-green-500 to-teal-600"} w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl`}
            style={{ height: "85vh", maxHeight: 700 }}
            onClick={e => e.stopPropagation()}>

            {/* Progress bar */}
            <div className="flex gap-1.5 p-4 pb-2">
              {active.slides.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/30">
                  <div className={`h-full rounded-full bg-white transition-all duration-300 ${
                    i < slide ? "w-full" : i === slide ? "w-full animate-pulse" : "w-0"
                  }`} />
                </div>
              ))}
            </div>

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">J</div>
                <div>
                  <p className="text-white text-xs font-semibold">Jeevadhara</p>
                  <p className="text-white/60 text-[10px]">{active.tag}</p>
                </div>
              </div>
              <button onClick={close} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            {/* Slide content */}
            <div className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
              {active.slides[slide].emoji && (
                <p className="text-5xl mb-3 drop-shadow">{active.slides[slide].emoji}</p>
              )}
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                {slide + 1} of {active.slides.length}
              </p>
              <h2 className="text-white text-xl font-bold leading-tight mb-2">
                {active.slides[slide].title}
              </h2>
              <p className="text-white/90 text-sm leading-relaxed">
                {active.slides[slide].body}
              </p>
            </div>

            {/* Tap zones */}
            <div className="absolute inset-0 flex" style={{ top: 80 }}>
              <div className="w-1/3 h-full cursor-pointer" onClick={prev} />
              <div className="w-1/3 h-full" />
              <div className="w-1/3 h-full cursor-pointer" onClick={next} />
            </div>

            {/* Nav buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <button onClick={prev} disabled={slide === 0}
                className="flex-1 py-2.5 bg-white/20 text-white rounded-xl text-sm font-medium disabled:opacity-30 backdrop-blur">
                Prev
              </button>
              <button onClick={next}
                className="flex-1 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold">
                {slide === active.slides.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
