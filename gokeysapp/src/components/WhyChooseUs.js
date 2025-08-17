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
        <section>
          <p>
            Welcome to <strong>Gokeys India</strong> — your trusted <strong>travel agent in Haridwar</strong> for spiritual journeys, Himalayan adventures, and unforgettable holidays. With over 10 years of experience and official authorization from <strong>Uttarakhand Tourism</strong>, we specialize in crafting customized and group travel packages for Char Dham Yatra 2025, Do Dham tours, and sacred pilgrimages like <strong>Badrinath</strong>, <strong>Kedarnath</strong>, <strong>Gangotri</strong>, and <strong>Yamunotri</strong>.  
          </p>
          <p>
            Whether you’re seeking the snow-clad beauty of <strong>Auli</strong> and <strong>Chopta</strong>, the serene landscapes of <strong>Valley of Flowers</strong> and <strong>Hemkund Sahib</strong>, or adrenaline-filled camping and rafting experiences in <strong>Rishikesh</strong>, Gokeys delivers with transparent pricing and personalized service.  
          </p>
          <p>
            Our team is based in Haridwar, giving us the local knowledge to arrange reliable <strong>cab rentals</strong>, hotel bookings, and guided tours across Uttarakhand. Explore our <a href="/tours">best-selling tours</a> or <a href="/contact">contact us today</a> to start your journey. From budget trips to luxury escapes, we’re here to make your travel smooth, safe, and memorable.
          </p>
        </section>
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
