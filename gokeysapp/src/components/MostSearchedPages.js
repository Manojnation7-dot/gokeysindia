const shortTitle = (title, maxLength = 38) => {
  if (!title) return "";
  const clean = title.split("|")[0].trim(); // remove "| Gokeys India"
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + "...";
};

export default async function MostSearchedPackages() {
  const res = await fetch("https://api.gokeys.in/api/most-viewed-packages/", {
    next: { revalidate: 300 }, // cache 5 minutes
  });

  if (!res.ok) return null;

  const packages = await res.json();
  if (!packages || packages.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white via-brand-50/40 to-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Most <span className="text-brand-600">Searched</span> Packages
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Explore the packages travelers are searching for the most — curated,
            trusted, and ready to book.
          </p>
        </div>

        {/* Package Grid */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {packages.map((pkg, idx) => {
            const displayTitle = shortTitle(pkg.title, 26);

            return (
              <li key={idx}>
                <a
                  href={pkg.link}
                  title={pkg.title}
                  className="
                    block h-full px-5 py-4 text-center
                    bg-white rounded-2xl border border-gray-100
                    shadow-sm hover:shadow-xl
                    hover:border-brand-200
                    transition-all duration-300
                    text-sm font-semibold text-gray-800
                    hover:text-brand-700
                  "
                >
                  {displayTitle}
                </a>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
