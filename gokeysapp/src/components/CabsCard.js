import Image from "next/image";
import { Phone, MessageCircle, Snowflake, Wind } from "lucide-react";

export default function CabCard({ cab }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300">
      
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={cab.image}
          alt={cab.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Cab Type Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow">
          {cab.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {cab.name}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
          <span>{cab.seats} Seater</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            {cab.ac ? (
              <>
                <Snowflake className="w-4 h-4 text-blue-500" />
                AC
              </>
            ) : (
              <>
                <Wind className="w-4 h-4 text-gray-400" />
                Non-AC
              </>
            )}
          </span>
        </div>

        {/* Pricing */}
        <div className="pt-2">
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="text-2xl font-extrabold text-gray-900">
            ₹{cab.pricePerDay.toLocaleString()}
            <span className="text-sm font-medium text-gray-500"> / day</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Min {cab.minKmPerDay} km/day • {cab.location}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 pt-4">
          <a
            href={`tel:${cab.phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>

          <a
            href={cab.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-brand-600 text-brand-600 hover:bg-brand-50 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
