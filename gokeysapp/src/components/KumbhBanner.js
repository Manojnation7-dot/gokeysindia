import Image from "next/image";
import Link from "next/link";
import { Mountains } from "@/components/ui/kit";
import { CACHED } from "@/lib/api";

// Shown until the backend has the "Featured promo" table (migration 0026)
const FALLBACK = {
  eyebrow: "Ardh Kumbh Mela, Jan to Apr 2027",
  title: "Plan Ardh Kumbh Mela Haridwar 2027 early",
  text: "Hotels near the ghats, cabs and ready packages. Rooms fill fast in Kumbh season, so book your dates now.",
  image: null,
  image_alt: "",
  button_label: "View Kumbh packages",
  button_link: "/search?q=kumbh",
  whatsapp_message: "Hello Gokeys India, I want to enquire about Ardh Kumbh 2027.",
};

// Home page promo band, edited in Django admin: "Featured promos (home page)".
// API answers: a promo -> show it; null -> no active promo, show nothing;
// error / 404 (backend not migrated yet) -> show the fallback above.
async function getPromo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-promo/`, CACHED);
    if (!res.ok) return FALLBACK;
    return await res.json();
  } catch {
    return FALLBACK;
  }
}

const safeLink = (link) => (/^(\/(?!\/)|https:\/\/)/.test(link || "") ? link : "/tours");

export default async function KumbhBanner() {
  const promo = await getPromo();
  if (!promo?.title) return null;

  const href = safeLink(promo.button_link);
  const external = href.startsWith("https://");

  return (
    <section className="gk-wrap pb-14 md:pb-18">
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden bg-ink">
        <div className="p-7 md:p-10">
          {promo.eyebrow && <p className="gk-eyebrow gk-eyebrow-sun mb-3">{promo.eyebrow}</p>}
          <h2 className="gk-h2 text-white!">{promo.title}</h2>
          {promo.text && <p className="mt-3 text-slate-300">{promo.text}</p>}
          <div className="flex flex-wrap gap-3 mt-6">
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="gk-btn gk-btn-sun">{promo.button_label}</a>
            ) : (
              <Link href={href} className="gk-btn gk-btn-sun">{promo.button_label}</Link>
            )}
            {promo.whatsapp_message && (
              <a
                href={`https://wa.me/917830718687?text=${encodeURIComponent(promo.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gk-btn gk-btn-wa"
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>
        {promo.image ? (
          <div className="relative h-56 md:h-full min-h-56">
            <Image src={promo.image} alt={promo.image_alt || promo.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        ) : (
          <Mountains scene="sunset" className="w-full h-48 md:h-full" />
        )}
      </div>
    </section>
  );
}
