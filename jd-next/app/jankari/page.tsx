"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Phone, ExternalLink, FileCheck2, Leaf, TestTube2, Home, Stethoscope,
  GraduationCap, CheckCircle2, IndianRupee, MapPin, Calendar, CalendarDays,
  FlaskConical, Sprout, CloudSun, Thermometer, Wind, X, Bell,
} from "lucide-react";

type TabId = "news" | "farm-visit" | "soil-test" | "workshops" | "schemes" | "crop-guides";

const TABS: { id: TabId; label: string; emoji: string; desc: string; tint: string }[] = [
  { id: "news",        label: "News & Advisories",    emoji: "📰", desc: "Latest agri advisories & field news",    tint: "bg-orange-100 text-orange-700" },
  { id: "farm-visit",  label: "Farm Visit",           emoji: "🏡", desc: "An expert visits your farm",            tint: "bg-green-100 text-green-700"  },
  { id: "soil-test",   label: "Soil Test",            emoji: "🧪", desc: "Door-step soil testing",               tint: "bg-amber-100 text-amber-700"  },
  { id: "workshops",   label: "Workshops & Training", emoji: "🎓", desc: "Free govt training programmes",        tint: "bg-sky-100 text-sky-700"      },
  { id: "schemes",     label: "Govt Schemes",         emoji: "📋", desc: "Subsidies & benefits you qualify for", tint: "bg-violet-100 text-violet-700"},
  { id: "crop-guides", label: "Crop Guides",          emoji: "🌾", desc: "Best crop for your season & water",    tint: "bg-lime-100 text-lime-700"    },
];

const AGRI_NEWS = [
  { id: "awd",    urgent: true,  tag: "Water Advisory",   tagColor: "bg-sky-100 text-sky-700",     icon: "💧",
    headline: "Switch to AWD for paddy — save 30% water with zero yield loss",
    summary: "ICAR now officially recommends Alternate Wetting & Drying (AWD) for paddy. Let water drop 15 cm below soil surface, then re-flood to 5 cm. Saves 15–30% water.",
    highlight: "Use a pani pipe to monitor soil water level. Save up to 936 m³/acre/season.",
    source: "IRRI / ICAR", sourceUrl: "http://www.knowledgebank.irri.org/training/fact-sheets/water-management/saving-water-alternate-wetting-drying-awd" },
  { id: "kusum",  urgent: true,  tag: "Govt Scheme",      tagColor: "bg-yellow-100 text-yellow-700", icon: "☀️",
    headline: "PM-KUSUM: 60–90% subsidy on solar pumps — apply before Kharif deadline",
    summary: "PM-KUSUM provides solar pumps at 60–90% subsidy through TSREDCO for Telangana farmers. Saves ₹40,000–60,000/year versus diesel for a 5 HP pump.",
    highlight: "Apply before June 30 for Kharif season installation.",
    source: "MoAFW / TSREDCO", sourceUrl: "https://pmkusum.mnre.gov.in" },
  { id: "pranam", urgent: false, tag: "Soil Health",      tagColor: "bg-green-100 text-green-700",  icon: "🌱",
    headline: "PM-PRANAM: Cut chemical fertiliser use — earn state incentives",
    summary: "States that reduce chemical fertiliser consumption share saved subsidies under PM-PRANAM. Farmers switching to nano urea and bio-fertilisers gain yield improvement of 20–30%.",
    highlight: "Nano Urea bottle (500ml) replaces one 45 kg urea bag — spray via drone for best results.",
    source: "Ministry of Chemicals & Fertilisers", sourceUrl: "https://www.ibef.org/government-schemes/pm-pranam" },
  { id: "drone",  urgent: false, tag: "Technology",       tagColor: "bg-violet-100 text-violet-700", icon: "🚁",
    headline: "Namo Drone Didi: Rent a drone from women SHGs — Rs350/acre spraying",
    summary: "15,000 women SHGs receive Kisan Drones under Namo Drone Didi. Farmers can rent for nano-fertiliser spray and pesticide application at Rs350–400/acre.",
    highlight: "Contact your nearest KVK or PM Kisan Samriddhi Kendra to find the nearest drone didi.",
    source: "PIB / Ministry of Agriculture", sourceUrl: "https://pib.gov.in" },
  { id: "nf",     urgent: false, tag: "Farming Practice", tagColor: "bg-lime-100 text-lime-700",     icon: "🪱",
    headline: "National Mission on Natural Farming: Zero-input certified farming earns 40% premium",
    summary: "NMNF promotes Jeevamrit, Beejamrit and mulching to eliminate chemical inputs. Natural farming certified produce earns 20–40% price premium in urban markets.",
    highlight: "Apply for CETARA-NF certification through your KVK — free for the first 2 acres.",
    source: "Ministry of Agriculture", sourceUrl: "https://www.drishtiias.com/daily-updates/daily-news-editorials/india-s-push-for-natural-farming" },
  { id: "enam",   urgent: false, tag: "Market Access",    tagColor: "bg-emerald-100 text-emerald-700", icon: "🏪",
    headline: "e-NAM: Sell directly to buyers across India — skip the local mandi middleman",
    summary: "e-NAM covers 1,361 mandis in 23 states. Farmers and FPOs can list produce, get bids from across India and receive payment directly. Trade hit Rs2.8 lakh crore in 2024–25.",
    highlight: "Register at enam.gov.in with land records and Aadhaar — listing is free.",
    source: "eNAM / Ministry of Agriculture", sourceUrl: "https://enam.gov.in" },
];

