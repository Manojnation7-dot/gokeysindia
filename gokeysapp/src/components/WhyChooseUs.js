export default function WhyChooseUs() {
  const items = [
    {
      title: "Registered Travel Agent in Haridwar",
      desc: "Authorized & recognized by Uttarakhand Tourism",
    },
    {
      title: "10+ Years of Expertise",
      desc: "Successfully delivered 1000+ spiritual & leisure journeys",
    },
    {
      title: "Transparent Pricing",
      desc: "No hidden charges on any Char Dham Yatra or tour package — ever",
    },
  ];

  return (
    <section className="py-20 px-6 bg-linear-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Why Gokeys is a Trusted <span className="text-brand-600">Travel Agent in Haridwar</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Trusted by thousands of travelers as a leading travel agency in Haridwar
            for spiritual journeys, Himalayan adventures, and thoughtfully curated
            Uttarakhand tour packages.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to <strong>Gokeys India</strong>, a government-registered{" "}
            <strong>travel agent in Haridwar</strong> specializing in spiritual
            journeys like <a href="https://gokeys.in/blog/char-dham-yatra-2027">Char Dham Yatra</a>{" "}
            and curated tours across Uttarakhand — from Mussoorie and Chopta to
            Rishikesh, Nainital, and Harsil. With over a decade of expertise and
            official authorization from <strong>Uttarakhand Tourism</strong>, we
            design seamless <strong>Char Dham Yatra tour packages</strong>, group
            tours, and customized travel programs for families, groups, and solo
            travelers.
          </p>

          <p>
            From the snow-capped slopes of{" "}
            <a href="/destinations/auli" className="text-brand-600 font-semibold hover:underline">Auli</a>{" "}
            to the Himalayan meadows of{" "}
            <a href="/destinations/chopta" className="text-brand-600 font-semibold hover:underline">Chopta</a>,
            and onward to the breathtaking{" "}
            <strong>Valley of Flowers</strong> and <strong>Hemkund Sahib</strong> —
            every journey is crafted with local expertise. Explore our Uttarakhand
            tour packages to{" "}
            <a href="/destinations/kedarnath" className="text-brand-600 font-semibold hover:underline">Kedarnath</a>,{" "}
            <a href="/destinations/yamunotri" className="text-brand-600 font-semibold hover:underline">Yamunotri</a>,{" "}
            <a href="/destinations/dhanaulti" className="text-brand-600 font-semibold hover:underline">Dhanaulti</a>,{" "}
            <a href="/destinations/chakrata" className="text-brand-600 font-semibold hover:underline">Chakrata</a>, and{" "}
            <a href="/destinations/harsil" className="text-brand-600 font-semibold hover:underline">Harsil Valley</a>,
            or try adventure experiences like river rafting and camping in Rishikesh.
            Gokeys India is recognized among the{" "}
            <a href="https://gokeys.in/blog/travel-agents-in-haridwar-char-dham-taxi-uttarakhand-tour-services">top travel agents in Haridwar</a>{" "}
            for Char Dham Yatra and hill station tours.
          </p>

          <p>
            As a full-service <strong>tour operator in Haridwar</strong>, our
            dedicated team ensures smooth <strong>taxi and cab booking</strong>,
            hotel reservations, and guided tours with complete pricing
            transparency. Popular short trips like our{" "}
            <a href="/tours/haridwar-rishikesh-neelkanth-tour-for-2-days" className="text-brand-600 font-semibold hover:underline">
              Haridwar Rishikesh Neelkanth 2-Day Tour
            </a>{" "}
            and{" "}
            <a href="/tours/badrinath-mussoorie-6-days-trip" className="text-brand-600 font-semibold hover:underline">
              Badrinath Mussoorie 6-Day Trip
            </a>{" "}
            are ready to book, or explore our{" "}
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