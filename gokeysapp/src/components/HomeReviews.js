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
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
          What Our Travelers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic">"{review.text}"</p>
              <p className="mt-4 font-semibold">- {review.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/place/Gokeys+(Travel+In+Himalayas)+%7C+Travel+Agency+Haridwar/@29.9441709,78.1485517,17z/data=!3m1!4b1!4m6!3m5!1s0x390947f7e97f2c95:0xf0785b5ce98c08e9!8m2!3d29.9441709!4d78.1511266!16s%2Fg%2F11h336_sxd?entry=ttu&g_ep=EgoyMDI1MDgxMy4wIKXMDSoASAFQAw%3D%3D" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Read More Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
