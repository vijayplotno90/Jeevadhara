"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Landmark, Droplets, Shield, Warehouse, Sprout, Waves, Plane, Truck,
  FlaskConical, Stethoscope, Sun, HardHat, Wrench, Phone, ExternalLink,
  BookOpen, FileCheck2, Users, Camera, Bug, Leaf, Search,
} from "lucide-react";

type Provider = {
  name: string;
  desc: string;
  phone?: string;
  url?: string;
  city?: string;
};

type Category = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  blurb: string;
  providers: Provider[];
};

const CATEGORIES: Category[] = [
  {
    id: "finance", label: "Banking & Agri-Finance", icon: Landmark,
    tint: "bg-emerald-500/10 text-emerald-700",
    blurb: "Kisan Credit Card (KCC), crop loans, tractor loans, gold loan against produce and Mudra finance.",
    providers: [
      { name: "State Bank of India — Agri Desk", desc: "KCC up to Rs3 L at 4% interest, crop loan, tractor loan, FPO finance.", phone: "1800 1234", url: "https://sbi.co.in/web/agri-rural" },
      { name: "Union Bank of India — Krishi", desc: "Union Green Card, dairy loan, polyhouse loan up to Rs50 L.", phone: "1800 222 244", url: "https://unionbankofindia.co.in" },
      { name: "NABARD", desc: "FPO equity grant Rs15 L + Rs2 Cr credit guarantee. Refinance for all bank loans.", url: "https://nabard.org" },
      { name: "ICICI Bank — Agri Business", desc: "Working capital, warehouse receipt finance, e-NWR loans.", phone: "1860 120 7777", url: "https://icicibank.com" },
      { name: "HDFC Bank — Kisan Gold Card", desc: "Pre-approved farm-credit limit, fast disbursal in 48 hours.", phone: "1800 202 6161", url: "https://hdfcbank.com" },
      { name: "Bank of Baroda — Baroda Kisan", desc: "Crop loan, livestock loan, farm mechanisation loan.", phone: "1800 5800", url: "https://bankofbaroda.in" },
      { name: "Samunnati Financial Intermediation", desc: "Sector-focused NBFC for FPOs and agri-SMEs.", url: "https://samunnati.com" },
      { name: "Bharat Crop Insurance (PMFBY)", desc: "Govt-subsidised crop insurance — 1.5-2% premium for Rs50,000+ sum insured.", url: "https://pmfby.gov.in" },
    ],
  },
  {
    id: "borewell", label: "Borewells & Water", icon: Droplets,
    tint: "bg-sky-500/10 text-sky-700",
    blurb: "Borewell drilling, camera inspection, flushing, pump repair and recharge — quoted up-front per foot.",
    providers: [
      { name: "Sri Sai Borewells", desc: "4.5 & 6.5 inch rotary rigs, Rs110/ft. Camera inspection Rs2500/job.", phone: "+91 90100 11122", city: "Hyderabad" },
      { name: "Vetri Drillers", desc: "Tamil Nadu coverage, 800 ft capability, point-cartridge guarantee.", phone: "+91 94440 33445", city: "Coimbatore" },
      { name: "Aqua Borewell Services", desc: "Flushing, redevelopment, submersible pump install & repair.", phone: "+91 98480 76543", city: "Vijayawada" },
      { name: "Bhujal Recharge Tech", desc: "Rainwater harvesting & dry-borewell recharge structures.", phone: "+91 98765 12300", city: "Pune" },
    ],
  },
  {
    id: "fencing", label: "Fencing & Farm Security", icon: Shield,
    tint: "bg-amber-500/10 text-amber-700",
    blurb: "Solar fence, barbed/chain-link wire, pre-cast concrete posts, bio-fencing and CCTV for farm protection.",
    providers: [
      { name: "Krishi Solar Fencing", desc: "ISI energiser, galvanised wire, lifetime support. Rs85/running ft.", phone: "+91 90000 11221" },
      { name: "Tata Wiron — Galvanised Wire", desc: "Heavy-gauge barbed and chain-link wire, dealer network nationwide.", url: "https://tatawiron.com" },
      { name: "FarmEye CCTV", desc: "4-camera solar CCTV with mobile alerts. Rs35,000 turnkey.", phone: "+91 99888 76543" },
      { name: "GreenWall Bio-Fencing", desc: "Subabul, Glyricidia and Karonda live-fence saplings — bulk supply.", phone: "+91 89090 00112" },
    ],
  },
  {
    id: "polyhouse", label: "Polyhouse & Greenhouse", icon: Warehouse,
    tint: "bg-emerald-500/10 text-emerald-700",
    blurb: "Turnkey polyhouse, shade-net and naturally-ventilated greenhouse construction — with MIDH 50% subsidy paperwork.",
    providers: [
      { name: "Rivulis Polyhouse Solutions", desc: "GI structure, 200-micron film, fogging & cooling pads. Rs950/sq.m.", url: "https://rivulis.com" },
      { name: "Mahindra Agri Polyhouse", desc: "Turnkey 1000 sq.m kit + 3-yr crop advisory + buy-back tie-up.", phone: "1800 425 2424" },
      { name: "Netafim Greenhouse Engineering", desc: "Israeli-tech high-tech greenhouses for capsicum and cut-roses.", url: "https://netafim.com/en/in" },
    ],
  },
  {
    id: "hydroponics", label: "Hydroponics & Aquaponics", icon: Sprout,
    tint: "bg-lime-500/10 text-lime-700",
    blurb: "Soil-less farming design, installation, nutrient supply and 3-year support — for leafy greens, strawberry and exotic veg.",
    providers: [
      { name: "Future Farms Chennai", desc: "NFT, DWC and Dutch-bucket systems. India's largest hydroponics integrator.", url: "https://futurefarms.in" },
      { name: "BitMantis Aquaponics", desc: "Combined fish + leafy greens recirculating systems for FPOs.", phone: "+91 80 4670 1111" },
      { name: "Letcetra Agritec", desc: "Goa-based, exports microgreens to Mumbai 5-star hotels.", url: "https://letcetra.com" },
    ],
  },
  {
    id: "irrigation", label: "Drip & Sprinkler Irrigation", icon: Waves,
    tint: "bg-blue-500/10 text-blue-700",
    blurb: "Custom drip and sprinkler design with PMKSY 90% subsidy assistance. Per-acre quotes in 24 hours.",
    providers: [
      { name: "Jain Irrigation", desc: "World's #2 drip company. Full PMKSY paperwork support.", url: "https://jains.com" },
      { name: "Netafim India", desc: "Drip, fertigation and digital farming. 30-yr warranty on inline drip.", url: "https://netafim.com/en/in" },
      { name: "Captain Polyplast", desc: "Affordable sprinkler kits Rs18,000/acre after subsidy.", url: "https://captainpolyplast.com" },
    ],
  },
  {
    id: "drone", label: "Drone-as-a-Service", icon: Plane,
    tint: "bg-violet-500/10 text-violet-700",
    blurb: "Liquid fertiliser and pesticide spraying, NDVI crop-health mapping and field-area survey by DGCA-certified pilots.",
    providers: [
      { name: "Garuda Aerospace", desc: "Largest agri-drone fleet, Rs350/acre spraying with Kisan Drones.", url: "https://garudaaerospace.com" },
      { name: "IoTechWorld Avigation", desc: "Made-in-India Agribot drones, also runs DGCA pilot academy.", url: "https://iotechworld.com" },
      { name: "Dhaksha Unmanned Systems", desc: "Heavy-payload spraying drone, 25 L tank.", url: "https://dhaksha.com" },
    ],
  },
  {
    id: "logistics", label: "Cold-Chain & Logistics", icon: Truck,
    tint: "bg-cyan-500/10 text-cyan-700",
    blurb: "Reefer trucks, mini-trucks and tractor-trolley for farm-gate to mandi or city distribution.",
    providers: [
      { name: "Coldman Logistics", desc: "Pan-India reefer trucks for milk, flowers, mangoes and pharma.", url: "https://coldman.in" },
      { name: "ColdEX", desc: "Mumbai-Pune-Bengaluru cold-chain corridor with 2-8 degrees C maintenance.", url: "https://coldex.in" },
      { name: "Porter Krishi", desc: "On-demand mini-trucks within 50 km radius, app-booked.", url: "https://porter.in" },
    ],
  },
  {
    id: "labs", label: "Soil & Water Testing Labs", icon: FlaskConical,
    tint: "bg-orange-500/10 text-orange-700",
    blurb: "NABL-accredited labs for soil, water, leaf, fertiliser and pesticide-residue testing — reports in 7 days.",
    providers: [
      { name: "Jeevadhara Lab Network", desc: "Door-step pickup, 12-parameter soil card in 5 days. Rs350/sample.", phone: "+91 91234 56789" },
      { name: "SGS India", desc: "International NABL lab — soil, water and pesticide residue testing for export.", url: "https://sgs.com" },
      { name: "Krishi Vigyan Kendra Labs", desc: "Free or subsidised testing through 730+ KVKs nationwide.", url: "https://kvk.icar.gov.in" },
    ],
  },
  {
    id: "vet", label: "Veterinary & Livestock Services", icon: Stethoscope,
    tint: "bg-rose-500/10 text-rose-700",
    blurb: "Mobile vet visits, artificial insemination, vaccination, deworming and feed supply for cattle, goats, poultry and fish.",
    providers: [
      { name: "Mooofarm Vet On Call", desc: "App-booked vet visit, AI, vaccination — 200+ districts.", url: "https://mooofarm.com" },
      { name: "Stellapps SmartMoo", desc: "IoT milk-monitoring + vet tele-consult for dairy clusters.", url: "https://stellapps.com" },
      { name: "Vetina Healthcare", desc: "Vet medicines, mineral mixtures, AI semen straws — pan-India dealer network.", url: "https://vetina.com" },
    ],
  },
  {
    id: "solar", label: "Solar Pumps & Energy", icon: Sun,
    tint: "bg-yellow-500/10 text-yellow-700",
    blurb: "PM-KUSUM solar pumps, rooftop solar for warehouses, solar fencing and cold-rooms. 60-90% subsidy paperwork included.",
    providers: [
      { name: "Tata Power Solar", desc: "1-10 HP KUSUM solar pumps + 25-yr panel warranty.", url: "https://tatapowersolar.com" },
      { name: "Shakti Pumps", desc: "India's largest solar pump maker — empanelled under KUSUM in 23 states.", url: "https://shaktipumps.com" },
      { name: "Su-Kam Solar", desc: "Solar lighting, cold-room and inverter solutions for off-grid farms.", url: "https://su-kam.com" },
    ],
  },
  {
    id: "labour", label: "Labour & Skilling", icon: HardHat,
    tint: "bg-stone-500/10 text-stone-700",
    blurb: "Seasonal harvest labour gangs, drone-pilot certification, tractor driver training and Agri Skill Council certificates.",
    providers: [
      { name: "Krishify Labour Squad", desc: "Verified harvest gangs of 10-50, paddy/wheat/sugarcane.", phone: "+91 98000 12345" },
      { name: "MANAGE Hyderabad", desc: "Govt's nodal agri-management training institute.", url: "https://manage.gov.in" },
      { name: "Agri Skill Council of India", desc: "NSDC-recognised courses in 60+ agri job-roles.", url: "https://asci-india.com" },
    ],
  },
  {
    id: "cropguide", label: "Crop Guide & Agronomy", icon: BookOpen,
    tint: "bg-green-500/10 text-green-700",
    blurb: "Crop-wise playbooks, sowing-to-harvest calendars and pest & disease guides — written by KVK scientists.",
    providers: [
      { name: "ICAR Crop Production Guides", desc: "Free PDFs for 60+ crops — paddy, wheat, cotton, sugarcane, pulses, oilseeds.", url: "https://icar.org.in" },
      { name: "KrishiJagran Pocket Guides", desc: "Bilingual mobile-friendly crop guides with package-of-practices.", url: "https://krishijagran.com" },
      { name: "Jeevadhara Field Stories", desc: "Visual, swipe-through crop guides curated for Indian smallholders.", url: "/web-stories" },
      { name: "TNAU Agritech Portal", desc: "South-India-focused crop calendars, nutrient schedules and yield benchmarks.", url: "https://agritech.tnau.ac.in" },
    ],
  },
  {
    id: "schemes", label: "Govt Schemes & Subsidies", icon: FileCheck2,
    tint: "bg-emerald-500/10 text-emerald-700",
    blurb: "Apply for PM-KISAN, PMFBY, KCC, PMKSY drip subsidy, MIDH polyhouse subsidy and FPO grants — with paperwork help.",
    providers: [
      { name: "PM-KISAN", desc: "Rs6,000/yr direct benefit transfer to small & marginal farmers. Aadhaar-seeded a/c.", url: "https://pmkisan.gov.in" },
      { name: "PMFBY Crop Insurance", desc: "1.5-2% premium for kharif/rabi crops. Settle claims within 60 days.", url: "https://pmfby.gov.in" },
      { name: "PMKSY Drip 90% Subsidy", desc: "Per-drop-more-crop micro-irrigation subsidy. Apply via state horticulture dept.", url: "https://pmksy.gov.in" },
      { name: "MIDH Horticulture", desc: "50% subsidy for polyhouse, shade-net, nursery, cold-storage.", url: "https://midh.gov.in" },
      { name: "Agriculture Infrastructure Fund", desc: "Rs1 Cr loan at 3% interest for cold-store, warehouse, processing.", url: "https://agriinfra.dac.gov.in" },
    ],
  },
  {
    id: "visits", label: "Farm Visits & Expert Consults", icon: Users,
    tint: "bg-indigo-500/10 text-indigo-700",
    blurb: "Book a vet, horticulture expert, dairy/fish-farming specialist or agri-engineer for an on-farm visit or video consult.",
    providers: [
      { name: "Jeevadhara Expert Desk", desc: "Rs499 video call or Rs1500 on-farm visit. Vet, horti, soil, sericulture, fish.", phone: "+91 91234 56789" },
      { name: "iKisan Advisory", desc: "Dr. Reddy's Foundation rural advisory — soil health & nutrient plans.", url: "https://ikisan.com" },
      { name: "Kisan Call Centre", desc: "Govt's free, multilingual agronomy helpline — Mon-Sat 6 AM to 10 PM.", phone: "1800 180 1551" },
      { name: "KVK Network", desc: "730+ Krishi Vigyan Kendras for in-district scientist visits.", url: "https://kvk.icar.gov.in" },
    ],
  },
  {
    id: "rental", label: "JCB / Truck / Auto on Rent", icon: Truck,
    tint: "bg-orange-500/10 text-orange-700",
    blurb: "Daily-rent JCB backhoe, tractor with trolley, mini-truck, 1.5 T pickup or auto-carrier from your nearest hub.",
    providers: [
      { name: "Jeevadhara Vehicle Bazaar", desc: "Browse tractors, JCB, mini-trucks and autos — buy or rent.", url: "/vehicles" },
      { name: "EM3 Agri Services", desc: "Pay-per-use farm machinery — laser leveler, rotavator, harvester.", url: "https://em3agri.com" },
      { name: "FarmEasy Equipment", desc: "Tractor + implement rental in MP, Maharashtra, Karnataka. Rs600/hour.", phone: "+91 90000 11221" },
      { name: "Porter Krishi", desc: "On-demand mini-trucks within 50 km, app-booked.", url: "https://porter.in" },
    ],
  },
  {
    id: "cctv", label: "Farm CCTV & Security", icon: Camera,
    tint: "bg-zinc-500/10 text-zinc-700",
    blurb: "Solar-powered 4-camera CCTV with mobile alerts, motion-sensors, intrusion alarms and ear-tagging for cattle.",
    providers: [
      { name: "FarmEye Solar CCTV", desc: "4-camera solar CCTV with mobile alerts. Rs35,000 turnkey.", phone: "+91 99888 76543" },
      { name: "Hikvision Rural Series", desc: "PTZ outdoor cameras for orchards and large fields — 100 m night vision.", url: "https://hikvision.com" },
      { name: "CP Plus Agri Surveillance", desc: "Made-in-India NVR + IP camera packs, dealer in every district.", url: "https://cpplusworld.com" },
    ],
  },
  {
    id: "fodder", label: "Cattle Fodder & Feed", icon: Leaf,
    tint: "bg-lime-500/10 text-lime-700",
    blurb: "Hydroponic green fodder, silage, mineral mix, Total Mixed Ration and Black Soldier Fly larvae for poultry and fish protein.",
    providers: [
      { name: "Godrej Agrovet Feeds", desc: "Cattle pellet feed, poultry feed, prawn feed — pan-India dealer network.", url: "https://godrejagrovet.com" },
      { name: "Krimanshi Hydroponic Fodder", desc: "Maize/barley sprouted fodder kits — 600 kg green fodder/day in 50 sq.ft.", url: "https://krimanshi.com" },
      { name: "Loopworm BSF Larvae", desc: "Black Soldier Fly dried larvae — 55% protein. Used in poultry & fish feed.", url: "https://loopworm.com" },
      { name: "Nutricane Silage Bags", desc: "Maize silage in 50 kg airtight bags. Year-round dry-season feed.", phone: "+91 90000 33445" },
    ],
  },
  {
    id: "microgreens", label: "Microgreens & Inputs", icon: Sprout,
    tint: "bg-teal-500/10 text-teal-700",
    blurb: "Microgreen seeds, growing trays, coco-peat, jiffy plugs and LED grow-lights for urban farms and restaurant supply.",
    providers: [
      { name: "UrbanKisaan Microgreens", desc: "Pre-sown microgreen trays delivered to your kitchen weekly.", url: "https://urbankisaan.com" },
      { name: "Coir Green Coco-Peat", desc: "5 kg low-EC coco-peat blocks for nursery and microgreens.", phone: "+91 96000 22113" },
      { name: "Pro-Tray 98-cell", desc: "Plastic seedling trays for chilli, tomato, brinjal nurseries.", phone: "+91 90000 87654" },
      { name: "BARTON Grow LEDs", desc: "Full-spectrum 24 W LED bars for indoor microgreens and seedlings.", url: "https://bartonbreeze.com" },
    ],
  },
  {
    id: "pestlab", label: "Pesticide & Residue Testing", icon: Bug,
    tint: "bg-red-500/10 text-red-700",
    blurb: "Pesticide residue, heavy metal and aflatoxin testing for export-grade produce, organic certification and safe-food labelling.",
    providers: [
      { name: "Eurofins India", desc: "FSSAI & NABL pesticide-residue panel — 270 molecules. 7-day report.", url: "https://eurofins.in" },
      { name: "SGS India Pesticide Lab", desc: "EU/USDA-compliant residue analysis for grapes, mango, chilli, spices.", url: "https://sgs.com" },
      { name: "Equinox Labs", desc: "FSSAI food-safety, pesticide & microbiology testing — Mumbai HQ.", url: "https://equinoxlabs.com" },
      { name: "Jeevadhara Quality Mark", desc: "Free residue spot-check for top-grade listings. We test before you sell.", phone: "+91 91234 56789" },
    ],
  },
];

