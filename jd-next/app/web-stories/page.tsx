"use client";
import { useState, useEffect } from "react";

interface Slide { title: string; body: string; }
interface Story { id: string; slug: string; title: string; cover_emoji: string; cover_gradient: string; slides: Slide[]; }

const FALLBACK: Story[] = [
  { id:"1", slug:"tomato-tips", title:"5 tips to double your tomato yield", cover_emoji:"🍅", cover_gradient:"from-red-400 to-orange-500", slides:[
    {title:"Choose the right variety",body:"Pick hybrid varieties (Arka Rakshak, US440) suited to Telangana's climate."},
    {title:"Soil prep",body:"Target pH 6.0–6.8. Add 2 tons FYM per acre before transplanting."},
    {title:"Drip + mulch",body:"Drip irrigation saves 40% water. Black mulch suppresses weeds & retains moisture."},
    {title:"Stake early",body:"Stake within 30 days of transplanting. Prevents lodging and boosts yield by 25%."},
    {title:"Watch for blight",body:"Spray copper-oxychloride at first sign. Repeat after every rain."},
  ]},
  { id:"2", slug:"pm-kisan", title:"Apply for PM-KISAN in 5 steps", cover_emoji:"💸", cover_gradient:"from-emerald-400 to-teal-500", slides:[
    {title:"Open pmkisan.gov.in",body:"Click 'New Farmer Registration' on the homepage."},
    {title:"Enter Aadhaar",body:"Verify mobile number linked to Aadhaar with OTP."},
    {title:"Fill land details",body:"Enter khasra number, khata, and state/district details."},
    {title:"Link bank account",body:"Use an Aadhaar-seeded account for direct benefit transfer."},
    {title:"Track status",body:"Check 'Beneficiary Status' to monitor your ₹2000 installments."},
  ]},
  { id:"3", slug:"monsoon-checklist", title:"Monsoon farm checklist", cover_emoji:"🌧️", cover_gradient:"from-blue-400 to-indigo-500", slides:[
    {title:"Clear drain channels",body:"Clear all field bunds and drainage channels before June 1st."},
    {title:"Protect grain storage",body:"Stack grain on wooden pallets, cover with tarpaulin. Keep 1ft gap from wall."},
    {title:"Scout for pests",body:"Inspect crops weekly. Stem borer and leaf folder peak in July–August."},
    {title:"Enroll in PMFBY",body:"Enroll in PM Fasal Bima Yojana before your state's cut-off date."},
  ]},
  { id:"4", slug:"rytu-bandhu", title:"How to claim Rytu Bandhu", cover_emoji:"🌾", cover_gradient:"from-green-400 to-emerald-500", slides:[
    {title:"Check eligibility",body:"You need a Pattadar Passbook and Aadhaar seeded to your bank account."},
    {title:"Verify Dharani records",body:"Your land records must be updated on dharani.telangana.gov.in before the season."},
    {title:"Visit MeeSeva",body:"Apply at your nearest MeeSeva center with passbook + Aadhaar."},
    {title:"Payment timeline",body:"₹10,000/acre released before Kharif (June) and Rabi (October) seasons."},
  ]},
];

export default function WebStoriesPage() {
  const [stories, setStories] = useState<Story[]>(FALLBACK);
  const [active, setActive] = useState<Story | null>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetch("/api/web-stories")
      .then(r => r.json())
      .then((data: Story[]) => { if (data && data.length > 0) setStories(data); })
      .catch(() => {});
  }, []);

  function openStory(s: Story) { setActive(s); setSlide(0); }
  function next() { if (active && slide < active.slides.length - 1) setSlide(s => s + 1); else closeStory(); }
  function prev() { if (slide > 0) setSlide(s => s - 1); }
  function closeStory() { setActive(null); setSlide(0); }

  const GRADIENTS: Record<string, string> = {
    "from-red-400 to-orange-500":"from-red-400 to-orange-500",
    "from-emerald-400 to-teal-500":"from-emerald-400 to-teal-500",
    "from-blue-400 to-indigo-500":"from-blue-400 to-indigo-500",
    "from-green-400 to-emerald-500":"from-green-400 to-emerald-500",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">📖 Kisan Web Stories</h1>
          <p className="text-gray-400">Quick farm tips in story format — swipe through in under a minute</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {stories.map(story => (
            <button key={story.id} onClick={() => openStory(story)}
              className={`bg-gradient-to-br ${GRADIENTS[story.cover_gradient] || "from-green-500 to-teal-600"} rounded-2xl aspect-[9/16] flex flex-col items-center justify-end p-4 hover:scale-105 transition-transform shadow-lg`}>
              <span className="text-5xl mb-2">{story.cover_emoji}</span>
              <p className="text-white font-bold text-sm text-center leading-tight">{story.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Story viewer */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className={`relative bg-gradient-to-br ${GRADIENTS[active.cover_gradient] || "from-green-500 to-teal-600"} w-full max-w-sm h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl`}>
            {/* Progress dots */}
            <div className="flex gap-1 p-3">
              {active.slides.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= slide ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>

            {/* Close */}
            <button onClick={closeStory} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl">×</button>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-end p-6">
              <p className="text-white/70 text-xs mb-2">{slide + 1} / {active.slides.length}</p>
              <h2 className="text-white text-2xl font-bold mb-3">{active.slides[slide].title}</h2>
              <p className="text-white/90 text-base leading-relaxed">{active.slides[slide].body}</p>
            </div>

            {/* Tap zones */}
            <div className="absolute inset-0 flex" style={{top:"60px"}}>
              <div className="flex-1" onClick={prev} />
              <div className="flex-1" onClick={next} />
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 p-4">
              <button onClick={prev} disabled={slide === 0}
                className="flex-1 py-2 bg-white/20 text-white rounded-xl text-sm disabled:opacity-30">← Prev</button>
              <button onClick={next}
                className="flex-1 py-2 bg-white text-gray-800 rounded-xl text-sm font-semibold">
                {slide === active.slides.length - 1 ? "Done ✓" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
