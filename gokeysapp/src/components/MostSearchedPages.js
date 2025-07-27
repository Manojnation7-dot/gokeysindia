export default function MostSearchedPackages() {
  const packages = [
    { title: "Char Dham Yatra", link: "/packages/char-dham-yatra" },
    { title: "Adi Kailash Yatra", link: "/packages/adi-kailash-yatra" },
    { title: "Valley of Flowers", link: "/packages/valley-of-flowers" },
    { title: "Kedarnath Yatra", link: "/packages/kedarnath-yatra" },
    { title: "Badrinath Tour", link: "/packages/badrinath-tour" },
    { title: "Auli Snow Tour", link: "/packages/auli-snow-tour" },
    { title: "Hemkund Sahib Yatra", link: "/packages/hemkund-sahib" },
    { title: "Panch Kedar Tour", link: "/packages/panch-kedar" },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">
          Most Searched Packages
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {packages.map((pkg, idx) => (
            <li key={idx}>
              <a
                href={pkg.link}
                className="block p-4 bg-gradient-to-r from-blue-50 to-gray-100 rounded-full shadow hover:from-yellow-100 hover:to-orange-100"
              >
                {pkg.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
