import { CACHED } from "@/lib/api";

const shortTitle = (title, maxLength = 38) => {
  if (!title) return "";
  const clean = title.split("|")[0].trim(); // remove "| Gokeys India"
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + "...";
};

export default async function MostSearchedPackages() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.gokeys.in";
  const res = await fetch(`${apiUrl}/api/most-viewed-packages/`, CACHED);

  if (!res.ok) return null;

  const packages = await res.json();
  if (!packages || packages.length === 0) return null;

  return (
    <section className="gk-wrap pb-14">
      <h2 className="gk-h3">Most Searched Packages</h2>
      <p className="mt-1 mb-4 text-[15px] text-slate-ink">
        Explore the packages travelers are searching for the most — curated,
        trusted, and ready to book.
      </p>
      <ul className="flex flex-wrap gap-2.5">
        {packages.map((pkg, idx) => (
          <li key={idx}>
            <a href={pkg.link} title={pkg.title} className="gk-pill">
              {shortTitle(pkg.title, 40)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
