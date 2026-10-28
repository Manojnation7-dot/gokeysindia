// The cab fleet: the /cabs page shows every cab, the home page those without `home: false` (and its OfferCatalog
// schema). `seats` is a whole number, or a range as a string ("6-7"): written without quotes, 6-7 would be the
// number -1. seatLabel() checks it; an invalid value is left off the card instead of shown.
export const cabs = [
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
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Swift%20Dzire%20cab",
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
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Maruti%20Ertiga%20cab",
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
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Kia%20Carens%20cab",
  },
  {
    id: 4,
    name: "Innova",
    type: "SUV",
    image: "/images/innova.png",
    seats: "6-7",
    ac: true,
    pricePerDay: 5800,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Innova%20cab",
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
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Innova%20Crysta%20cab",
  },
  {
    id: 6,
    name: "Bolero",
    type: "SUV",
    image: "/images/bolero.png",
    seats: "6-8",
    ac: false,
    pricePerDay: 4200,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Bolero%20cab",
  },
  {
    id: 7,
    name: "Cruiser",
    type: "Maxi Cab",
    image: "/images/cruiser.png",
    seats: "10-11",
    ac: false,
    pricePerDay: 6500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Cruiser%20cab",
  },
  {
    id: 8,
    name: "Tempo Traveller",
    type: "Mini Bus",
    image: "/images/tempo-14-seater.png",
    seats: "11-14",
    ac: false,
    pricePerDay: 8500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Tempo%20Traveller%20cab",
  },
  {
    id: 9,
    name: "Tempo Traveller",
    type: "Mini Bus",
    image: "/images/tempo-17-26-seater.png",
    seats: 17,
    ac: false,
    pricePerDay: 9500,
    minKmPerDay: 250,
    location: "Haridwar",
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20the%2017%20seater%20Tempo%20Traveller",
    home: false,
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
    phone: "+919045916770",
    whatsapp:
      "https://wa.me/919045916770?text=Hi%20I%27m%20interested%20in%20Urbania%20cab",
    home: false,
  },
];

export const homeCabs = cabs.filter((cab) => cab.home !== false);

/** "4", "6–7", or null when the seat count is not a positive whole number or a valid range. */
export function seatLabel(seats) {
  if (typeof seats === "number") return Number.isInteger(seats) && seats > 0 ? String(seats) : null;
  const text = typeof seats === "string" ? seats.trim() : "";
  if (/^\d+$/.test(text)) return Number(text) > 0 ? String(Number(text)) : null;
  const range = text.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (range && Number(range[1]) > 0 && Number(range[1]) < Number(range[2])) return `${Number(range[1])}–${Number(range[2])}`;
  return null;
}
