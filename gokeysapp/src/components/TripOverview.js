import Image from "next/image";

export default function TripOverview({ tourData }) {
  return (
    <section className="bg-white shadow-md rounded-2xl p-6 mt-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Trip Image */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden">
          <Image
            src={tourData.featured_image?.image || "https://via.placeholder.com/600x400"}
            alt={tourData.name}
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Trip Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {tourData.name} - {tourData.duration_days} Days
          </h1>
          <p
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: tourData.content || "No description available.",
            }}
          />

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Duration:</strong> {tourData.duration_days} Days /{" "}
              {tourData.duration_nights} Nights
            </div>
            <div>
              <strong>Departure:</strong> {tourData.starting_location}
            </div>
            <div>
              <strong>Type:</strong>{" "}
              {tourData.trip_types.length > 0
                ? tourData.trip_types.map((type) => type.name).join(", ")
                : "Stay, Meals, Transport"}
            </div>
            <div>
              <strong>Destinations:</strong> {tourData.destinations.join(", ")}
            </div>
          </div>

          <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700">
            Enquire Now
          </button>
        </div>
      </div>
    </section>
  );
}