const STATIC_SCHEMES = [
  { id: "pmkisan",  category: "Direct Benefit", title: "PM-KISAN",    summary: "Rs6,000/year direct cash transfer to small and marginal farmers in 3 equal instalments.", eligibility: "Land-holding farmers with cultivable land < 2 ha", benefit: "Rs6,000/year cash + Kisan Credit Card eligibility", link: "https://pmkisan.gov.in" },
  { id: "pmfby",   category: "Insurance",       title: "PMFBY — Crop Insurance", summary: "1.5–2% premium for kharif/rabi crops. Claims settled within 60 days of crop loss.", eligibility: "All farmers growing notified crops", benefit: "Sum insured up to Rs50,000+; 1.5% premium for kharif", link: "https://pmfby.gov.in" },
  { id: "pmksy",   category: "Irrigation",      title: "PMKSY — Drip Subsidy (90%)", summary: "Per-drop-more-crop micro-irrigation subsidy through state horticulture department.", eligibility: "Small and marginal farmers; 90% subsidy for SC/ST", benefit: "Up to 90% subsidy on drip/sprinkler system cost", link: "https://pmksy.gov.in" },
  { id: "midh",    category: "Horticulture",    title: "MIDH — Polyhouse & Nursery", summary: "50% subsidy for polyhouse, shade-net structure, nursery and cold-storage under MIDH.", eligibility: "Individual farmers, FPOs, cooperatives", benefit: "50% capital subsidy capped at Rs112/sqm for polyhouse", link: "https://midh.gov.in" },
  { id: "aif",     category: "Finance",         title: "Agriculture Infrastructure Fund", summary: "Rs1 Cr loan at 3% interest subvention for cold-store, warehouse, primary processing.", eligibility: "Farmers, FPOs, startups, PACs, agri-entrepreneurs", benefit: "3% interest subvention + 25% credit guarantee cover", link: "https://agriinfra.dac.gov.in" },
];

