import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { seatLabel } from "@/lib/cabs";

export default function CabCard({ cab }) {
  const seats = seatLabel(cab.seats); // an invalid count is left off, never shown as e.g. "-1 Seater"
  return (
    <div className="gk-card gk-card-hover flex flex-col h-full overflow-hidden">

      {/* Large Cab Image */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-linear-to-b from-[#e3eff2] to-[#f5f9fa]">

        <Image
          src={cab.image}
          alt={cab.name}
          fill
          className="object-contain scale-[1.35]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Cab Name */}
        <h3 className="gk-h3">{cab.name}</h3>

        {/* Specifications */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="gk-chip">{cab.type}</span>
          {seats && <span className="gk-chip">{seats} Seater</span>}
          <span className="gk-chip">
            {cab.ac ? "AC" : "Non-AC"}
          </span>
        </div>

        {/* Pricing */}
        <div className="pt-4 mt-auto">
          <p className="text-xs text-slate-ink">
            Starting from
          </p>

          <p className="flex items-baseline gap-1.5">
            <span className="gk-price text-2xl">
              ₹{cab.pricePerDay.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-ink">
              / day
            </span>
          </p>

          <p className="text-xs text-slate-ink mt-0.5">
            Min {cab.minKmPerDay} km/day • {cab.location}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 pt-4">
          <a
            href={`tel:${cab.phone}`}
            className="gk-btn gk-btn-ink flex-1"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>

          <a
            href={cab.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="gk-btn gk-btn-wa flex-1"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}