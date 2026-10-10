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
    <section className="gk-section bg-white">
      <div className="gk-wrap">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="gk-eyebrow mb-2">Reviews</p>
            <h2 className="gk-h2">What Our Travelers Say</h2>
            <p className="mt-2 gk-lead max-w-2xl">
              Trusted by thousands of pilgrims and travelers for safe,
              transparent, and well-organized journeys across India.
            </p>
          </div>
          <a
            href="https://www.google.com/maps/place/Gokeys+(Travel+In+Himalayas)+%7C+Travel+Agency+Haridwar/@29.9441709,78.1485517,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="gk-btn gk-btn-line"
          >
            Read More Reviews on Google →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-mist rounded-2xl p-6 flex flex-col">
              <div className="flex items-center mb-3" aria-label={`${review.rating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-sun" : "text-slate-300"}>★</span>
                ))}
              </div>
              <p className="text-[15px] text-slate-ink leading-relaxed">“{review.text}”</p>
              <p className="mt-4 text-[15px] font-bold text-ink">— {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
