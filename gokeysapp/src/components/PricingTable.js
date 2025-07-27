export default function PricingTable({ tourData }) {
  // Map package types to features (static for now, update if backend provides features)
  const packageFeatures = {
    Standard: ["Budget Hotels", "Non-AC Transport", "Shared Rooms", "Basic Meals"],
    Deluxe: ["3-Star Hotels", "AC Transport", "Twin Sharing", "All Meals Included"],
    Luxury: ["4-5 Star Hotels", "Private Car", "Luxury Rooms", "Gourmet Meals"],
  };

  // Use pricing data from tourData, fallback to empty array
  const packages = tourData.pricing && tourData.pricing.length > 0
    ? tourData.pricing.map((pkg) => ({
        title: pkg.package_type || "Unknown Package",
        price: pkg.discount_price
          ? `₹${parseFloat(pkg.discount_price).toLocaleString("en-IN")}`
          : `₹${parseFloat(pkg.price).toLocaleString("en-IN")}`,
        features: packageFeatures[pkg.package_type] || ["Contact for details"],
        available_seats: pkg.available_seats,
        valid_from: pkg.valid_from,
        valid_to: pkg.valid_to,
      }))
    : [
        {
          title: "No Pricing Available",
          price: "Contact for details",
          features: ["Please check back later or contact support."],
          available_seats: 0,
          valid_from: null,
          valid_to: null,
        },
      ];

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Choose Your Package</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className="border border-gray-200 bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
              <p className="text-xl text-blue-600 font-bold mb-4">{pkg.price}</p>
              <ul className="text-left space-y-2">
                {pkg.features.map((item, i) => (
                  <li key={i} className="text-gray-700">• {item}</li>
                ))}
              </ul>
              {pkg.available_seats !== undefined && (
                <p className="text-gray-600 mt-4">
                  Available Seats: {pkg.available_seats}
                </p>
              )}
              {(pkg.valid_from || pkg.valid_to) && (
                <p className="text-gray-600 mt-2">
                  Valid: {pkg.valid_from ? new Date(pkg.valid_from).toLocaleDateString("en-IN") : "N/A"} -{" "}
                  {pkg.valid_to ? new Date(pkg.valid_to).toLocaleDateString("en-IN") : "N/A"}
                </p>
              )}
              <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700">
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}