"use client";
import { useState } from "react";
import Image from "next/image";

// Big photo + two stacked thumbnails; every photo opens in the lightbox.
export default function ImageGallery({ images, alt: altProp }) {
  const alt = altProp || "Tour photo";
  const [selected, setSelected] = useState(null);
  const list = (images || []).filter(Boolean);

  if (list.length === 0) return null;

  const Tile = ({ idx, className = "", sizes, priority = false, children }) => (
    <button
      type="button"
      onClick={() => setSelected(idx)}
      className={`relative overflow-hidden rounded-2xl bg-chip cursor-zoom-in ${className}`}
      aria-label={`Open photo ${idx + 1} of ${list.length}`}
    >
      <Image
        src={list[idx]}
        alt={idx === 0 ? alt : `${alt} ${idx + 1}`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <div className={`grid gap-2.5 h-64 sm:h-80 md:h-105 ${list.length > 1 ? "md:grid-cols-[2fr_1fr]" : ""}`}>
        <Tile idx={0} className="h-full" sizes="(max-width: 768px) 100vw, 66vw" priority>
          {list.length > 1 && (
            <span className="md:hidden absolute bottom-3 right-3 gk-chip bg-white!">View all {list.length} photos</span>
          )}
        </Tile>
        {list.length > 1 && (
          <div className="hidden md:grid grid-rows-2 gap-2.5">
            <Tile idx={1} sizes="33vw" />
            {list[2] ? (
              <Tile idx={2} sizes="33vw">
                {list.length > 3 && (
                  <span className="absolute bottom-3 left-3 gk-chip bg-white!">View all {list.length} photos</span>
                )}
              </Tile>
            ) : (
              <div className="rounded-2xl bg-chip" />
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60" role="dialog" aria-modal="true">
          <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-white text-2xl" aria-label="Close">
            ✕
          </button>
          <button
            onClick={() => setSelected((selected - 1 + list.length) % list.length)}
            className="absolute left-4 md:left-6 text-white text-4xl px-2"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div className="relative w-[90%] max-w-5xl h-[80vh]">
            <Image src={list[selected]} alt={`${alt} ${selected + 1}`} fill sizes="90vw" className="object-contain" />
          </div>
          <button
            onClick={() => setSelected((selected + 1) % list.length)}
            className="absolute right-4 md:right-6 text-white text-4xl px-2"
            aria-label="Next photo"
          >
            ›
          </button>
          <p className="absolute bottom-6 text-white/80 text-[15px]">{selected + 1} / {list.length}</p>
        </div>
      )}
    </div>
  );
}
