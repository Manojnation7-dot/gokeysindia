// Shared building blocks for the new UI. Server components only (no client JS),
// so they add nothing to the page's JavaScript bundle.
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const PLACEHOLDER = "/images/placeholder.jpg";
export const cardImage = (img) => img?.optimized_card || img?.image || PLACEHOLDER;

export function SectionHead({ eyebrow, title, text, href, linkLabel, className = "" }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 mb-7 ${className}`}>
      <div>
        {eyebrow && <p className="gk-eyebrow mb-2">{eyebrow}</p>}
        <h2 className="gk-h2">{title}</h2>
        {text && <p className="mt-2 gk-lead max-w-2xl">{text}</p>}
      </div>
      {href && (
        <Link href={href} className="gk-btn gk-btn-line">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

// Standard package price -> discount price, else price, else tour base price.
export function tourPrice(tour) {
  const pkg = tour.pricing?.find((p) => p.package_type === "standard") || tour.pricing?.[0];
  if (pkg?.price_on_request) return { onRequest: true };
  const value = Number(pkg?.discount_price || pkg?.price || tour.base_price) || null;
  const original = pkg?.discount_price && Number(pkg.price) > Number(pkg.discount_price) ? Number(pkg.price) : null;
  return { value, original };
}

export const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export function Price({ tour, size = "text-xl", unit = "per person" }) {
  const { onRequest, value, original } = tourPrice(tour);
  if (onRequest || !value) return <p className="text-[15px] font-bold text-slate-ink">Price on request</p>;
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className={`gk-price ${size}`}>{rupees(value)}</span>
      {original && <span className="text-xs text-slate-400 line-through">{rupees(original)}</span>}
      <span className="text-xs text-slate-ink">{unit}</span>
    </p>
  );
}

// `footer` renders below the linked area (for extra buttons such as WhatsApp or Quote),
// so buttons never sit on top of each other and links are not nested.
export function TourCard({ tour, href, chips = [], imgHeight = "h-40", priority = false, badge, footer, children }) {
  const list = chips.filter(Boolean);
  const body = (
    <>
      <div className={`gk-media ${imgHeight}`}>
        <Image
          src={cardImage(tour.featured_image)}
          alt={tour.featured_image?.alt_text || tour.name}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {badge && <span className="absolute top-3 left-3 gk-chip bg-white!">{badge}</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {list.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {list.map((c, i) => (
              <span key={i} className={`gk-chip ${i === 0 && list.length > 1 ? "gk-chip-sun" : ""}`}>{c}</span>
            ))}
          </div>
        )}
        <h3 className="gk-h3 mb-3 line-clamp-3">{tour.name}</h3>
        <div className="mt-auto">{children || <Price tour={tour} />}</div>
      </div>
    </>
  );

  if (!footer) {
    return (
      <Link href={href} className="gk-card gk-card-hover group flex flex-col h-full">
        {body}
      </Link>
    );
  }
  return (
    <div className="gk-card gk-card-hover flex flex-col h-full">
      <Link href={href} className="group flex flex-col flex-1">
        {body}
      </Link>
      <div className="px-4 pb-4 flex items-center gap-2.5">{footer}</div>
    </div>
  );
}

export function PlaceCard({ href, image, alt, title, text, chip, sub, imgHeight = "h-40" }) {
  return (
    <Link href={href} className="gk-card gk-card-hover group flex flex-col h-full">
      <div className={`gk-media ${imgHeight}`}>
        <Image
          src={image || PLACEHOLDER}
          alt={alt || title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex-1">
        {chip && <span className="gk-chip mb-2">{chip}</span>}
        <h3 className="gk-h3">{title}</h3>
        {sub && <p className="text-xs text-slate-ink mt-0.5">{sub}</p>}
        {text && <p className="text-[15px] text-slate-ink mt-1.5 line-clamp-2">{text}</p>}
      </div>
    </Link>
  );
}

// Orange (sun) or dark (ink) call-to-action band
export function CtaBand({ title, text, tone = "sun", children }) {
  const dark = tone === "ink";
  return (
    <div className={`rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 ${dark ? "bg-ink text-white" : "bg-sun text-ink"}`}>
      <div className="max-w-xl">
        <h2 className={`gk-h2 ${dark ? "text-white!" : ""}`}>{title}</h2>
        {text && <p className={`mt-2 text-sm md:text-base ${dark ? "text-slate-300" : "text-ink/80"}`}>{text}</p>}
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

// Accordion built on <details>, so answers stay in the HTML for search engines
export function FaqList({ items, white = true }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={i} className={`gk-faq rounded-xl ${white ? "bg-white" : "bg-mist"} border border-line`} open={i === 0}>
          <summary className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-ink">
            {f.question}
            <ChevronDown size={18} className="gk-faq-icon shrink-0 transition-transform" />
          </summary>
          {f.html ? (
            <div className="px-5 pb-4 -mt-1 text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: f.html }} />
          ) : (
            <p className="px-5 pb-4 -mt-1 text-[15px] text-slate-ink leading-relaxed">{f.answer}</p>
          )}
        </details>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items, light = false }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`gk-crumbs mb-3 ${light ? "text-white! font-medium [text-shadow:0_1px_3px_rgba(0,0,0,.45)] [&_a:hover]:text-sun!" : ""}`}
    >
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className={light ? "text-white/70" : ""}> / </span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

// Decorative mountain scene from the design, used where no photo is available
const SCENES = {
  dusk: ["#3b4a7a", "#c98d6a", "#3b3a62", "#1d2140"],
  sunset: ["#f6d79a", "#f0b26b", "#b4673a", "#5f3220"],
  teal: ["#a9d2e3", "#d6ebef", "#4e8c95", "#1d5560"],
  mist: ["#cfd9dc", "#e3e9ea", "#7f9c9b", "#3f6265"],
};
export function Mountains({ scene = "sunset", className = "" }) {
  const [top, bottom, back, front] = SCENES[scene] || SCENES.sunset;
  const id = `gk-sky-${scene}`;
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id})`} />
      <circle cx="300" cy="62" r="20" fill="#fff" opacity=".75" />
      <path d="M0 175 90 95l60 55 80-90 90 75 80-40v145H0z" fill={back} />
      <path d="M0 205 110 165l100 35 110-40 80 30v50H0z" fill={front} />
    </svg>
  );
}

// Compact links for items beyond the cards shown, so no internal link is lost (SEO)
export function MoreLinks({ label, items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-ink mr-1">{label}</span>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="gk-pill">{it.label}</Link>
      ))}
    </div>
  );
}
