import Image from "next/image";

export default function CabCard({ cab }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all">
      <div className="relative h-48 w-full">
        <Image src={cab.image} alt={cab.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{cab.name}</h2>
        <p className="text-sm text-gray-500 mb-1">
          {cab.type} • {cab.seats} Seater • {cab.ac ? "AC" : "Non-AC"}
        </p>
        <p className="text-gray-600 text-sm">
          From <span className="font-semibold text-green-700">₹{cab.pricePerDay}/day</span> • Min {cab.minKmPerDay} km/day
        </p>
        <p className="text-sm text-gray-500 mb-3">Location: {cab.location}</p>
        <div className="flex justify-between items-center mt-4">
          <a href={`tel:${cab.phone}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
            Call
          </a>
          <a href={cab.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            Send Query
          </a>
        </div>
      </div>
    </div>
  );
}
