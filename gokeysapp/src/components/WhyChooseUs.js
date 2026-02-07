export default function WhyChooseUs() {
  const items = [
    {
      title: "Government Registered",
      desc: "Authorized & recognized by Uttarakhand Tourism",
    },
    {
      title: "10+ Years of Expertise",
      desc: "Successfully delivered 1000+ spiritual & leisure journeys",
    },
    {
      title: "Transparent Pricing",
      desc: "No hidden charges, no misleading offers — ever",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Why Travel with <span className="text-brand-600">Gokeys</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Trusted by thousands of travelers for spiritual journeys, Himalayan adventures,
            and thoughtfully curated holidays across India.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to <strong>Gokeys India</strong>, a trusted{" "}
            <strong>travel company based in Haridwar</strong>, specializing in
            spiritual journeys and Himalayan experiences. With over a decade of
            expertise and official authorization from{" "}
            <strong>Uttarakhand Tourism</strong>, we design seamless group and
            customized travel programs including{" "}
            <strong>Char Dham Yatra</strong>.
          </p>

          <p>
            From the serene landscapes of <strong>Auli</strong> and{" "}
            <strong>Chopta</strong> to the breathtaking{" "}
            <strong>Valley of Flowers</strong>, <strong>Hemkund Sahib</strong>,
            and adventure experiences like rafting and camping in{" "}
            <strong>Rishikesh</strong> — every journey is crafted with care,
            safety, and local expertise.
          </p>

          <p>
            Our dedicated team ensures smooth{" "}
            <strong>cab services</strong>, hotel bookings, and guided tours with
            complete pricing transparency. Explore our{" "}
            <a
              href="/tours"
              className="text-brand-600 font-semibold hover:underline"
            >
              best-selling tours
            </a>{" "}
            or{" "}
            <a
              href="/contact"
              className="text-brand-600 font-semibold hover:underline"
            >
              connect with our travel experts
            </a>{" "}
            to plan your next journey with confidence.
          </p>
        </div>

        {/* Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {items.map((item, idx) => (
            <div
            key={idx}
            className={`relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all
              ${
                idx === 0
                  ? "before:bg-orange-400"
                  : idx === 1
                  ? "before:bg-brand-500"
                  : "before:bg-emerald-500"
              }
              before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-2xl`}
          >
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {item.title}
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {item.desc}
            </p>
          </div>
          ))}
        </div>

      </div>
    </section>
  );
}
