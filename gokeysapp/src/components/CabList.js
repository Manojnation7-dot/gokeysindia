"use client";

import CabCard from "@/components/CabsCard";

const cabs = [
  {
    id: 1,
    name: "Swift Dzire",
    type: "Sedan",
    image: "/images/swift-dzire.png",
    seats: 4,
    ac: true,
    pricePerDay: 4000,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
  {
    id: 2,
    name: "Maruti Ertiga",
    type: "SUV",
    image: "/images/ertiga.png",
    seats: 6,
    ac: true,
    pricePerDay: 5000,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999999",
    whatsapp: "https://wa.me/919999999999?text=Hi%20I'm%20interested%20in%20Innova%20Crysta%20cab",
  },
   {
    id: 3,
    name: "Kia Carens",
    type: "SUV",
    image: "/images/kia-carens.png",
    seats: 6,
    ac: true,
    pricePerDay: 5500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 4,
    name: "Innova",
    type: "SUV",
    image: "/images/innova.png",
    seats: 6-7,
    ac: true,
    pricePerDay: 5800,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 5,
    name: "Innova Crysta",
    type: "SUV",
    image: "/images/innova-crysta.png",
    seats: 6,
    ac: true,
    pricePerDay: 6500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999999",
    whatsapp: "https://wa.me/919999999999?text=Hi%20I'm%20interested%20in%20Innova%20Crysta%20cab",
  },
   {
    id: 6,
    name: "Bolero",
    type: "SUV",
    image: "/images/bolero.png",
    seats: 6-8,
    ac: false,
    pricePerDay: 4200,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 7,
    name: "Cruiser",
    type: "Maxi Cab",
    image: "/images/cruiser.png",
    seats: 10-11,
    ac: false,
    pricePerDay: 6500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 8,
    name: "Tempo Travellers",
    type: "Mini Bus",
    image: "/images/tempo-14-seater.png",
    seats: 11-14,
    ac: false,
    pricePerDay: 8500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 9,
    name: "Tempo Travellers",
    type: "Mini Bus",
    image: "/images/tempo-17-26-seater.png",
    seats: 17,
    ac: false,
    pricePerDay: 9500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
   {
    id: 10,
    name: "Urbania",
    type: "Mini Bus",
    image: "/images/urbania.png",
    seats: 12,
    ac: false,
    pricePerDay: 12000,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919999999998",
    whatsapp: "https://wa.me/919999999998?text=Hi%20I'm%20interested%20in%20Swift%20Dzire%20cab",
  },
  
];

export default function CabList() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 uppercase">All Cabs in Uttarakhand</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cabs.map((cab) => (
          <CabCard key={cab.id} cab={cab} />
        ))}
      </div>
    </div>
  );
}
