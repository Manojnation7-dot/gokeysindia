export default function WhyChooseUs() {
  const items = [
    { title: "✔ Govt. Registered", desc: "Authorized by Uttarakhand Tourism" },
    { title: "✔ 10+ Years Experience", desc: "Handled 1000+ successful trips" },
    { title: "✔ Transparent Pricing", desc: "No fake offers or hidden costs" },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-8">
          Why Travel with Gokeys?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl shadow-lg"
            >
              <h4 className="text-xl font-semibold text-blue-800">
                {item.title}
              </h4>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
