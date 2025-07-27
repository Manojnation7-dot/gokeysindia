  import Image from "next/image";
  
  export default function TourHead({ tourData }) {
    return (
      <section className="bg-white py-12 px-4">
  <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">
            {tourData.name} {tourData.starting_from}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
           
            
          </p>
        </div>

        {/* Image Gallery and Booking Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Gallery */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Big Image */}
              <div className="md:col-span-2 relative rounded-lg overflow-hidden shadow-md">
                <div className="aspect-w-16 aspect-h-9 min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={tourData.featured_image?.image || "https://via.placeholder.com/800x500"}
                    alt={tourData.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Smaller Images */}
              <div className="md:col-span-1 flex flex-col gap-4">
                {tourData.gallery_images?.slice(0, 2).map((img, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
                    <div className="aspect-w-16 aspect-h-9 min-h-[150px] md:min-h-[190px]">
                      <Image
                        src={img.image || "https://via.placeholder.com/400x300"}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:w-80 bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold">Deluxe room</h3>
            <p className="text-sm text-gray-600">Fits 2 Adults</p>
            <p className="text-sm text-gray-600">• No meals included</p>
            <p className="text-sm text-green-600">
              • Free Cancellation till 24 hrs before check in
            </p>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-800">
                ₹{parseFloat(tourData.base_price).toLocaleString() || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Total Price</p>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              BOOK THIS NOW
            </button>
          </div>
        </div>
        </section>
        );
  }