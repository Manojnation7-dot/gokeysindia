export default function InclusionsExclusions({ tourData }) {
  // Filter inclusions and exclusions from inclusions_exclusions array
  const inclusions = tourData.inclusions_exclusions?.filter((item) => item.is_inclusion) || [];
  const exclusions = tourData.inclusions_exclusions?.filter((item) => !item.is_inclusion) || [];

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">What's Included & Not Included</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Inclusions */}
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-4">Inclusions</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {inclusions.length > 0 ? (
                inclusions.map((item, index) => (
                  <li key={index}>{item.description}</li>
                ))
              ) : (
                <li>No inclusions specified.</li>
              )}
            </ul>
          </div>

          {/* Exclusions */}
          <div>
            <h3 className="text-xl font-semibold text-red-700 mb-4">Exclusions</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {exclusions.length > 0 ? (
                exclusions.map((item, index) => (
                  <li key={index}>{item.description}</li>
                ))
              ) : (
                <li>No exclusions specified.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}