"use client";
import { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Reel {
  id: string;   // YouTube video ID
  title: string;
  tag: string;
}

const REELS: Reel[] = [
  { id: "JtKrH5Xi0t8", title: "Smart farming in action",        tag: "Innovation" },
  { id: "rkGzo4SOcPk", title: "Modern agriculture techniques",   tag: "Technique"  },
  { id: "eozZ-LSfDz0", title: "Field to harvest",               tag: "Harvest"    },
  { id: "HsdhuAT0940", title: "Livestock and dairy tips",       tag: "Livestock"  },
  { id: "ED7onPpqFUI", title: "Crop care that works",           tag: "Crop care"  },
  { id: "7mhyGURQ6z0", title: "Farm machinery in the field",    tag: "Machinery"  },
  { id: "uLHJD9IlUsQ", title: "Farmer success story",           tag: "Success"    },
];

const TAG_COLORS: Record<string, string> = {
  Innovation: "bg-purple-100 text-purple-700",
  Technique:  "bg-blue-100 text-blue-700",
  Harvest:    "bg-green-100 text-green-700",
  Livestock:  "bg-amber-100 text-amber-700",
  "Crop care":"bg-lime-100 text-lime-700",
  Machinery:  "bg-slate-100 text-slate-700",
  Success:    "bg-rose-100 text-rose-700",
};

const thumb  = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const embed  = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
const watch  = (id: string) => `https://www.youtube.com/shorts/${id}`;

export default function WebStoriesPage() {
  const [active, setActive] = useState<number | null>(null);

  const open  = (i: number) => setActive(i);
  const close = () => setActive(null);
  const prev  = () => setActive(i => i === null ? i : (i - 1 + REELS.length) % REELS.length);
  const next  = () => setActive(i => i === null ? i : (i + 1) % REELS.length);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="px-4 pt-8 pb-5 max-w-6xl mx-auto">
        <span className="text-5xl">📱</span>
        <h1 className="mt-3 text-3xl font-bold text-white">Web Stories</h1>
        <p className="text-gray-400 text-sm mt-1">
          Tap any reel to watch short farming videos — tips, livestock care, machinery and success stories.
        </p>
      </div>

      {/* Reel grid — 9:16 cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {REELS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => open(i)}
              className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-black text-left text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              style={{ aspectRatio: "9/16" }}
            >
              {/* YouTube thumbnail */}
              <img
                src={thumb(r.id)}
                alt={r.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              {/* Play button */}
              <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-red-600 shadow-xl transition group-hover:scale-110">
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              </span>
              {/* Tag + title */}
              <div className="relative z-10 p-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur ${TAG_COLORS[r.tag] ?? "bg-white/20 text-white"}`}>
                  {r.tag}
                </span>
                <h3 className="mt-1.5 text-sm font-bold leading-tight drop-shadow">
                  {r.title}
                </h3>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          {REELS.length} farming reels &middot; Tap to watch &middot; Opens YouTube if needed
        </p>
      </div>

      {/* Fullscreen video modal */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={close}
        >
          {/* Video container — 9:16 */}
          <div
            className="relative flex h-full max-h-[88vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-black shadow-2xl"
            style={{ aspectRatio: "9/16" }}
            onClick={e => e.stopPropagation()}
          >
            <iframe
              key={REELS[active].id}
              src={embed(REELS[active].id)}
              title={REELS[active].title}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Bottom bar */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="pointer-events-auto text-sm font-bold text-white drop-shadow">
                {REELS[active].title}
              </p>
              <a
                href={watch(REELS[active].id)}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/25"
              >
                YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
