const TourHero = () => {
    return (
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image */}
          <div className="lg:col-span-2">
            <img
              src="/tours/kedarnath.jpg"
              alt="Kedarnath Tour"
              className="rounded-2xl shadow-lg w-full h-96 object-cover"
            />
          </div>
  
          {/* Right: Quick Overview */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Kedarnath Yatra Package</h1>
            <div className="space-y-2 text-gray-700">
              <p><strong>Duration:</strong> 4 Days / 3 Nights</p>
              <p><strong>Destination:</strong> Haridwar – Guptkashi – Kedarnath</p>
              <p><strong>Starting Price:</strong> ₹8,999/person</p>
              <p><strong>Best Time:</strong> May – October</p>
            </div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Enquire Now
            </button>
          </div>
        </div>
      </section>
    );
  };
  
  export default TourHero;