const STATIC_WORKSHOPS = [
  { id: "bk1",   topic: "Beekeeping",            title: "Honey Bee Farming — Beginners Workshop", organizer: "National Bee Board, Govt of India", start_date: "2026-07-10", end_date: "2026-07-12", city: "Hyderabad", state: "Telangana", is_free: true,  contact_phone: "1800 180 1551", registration_url: "https://nbb.gov.in" },
  { id: "ms1",   topic: "Mushroom Cultivation",  title: "Oyster & Button Mushroom Production",    organizer: "KVK Warangal",                      start_date: "2026-07-15", end_date: "2026-07-16", city: "Warangal",  state: "Telangana", is_free: true,  contact_phone: "+91 94400 11223", registration_url: null },
  { id: "dp1",   topic: "Dairy & Livestock",     title: "Scientific Dairy Farm Management",       organizer: "MANAGE Hyderabad",                  start_date: "2026-07-20", end_date: "2026-07-22", city: "Hyderabad", state: "Telangana", is_free: false, contact_phone: "+91 40 2401 5352", registration_url: "https://manage.gov.in" },
  { id: "or1",   topic: "Organic Farming",       title: "Natural Farming — Jeevamrit & Zero Budget", organizer: "KVK Nizamabad",                  start_date: "2026-07-25", end_date: "2026-07-25", city: "Nizamabad", state: "Telangana", is_free: true,  contact_phone: "+91 94900 12345", registration_url: null },
  { id: "hy1",   topic: "Hydroponics",           title: "Introduction to Hydroponic Farming",     organizer: "PJTSAU Hyderabad",                  start_date: "2026-08-01", end_date: "2026-08-02", city: "Hyderabad", state: "Telangana", is_free: false, contact_phone: "+91 40 2401 0101", registration_url: "https://pjtsau.edu.in" },
  { id: "dr1",   topic: "Drone Technology",      title: "Agri-Drone Spraying & DGCA Certification", organizer: "Garuda Aerospace",               start_date: "2026-08-05", end_date: "2026-08-07", city: "Hyderabad", state: "Telangana", is_free: false, contact_phone: "+91 90000 11234", registration_url: "https://garudaaerospace.com" },
];

const SEASONS = ["Kharif (Jun-Oct)", "Rabi (Oct-Mar)", "Zaid (Mar-Jun)"] as const;
const WATER   = ["Low / rain-fed", "Medium", "High / irrigated"] as const;

const CROP_MAP: Record<string, Record<string, string[]>> = {
  "Kharif (Jun-Oct)": {
    "Low / rain-fed": ["Bajra (pearl millet)", "Jowar (sorghum)", "Moong", "Castor", "Groundnut"],
    "Medium":         ["Cotton", "Soybean", "Maize", "Tur (pigeon pea)", "Sesame"],
    "High / irrigated": ["Paddy (rice)", "Sugarcane", "Hybrid maize", "Turmeric", "Banana"],
  },
  "Rabi (Oct-Mar)": {
    "Low / rain-fed": ["Chickpea (chana)", "Mustard", "Safflower", "Lentil (masoor)", "Barley"],
    "Medium":         ["Wheat", "Mustard", "Chickpea", "Coriander", "Onion"],
    "High / irrigated": ["Wheat (irrigated)", "Potato", "Garlic", "Cumin", "Vegetables"],
  },
  "Zaid (Mar-Jun)": {
    "Low / rain-fed": ["Moong", "Cowpea", "Fodder sorghum"],
    "Medium":         ["Watermelon", "Muskmelon", "Cucumber", "Sunflower"],
    "High / irrigated": ["Summer paddy", "Vegetables", "Maize (sweet corn)", "Okra"],
  },
};

function fmtDate(s: string) {
  try { return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return s; }
}

const PACKAGES = [
  { id: "basic",    name: "Basic NPK",            price: 299,  duration: "3 days", params: 5,
    includes: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "pH level", "Organic carbon"],
    best: "Quick health check before sowing" },
  { id: "advanced", name: "Advanced 12-Parameter", price: 699,  duration: "5 days", params: 12,
    includes: ["All Basic NPK tests", "Sulphur, Zinc, Iron, Copper", "Manganese, Boron", "Electrical conductivity (EC)", "Soil texture analysis", "Crop-specific recommendations"],
    best: "Most popular — for serious farmers", recommended: true },
  { id: "premium",  name: "Premium + Advisory",   price: 1499, duration: "7 days", params: 18,
    includes: ["All Advanced tests", "Heavy metal screening", "Microbial activity index", "Custom fertilizer plan", "1-on-1 agronomist call (30 min)", "Re-test after 6 months (50% off)"],
    best: "Commercial farms & organic certification" },
];

// ─── Sub-panels ──────────────────────────────────────────────────────────────

