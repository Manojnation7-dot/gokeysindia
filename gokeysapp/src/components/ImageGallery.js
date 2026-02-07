"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }) {
  const [selected, setSelected] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      {/* Featured Layout */}
      <div className="hidden md:grid grid-cols-12 gap-2 h-[75vh] w-full">
        {/* Left big image */}
        {images[0] && (
          <div
            className="relative col-span-5 row-span-full cursor-pointer"
            onClick={() => setSelected(0)}
          >
            <Image
              src={images[0]}
              alt="Main Image"
              fill
              className="object-cover rounded-sm"
            />
          </div>
        )}

        {/* Middle stacked */}
        <div className="col-span-3 grid grid-rows-2 gap-2">
          {images[1] && (
            <div
              className="relative cursor-pointer"
              onClick={() => setSelected(1)}
            >
              <Image
                src={images[1]}
                alt="Image 2"
                fill
                className="object-cover rounded-sm"
              />
            </div>
          )}
          {images[2] && (
            <div
              className="relative cursor-pointer"
              onClick={() => setSelected(2)}
            >
              <Image
                src={images[2]}
                alt="Image 3"
                fill
                className="object-cover rounded-sm"
              />
            </div>
          )}
        </div>

        {/* Right side (2 stacked or 1 full) */}
        <div className="col-span-4 grid gap-2">
          {images[3] && images[4] ? (
            <div className="grid grid-rows-2 gap-2">
              <div
                className="relative cursor-pointer"
                onClick={() => setSelected(3)}
              >
                <Image
                  src={images[3]}
                  alt="Image 4"
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
              <div
                className="relative cursor-pointer"
                onClick={() => setSelected(4)}
              >
                <Image
                  src={images[4]}
                  alt="Image 5"
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            </div>
          ) : (
            images[3] && (
              <div
                className="relative h-full cursor-pointer"
                onClick={() => setSelected(3)}
              >
                <Image
                  src={images[3]}
                  alt="Image 4"
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile fallback: simple 2-col grid */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square cursor-pointer"
            onClick={() => setSelected(idx)}
          >
            <Image
              src={img}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover rounded-sm"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>
          <button
            onClick={() =>
              setSelected((selected - 1 + images.length) % images.length)
            }
            className="absolute left-6 text-white text-3xl"
          >
            ‹
          </button>
          <div className="relative w-[90%] max-w-5xl h-[80vh]">
            <Image
              src={images[selected]}
              alt={`Large view ${selected + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={() => setSelected((selected + 1) % images.length)}
            className="absolute right-6 text-white text-3xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
