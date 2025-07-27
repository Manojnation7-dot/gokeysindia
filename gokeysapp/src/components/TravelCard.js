export default function TravelCard({ title, description, image }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-103 duration-500 hover:shadow-xl">
        <img src={image} alt={title} className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110" />
        <div className="p-4">
          <h2 className="text-lg font-semibold text-blue-700">{title}</h2>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
      </div>
    );
  }
  