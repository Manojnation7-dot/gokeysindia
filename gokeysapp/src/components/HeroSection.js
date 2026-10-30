import Link from "next/link";

const QUICK_LINKS = [
  { label: "Char Dham Yatra", href: "/search?q=char+dham" },
  { label: "Kedarnath", href: "/destinations/kedarnath" },
  { label: "Auli Chopta", href: "/tours/auli-chopta-tour-package" },
  { label: "Harsil Valley", href: "/destinations/harsil" },
  { label: "Plan your budget", href: "/char-dham-yatra-cost-calculator" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* The LCP image. Images are served unoptimized (next.config), so the sizes are made by hand: 1200 px WebP on
          phones, 1600 px on wider screens. Plain <picture>: the browser fetches only the matching file, at high priority. */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/hero-bg-1200.webp" type="image/webp" />
        <img
          src="/images/hero-bg-1600.webp"
          alt="Himalayan Adventure"
          width={1600}
          height={900}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-60 text-transparent"
        />
      </picture>
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/20" />

      <div className="relative gk-wrap py-16 md:py-24">
        <p className="gk-eyebrow gk-eyebrow-sun mb-4">Haridwar, Uttarakhand</p>
        <h1 className="gk-h1 text-white! max-w-xl">Travel Agency in Haridwar for Char Dham &amp; Uttarakhand Trips</h1>
        <p className="mt-5 max-w-lg text-slate-200 leading-relaxed">
          India&apos;s trusted travel agency based in Haridwar — curated group journeys from sacred Char Dham and
          Kedarnath to Adi Kailash, 12 Jyotirlinga pilgrimages, and unforgettable Himalayan treks.
        </p>

        <form
          action="/search"
          method="get"
          role="search"
          className="mt-8 max-w-2xl bg-white rounded-2xl p-3 grid gap-3 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end shadow-xl"
        >
          <label className="block">
            <span className="gk-label">Search destinations or tours</span>
            <input
              type="search"
              name="q"
              required
              maxLength={100}
              placeholder="Kedarnath, Auli Chopta, Char Dham"
              className="gk-field"
            />
          </label>
          <label className="block">
            <span className="gk-label">I am looking for</span>
            <select name="type" defaultValue="" className="gk-field">
              <option value="">Everything</option>
              <option value="tour">Tour packages</option>
              <option value="group-tour">Group tours</option>
              <option value="destination">Destinations</option>
              <option value="blog">Travel guides</option>
            </select>
          </label>
          <button type="submit" className="gk-btn gk-btn-ink h-10.5">Search</button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {QUICK_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="gk-chip gk-chip-sun hover:bg-sun hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
