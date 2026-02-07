import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-2xl text-center">

        {/* Big 404 */}
        <h1 className="text-7xl font-bold text-gray-900 mb-4">404</h1>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Oops! This page seems to have gone on a trip ✈️
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been moved, removed,
          or never existed. But don’t worry — your journey can still continue.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">

          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Go to Homepage
          </Link>

          <Link
            href="/tours"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Tours
          </Link>

          <Link
            href="/destinations"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            View Destinations
          </Link>

        </div>

        {/* Popular Links */}
        <div className="text-sm text-gray-500">
          <p className="mb-2 font-medium text-gray-700">Popular Searches</p>

          <div className="flex flex-wrap gap-3 justify-center">

            <Link href="/tours/char-dham-yatra-2025-tour-package-from-haridwar" className="hover:underline">
              Char Dham Yatra
            </Link>

            <Link href="/tours/kedarnath-deoria-tal-sari-village-tour-package" className="hover:underline">
              Kedarnath Yatra
            </Link>

            <Link href="/destinations/auli" className="hover:underline">
              Auli
            </Link>

            <Link href="/destinations/nainital" className="hover:underline">
              Nainital
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
