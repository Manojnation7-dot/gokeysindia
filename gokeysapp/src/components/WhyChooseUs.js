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
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Welcome to <strong>Gokeys India</strong> — your trusted 
              <strong> travel agent in Haridwar</strong> for spiritual journeys, 
              Himalayan adventures, and unforgettable holidays. With over 10 years of 
              experience and authorization from <strong>Uttarakhand Tourism</strong>, 
              we craft customized and group travel packages including 
              <strong> Char Dham Yatra 2025</strong>.
            </p>
            <p>
              From <strong>Auli</strong> and <strong>Chopta</strong> to the 
              <strong> Valley of Flowers</strong> and <strong>Hemkund Sahib</strong>, 
              or rafting & camping in <strong>Rishikesh</strong> — we deliver with 
              transparent pricing and personalized service.
            </p>
            <p>
              Our Haridwar-based team ensures smooth <strong>cab rentals</strong>, 
              hotel bookings, and guided tours. Explore our 
              <a href="/tours" className="text-blue-600 font-semibold hover:underline"> best-selling tours</a> 
                or 
              <a href="/contact" className="text-blue-600 font-semibold hover:underline"> contact us</a> today.  
              From budget trips to luxury escapes, we make travel safe and memorable.
            </p>
          </div>
        <div className="grid md:grid-cols-3 gap-8 mt-5">
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