/* ── Icon map for compact grid (emoji fallback) ── */
const CAT_EMOJIS: Record<string, string> = {
  finance: "🏦", borewell: "💧", fencing: "🛡️", polyhouse: "🏠",
  hydroponics: "🌿", irrigation: "💦", drone: "🚁", logistics: "🚛",
  labs: "🔬", vet: "🐄", solar: "☀️", labour: "👷", cropguide: "📚",
  schemes: "📋", visits: "👨‍🌾", rental: "🚜", cctv: "📷",
  fodder: "🌾", microgreens: "🌱", pestlab: "🧪",
};

/* Short labels that fit in compact tiles */
const CAT_SHORT: Record<string, string> = {
  finance: "Banking", borewell: "Borewell", fencing: "Fencing", polyhouse: "Polyhouse",
  hydroponics: "Hydroponic", irrigation: "Irrigation", drone: "Drone", logistics: "Logistics",
  labs: "Soil Labs", vet: "Veterinary", solar: "Solar", labour: "Labour",
  cropguide: "Crop Guide", schemes: "Schemes", visits: "Expert Visit", rental: "Rental",
  cctv: "CCTV", fodder: "Fodder", microgreens: "Microgreens", pestlab: "Pest Lab",
};

function ProviderCard({ p }: { p: Provider }) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-green-300 transition">
      <h3 className="font-semibold text-sm text-gray-900 leading-snug">{p.name}</h3>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed flex-1">{p.desc}</p>
      {p.city && <p className="text-xs text-gray-400 mt-1">📍 {p.city}</p>}
      <div className="mt-3 flex gap-2 flex-wrap">
        {p.phone && (
          <a href={`tel:${p.phone}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition">
            <Phone className="h-3 w-3" /> {p.phone}
          </a>
        )}
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-green-400 transition">
            <ExternalLink className="h-3 w-3" /> Website
          </a>
        )}
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [active, setActive] = useState("finance");
  const [search, setSearch] = useState("");

  const cat = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];
  const Icon = cat.icon;

  const filteredCats = search.trim()
    ? CATEGORIES.filter(
        (c) =>
          c.label.toLowerCase().includes(search.toLowerCase()) ||
          c.blurb.toLowerCase().includes(search.toLowerCase()) ||
          c.providers.some(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.desc.toLowerCase().includes(search.toLowerCase())
          )
      )
    : CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact header */}
      <div className="bg-white border-b shadow-sm px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Service Hub</h1>
            <p className="text-xs text-gray-500 mt-0.5">{CATEGORIES.length} categories &middot; 100+ verified partners</p>
          </div>
          <Link href="/auth/signup/provider"
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 transition self-start sm:self-auto">
            <Wrench className="h-3.5 w-3.5" /> List your service
          </Link>
        </div>
        {/* Search */}
        <div className="max-w-5xl mx-auto mt-3 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search — borewell, solar, KCC loan, drone..."
            className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-500 focus:bg-white transition" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        {search.trim() ? (
          /* ── Search results ── */
          <div>
            <p className="mb-4 text-sm text-gray-500">
              {filteredCats.length} categor{filteredCats.length !== 1 ? "ies" : "y"} for <strong>&quot;{search}&quot;</strong>
            </p>
            {filteredCats.length === 0 ? (
              <p className="py-20 text-center text-gray-400">No services match your search.</p>
            ) : filteredCats.map((fc) => (
              <div key={fc.id} className="mb-8">
                <h3 className="font-bold text-base text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">{CAT_EMOJIS[fc.id] || "🔧"}</span> {fc.label}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fc.providers.map(p => <ProviderCard key={p.name} p={p} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Main view ── */
          <div>
            {/* ALL CATEGORIES GRID — fully visible, no scroll */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-6">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setActive(c.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition border ${
                    active === c.id
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:bg-green-50"
                  }`}>
                  <span className="text-2xl leading-none">{CAT_EMOJIS[c.id] || "🔧"}</span>
                  <span className="text-[10px] font-medium leading-tight">{CAT_SHORT[c.id] || c.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            {/* Selected category hero */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 opacity-5 text-8xl select-none">{CAT_EMOJIS[cat.id]}</div>
              <div className="flex items-center gap-3 mb-3">
                <div className={"grid h-12 w-12 place-items-center rounded-xl text-2xl " + cat.tint}>
                  {CAT_EMOJIS[cat.id] || "🔧"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{cat.label}</h2>
                  <p className="text-xs text-gray-400">{cat.providers.length} verified partners</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{cat.blurb}</p>
            </div>

            {/* Provider cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cat.providers.map(p => <ProviderCard key={p.name} p={p} />)}
            </div>

            {/* CTA */}
            <div className="mt-8 rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-5 text-center">
              <p className="font-bold text-gray-900">Are you a {cat.label.toLowerCase()} provider?</p>
              <p className="text-sm text-gray-500 mt-1">List free for the first year — reach verified farmers across Telangana.</p>
              <Link href="/auth/signup/provider"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700 transition">
                <Wrench className="h-4 w-4" /> Sign up as Service Partner
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