function NewsPanel() {
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("vet");
  const [problem, setProblem] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Advisories & Agri News</h2>
          <p className="mt-1 text-sm text-gray-500">What ICAR and the government say farmers should act on right now.</p>
        </div>
        <button onClick={() => setModal(true)}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-semibold text-white shadow hover:bg-green-800">
          <Phone className="h-4 w-4" /> Find an Expert — Call Me
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {AGRI_NEWS.map(n => (
          <article key={n.id} className={"relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md " + (n.urgent ? "border-orange-300" : "border-gray-200")}>
            {n.urgent && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                <Bell className="h-3 w-3" /> Act now
              </span>
            )}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{n.icon}</span>
              <div className="flex-1">
                <span className={"inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " + n.tagColor}>{n.tag}</span>
                <h3 className="mt-1.5 text-base font-bold leading-snug text-gray-900">{n.headline}</h3>
                <p className="mt-2 text-sm text-gray-500">{n.summary}</p>
                <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-800">💡 {n.highlight}</div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">Source: {n.source}</p>
                  <a href={n.sourceUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline">
                    Read more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <button onClick={() => { setModal(false); setDone(false); }} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
            {done ? (
              <div className="py-6 text-center">
                <span className="text-5xl">✅</span>
                <h3 className="mt-4 text-xl font-bold">Request received!</h3>
                <p className="mt-2 text-sm text-gray-500">Our expert will call you on <strong>{phone}</strong> within 2 hours.</p>
                <p className="mt-1 text-sm text-gray-500">Or call directly: <a href="tel:18001801551" className="font-bold text-green-700">1800-180-1551</a></p>
                <button onClick={() => { setModal(false); setDone(false); }}
                  className="mt-5 inline-flex h-10 items-center rounded-lg bg-green-700 px-5 text-sm font-semibold text-white">Close</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold">Book an Expert Call</h3>
                <p className="mt-1 text-sm text-gray-500">Fill in details — we call you and book the slot.</p>
                <p className="mt-1 text-sm">Kisan helpline: <a href="tel:18001801551" className="font-bold text-green-700">1800-180-1551</a> (free)</p>
                <form onSubmit={submit} className="mt-5 grid gap-4">
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number"
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                  <select value={type} onChange={e => setType(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white">
                    <option value="vet">🐄 Veterinary Doctor</option>
                    <option value="horti">🍅 Horticulture Expert</option>
                    <option value="soil">🧪 Soil & Fertiliser Advisor</option>
                    <option value="fish">🐟 Fish Farming Expert</option>
                    <option value="agronomy">🌾 Crop & Season Advisor</option>
                    <option value="other">📋 Other</option>
                  </select>
                  <textarea value={problem} onChange={e => setProblem(e.target.value)} rows={3}
                    placeholder="Describe your problem (optional)..."
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
                  <button type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-green-700 text-sm font-semibold text-white shadow hover:bg-green-800">
                    <Phone className="h-4 w-4" /> Call me back
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FarmVisitPanel() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [type, setType] = useState("Crop / soil inspection");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setDone(true); }, 800);
  }

  if (done) return (
    <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
      <span className="text-5xl">✅</span>
      <h3 className="mt-4 text-xl font-bold text-green-900">Farm visit requested!</h3>
      <p className="mt-2 text-sm text-gray-600">Our nearest expert will call <strong>{phone}</strong> to confirm the schedule within 4 hours.</p>
      <button onClick={() => setDone(false)} className="mt-5 inline-flex h-10 items-center rounded-lg border border-green-300 bg-white px-5 text-sm font-semibold text-green-700 hover:bg-green-50">
        Book another visit
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Book a farm visit</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl">Some problems need eyes on the field. Request a visit and the nearest expert comes to your farm, inspects on-site and gives a written action plan.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Stethoscope, t: "Livestock check-up", s: "Cattle, goat, poultry health on-site" },
            { icon: Leaf, t: "Crop & pest scouting", s: "Disease, pest and nutrient diagnosis" },
            { icon: FlaskConical, t: "Soil sampling", s: "Collect samples for the lab" },
            { icon: Sprout, t: "Plantation planning", s: "Layout, spacing & variety advice" },
          ].map(c => (
            <div key={c.t} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <c.icon className="h-5 w-5 text-green-700" />
              <p className="mt-2 text-sm font-semibold text-gray-900">{c.t}</p>
              <p className="text-xs text-gray-500">{c.s}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 text-sm">
            <label className="font-medium text-gray-700">Full name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label className="font-medium text-gray-700">Mobile *</label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label className="font-medium text-gray-700">Village / Town *</label>
            <input required value={village} onChange={e => setVillage(e.target.value)} placeholder="Your village"
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label className="font-medium text-gray-700">Visit type</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white">
              <option>Crop / soil inspection</option>
              <option>Livestock check-up</option>
              <option>Pest & disease diagnosis</option>
              <option>Plantation planning</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <label className="font-medium text-gray-700 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Preferred date *</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <label className="font-medium text-gray-700">Describe your problem</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g. yellowing leaves in cotton, cow not eating..."
              className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
          <button type="submit" disabled={saving}
            className="sm:col-span-2 inline-flex h-12 items-center justify-center rounded-lg bg-green-700 text-sm font-semibold text-white shadow hover:bg-green-800 disabled:opacity-60 transition">
            {saving ? "Requesting..." : "Request farm visit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SoilTestPanel() {
  const [pkg, setPkg] = useState("advanced");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");
  const [crop, setCrop] = useState("");
  const [acres, setAcres] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const selected = PACKAGES.find(p => p.id === pkg)!;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setDone(true); }, 800);
  }

  if (done) return (
    <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
      <span className="text-5xl">✅</span>
      <h3 className="mt-4 text-xl font-bold text-green-900">Soil test booked!</h3>
      <p className="mt-2 text-sm text-gray-600">Our team will call <strong>{phone}</strong> to schedule sample pickup.</p>
      <button onClick={() => setDone(false)} className="mt-5 inline-flex h-10 items-center rounded-lg border border-green-300 bg-white px-5 text-sm font-semibold text-green-700">
        Book another test
      </button>
    </div>
  );

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 mb-3">
        <TestTube2 className="h-3.5 w-3.5" /> Door-step collection · NABL-accredited lab
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Book a soil test</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl">Know exactly what your soil needs — NPK, micronutrients, pH and tailored crop recommendations, without leaving your farm.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-2xl">
        {[{ icon: MapPin, t: "We collect", s: "Door-step" }, { icon: FlaskConical, t: "We test", s: "NABL lab" }, { icon: Sprout, t: "We advise", s: "Crop plan" }].map(s => (
          <div key={s.t} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <s.icon className="mx-auto h-5 w-5 text-green-700" />
            <p className="mt-1 text-sm font-semibold text-gray-900">{s.t}</p>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">{s.s}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PACKAGES.map(p => (
          <button key={p.id} type="button" onClick={() => setPkg(p.id)}
            className={"relative flex flex-col rounded-2xl border-2 p-5 text-left transition " + (pkg === p.id ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 bg-white hover:border-green-300")}>
            {p.recommended && (
              <span className="absolute -top-3 left-5 rounded-full bg-amber-400 px-3 py-0.5 text-[10px] font-bold uppercase text-amber-900">Most popular</span>
            )}
            <p className="font-bold text-lg text-gray-900">{p.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{p.best}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-green-700" />
              <span className="text-3xl font-bold text-green-700">{p.price}</span>
              <span className="text-xs text-gray-400">/ sample</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{p.params} parameters · report in {p.duration}</p>
            <ul className="mt-3 space-y-1">
              {p.includes.map(b => (
                <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />{b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        {[["Full name", name, setName, "text", true, "Your name"], ["Mobile number", phone, setPhone, "tel", true, "9876543210"], ["Village / Town", village, setVillage, "text", true, "Your village"], ["Pincode", pincode, setPincode, "text", true, "500001"]].map(([label, val, setter, type, req, ph]) => (
          <div key={label as string} className="flex flex-col gap-1.5 text-sm">
            <label className="font-medium text-gray-700">{label as string}{req ? " *" : ""}</label>
            <input type={type as string} required={!!req} value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string}
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
          </div>
        ))}
        <div className="flex flex-col gap-1.5 text-sm">
          <label className="font-medium text-gray-700">Crop you plan to grow</label>
          <input value={crop} onChange={e => setCrop(e.target.value)} placeholder="e.g. Cotton, Paddy, Tomato"
            className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <label className="font-medium text-gray-700">Land size (acres)</label>
          <input type="number" value={acres} onChange={e => setAcres(e.target.value)} placeholder="e.g. 2.5"
            className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
        </div>
        <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <label className="font-medium text-gray-700 flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Preferred pickup date *</label>
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
            className="h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200" />
        </div>
        <div className="sm:col-span-2 rounded-xl bg-green-50 border border-green-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{selected.name}</p>
            <p className="text-xs text-gray-500">Pay on collection. Cash or UPI accepted.</p>
          </div>
          <p className="text-2xl font-bold text-green-700">Rs{selected.price}</p>
        </div>
        <button type="submit" disabled={saving}
          className="sm:col-span-2 inline-flex h-12 items-center justify-center rounded-lg bg-green-700 text-sm font-semibold text-white shadow hover:bg-green-800 disabled:opacity-60 transition">
          {saving ? "Confirming..." : "Confirm booking · Rs" + selected.price}
        </button>
      </form>
    </div>
  );
}

function WorkshopsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Workshops & Training</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl">Government training programmes, beekeeping, livestock, mushroom and organic farming workshops.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {STATIC_WORKSHOPS.map(w => (
          <article key={w.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800">{w.topic}</p>
                {w.is_free && <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">Free</span>}
              </div>
              <h3 className="mt-2 font-bold text-lg text-gray-900">{w.title}</h3>
              {w.organizer && <p className="mt-1 text-sm text-gray-600">{w.organizer}</p>}
            </div>
            <div className="space-y-2 p-5">
              <p className="flex items-center gap-2 text-sm text-gray-600"><CalendarDays className="h-4 w-4 text-gray-400" />{fmtDate(w.start_date)}{w.end_date !== w.start_date ? " – " + fmtDate(w.end_date) : ""}</p>
              <p className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4 text-gray-400" />{w.city}, {w.state}</p>
              <p className="flex items-center gap-2 text-sm text-gray-600"><Phone className="h-4 w-4 text-gray-400" />
                <a href={"tel:" + w.contact_phone} className="text-green-700 hover:underline">{w.contact_phone}</a>
              </p>
              {w.registration_url && (
                <a href={w.registration_url} target="_blank" rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
                  Register <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SchemesPanel() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Government Schemes & Subsidies</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl">Subsidies, insurance and benefit schemes you may be eligible for.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {STATIC_SCHEMES.map(s => (
          <article key={s.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">{s.category}</p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">{s.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{s.summary}</p>
            <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <div><p className="font-semibold text-gray-700">Eligibility</p><p className="text-gray-500">{s.eligibility}</p></div>
              <div><p className="font-semibold text-gray-700">Benefit</p><p className="text-green-700">{s.benefit}</p></div>
            </div>
            <a href={s.link} target="_blank" rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline">
              Apply / Learn more <ExternalLink className="h-3 w-3" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function CropGuidesPanel() {
  const [season, setSeason] = useState<(typeof SEASONS)[number]>(SEASONS[0]);
  const [water, setWater] = useState<(typeof WATER)[number]>(WATER[0]);
  const crops = useMemo(() => CROP_MAP[season]?.[water] ?? [], [season, water]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Season Crop Guides</h2>
      <p className="mt-1 text-sm text-gray-500 max-w-2xl">Pick your season and water availability — we suggest the best crops to grow.</p>
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Season</label>
            <select value={season} onChange={e => setSeason(e.target.value as typeof season)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white">
              {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Water availability</label>
            <select value={water} onChange={e => setWater(e.target.value as typeof water)}
              className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white">
              {WATER.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-900">Recommended crops for {season} · {water}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {crops.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800">
                <Leaf className="h-3.5 w-3.5" /> {c}
              </span>
            ))}
          </div>
        </div>
        <Link href="/services" className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-lg bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800">
          <Phone className="h-4 w-4" /> Get a tailored crop plan from an expert
        </Link>
      </div>
      <div className="mt-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-amber-50 p-6">
        <p className="font-bold text-lg text-gray-900">Want quick visual tips?</p>
        <p className="mt-1 text-sm text-gray-600">Swipe through farming web stories for snackable knowledge.</p>
        <Link href="/web-stories" className="mt-4 inline-flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800">
          Open Field Stories →
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JankariPage() {
  const [tab, setTab] = useState<TabId>("news");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-100 via-sky-50 to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-5xl">🧑‍🌾</span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Kisan Expert Desk</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Knowledge and guidance in one place — talk to a vet or agronomist, book a soil test or farm visit,
            join workshops, browse government schemes and season-wise crop guides.
          </p>
          <p className="mt-3">
            <a href="tel:18001801551" className="inline-flex h-10 items-center gap-2 rounded-lg bg-green-700 px-4 text-sm font-semibold text-white shadow hover:bg-green-800">
              <Phone className="h-4 w-4" /> Kisan Call Centre: 1800-180-1551 (free)
            </a>
          </p>
        </div>
      </section>

      {/* Climate Advisory */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
          <div className="flex items-start gap-3 border-b border-orange-200 bg-orange-100/60 px-6 py-4">
            <CloudSun className="mt-0.5 h-6 w-6 text-orange-700" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-800">Climate advisory · updated this season</p>
              <h2 className="text-2xl font-bold text-gray-900">El Nino / La Nina outlook for Indian farmers</h2>
            </div>
          </div>
          <div className="grid gap-6 px-6 py-6 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-rose-700 mb-1"><Thermometer className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-wider">El Nino years</p></div>
              <p className="text-sm text-gray-600">Weaker monsoon, longer dry spells, heat-stress in livestock. Risk to kharif paddy, sugarcane, soybean.</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-600">
                <li>Prefer <strong>millets</strong> (ragi, jowar, bajra) over water-hungry paddy.</li>
                <li>Mulch and use drip irrigation — save 40% water.</li>
                <li>Shade-net for vegetables; cool drinking water for cattle.</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sky-700 mb-1"><Wind className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-wider">La Nina years</p></div>
              <p className="text-sm text-gray-600">Above-normal rainfall, flood risk in east India. Good for kharif paddy and groundwater recharge.</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-gray-600">
                <li>Raised-bed cultivation, drainage channels and PMFBY insurance before sowing.</li>
                <li>Flood-tolerant paddy: Sambha Mahsuri sub-1.</li>
                <li>Fungicide rounds for blast, blight in humid weeks.</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-700 mb-1"><Stethoscope className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-wider">Talk to an expert</p></div>
              <p className="text-sm text-gray-600">Book a vet, horticulture specialist, fish-farming or sericulture expert — video or on-farm visit.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/services" className="inline-flex h-9 items-center rounded-lg bg-gray-900 px-3 text-xs font-semibold text-white hover:bg-gray-700">Find an expert</Link>
                <a href="tel:18001801551" className="inline-flex h-9 items-center rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:border-green-500 hover:text-green-700">Kisan helpline</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab buttons */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={"flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md " + (tab === tb.id ? "border-green-600 bg-green-50 shadow-md" : "border-gray-200 bg-white shadow-sm")}>
              <span className={"grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg " + tb.tint}>{tb.emoji}</span>
              <span>
                <span className="block font-bold text-gray-900">{tb.label}</span>
                <span className="block text-xs text-gray-500">{tb.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Active panel */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === "news"        && <NewsPanel />}
        {tab === "farm-visit"  && <FarmVisitPanel />}
        {tab === "soil-test"   && <SoilTestPanel />}
        {tab === "workshops"   && <WorkshopsPanel />}
        {tab === "schemes"     && <SchemesPanel />}
        {tab === "crop-guides" && <CropGuidesPanel />}
      </section>
    </div>
  );
}
