export default function TourItinerary({ tourData }) {
  // Use itineraries field if available, otherwise fallback
  const itinerary = tourData.itineraries && tourData.itineraries.length > 0
    ? tourData.itineraries
        .sort((a, b) => a.order - b.order || a.day - b.day) // Respect model ordering
        .map((item, index) => ({
          day: item.day || index + 1,
          title: item.title || 'Untitled',
          description: item.description || 'No description available.',
        }))
    : [
        {
          day: 1,
          title: `Arrival in ${tourData.starting_location || 'Unknown'}`,
          description: 'Check in to hotel and relax.',
        },
      ];

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Day-wise Itinerary</h2>
        {itinerary.length === 0 ? (
          <p className="text-gray-600">No itinerary available for this tour.</p>
        ) : (
          <div className="space-y-6">
            {itinerary.map((item) => (
              <div
                key={item.day}
                className="border-l-4 border-blue-600 pl-4 py-4 shadow rounded-md bg-gray-50"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Day {item.day}: {item.title}
                </h3>
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}