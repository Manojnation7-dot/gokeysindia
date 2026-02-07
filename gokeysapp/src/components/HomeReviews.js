// components/ReviewsSection.js
export default function HomeReviews() {
  const reviews = [
    {
      name: "Rahul Sharma",
      text: "Our Char Dham Yatra was perfectly organized by Gokeys India. Hotels, transport, and darshan — everything went smoothly!",
      rating: 5,
    },
    {
      name: "Priya Verma",
      text: "Best travel agent in Haridwar! Booked a Kedarnath package and it was hassle-free with great support throughout.",
      rating: 5,
    },
    {
      name: "Anil Mehta",
      text: "Transparent pricing and no hidden charges. I highly recommend Gokeys for family trips in Uttarakhand.",
      rating: 4,
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-brand-50/40 via-white to-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            What Our <span className="text-brand-600">Travelers Say</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Trusted by thousands of pilgrims and travelers for safe,
            transparent, and well-organized journeys across India.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <span key={i} className="text-gray-300 text-lg">★</span>
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-600 italic leading-relaxed">
                “{review.text}”
              </p>

              {/* Name */}
              <p className="mt-6 font-semibold text-gray-900">
                — {review.name}
              </p>
            </div>
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center mt-14">
          <a
            href="https://www.google.com/maps/place/Gokeys+(Travel+In+Himalayas)+%7C+Travel+Agency+Haridwar/@29.9441709,78.1485517,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition shadow-sm"
          >
            Read More Reviews on Google →
          </a>
        </div>

      </div>
    </section>
  );
}
