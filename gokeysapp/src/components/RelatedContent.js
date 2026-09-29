import Link from "next/link";
import Image from "next/image";

const TYPE_LABELS = {
  tour: "Tour",
  "group-tour": "Group tour",
  destination: "Destination",
  sightseeing: "Place to visit",
  blog: "Travel guide",
};

function subtitle(item) {
  if (item.type === "tour" || item.type === "group-tour") {
    const parts = [];
    if (item.duration_nights) parts.push(`${item.duration_nights}N`);
    if (item.duration_days) parts.push(`${item.duration_days}D`);
    const duration = parts.join(" / ");
    const price = item.base_price > 0 ? `from ₹${Number(item.base_price).toLocaleString("en-IN")}` : "";
    return [duration, price].filter(Boolean).join(" · ");
  }
  if (item.type === "blog" && item.published_date) {
    return new Date(item.published_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  return "";
}

// Grid of related tours / destinations / places / posts picked in the admin.
// `items` are the API "cards": { type, name, slug, url, image, ... }. Renders nothing when empty.
export default function RelatedContent({ title, items, className = "" }) {
  const list = (items || []).filter((item) => item?.url);
  if (!list.length) return null;

  return (
    <section className={`max-w-7xl mx-auto px-4 my-12 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.url}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
          >
            <div className="relative h-44 bg-gray-100 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : null}
              <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold text-gray-800 px-2 py-1 rounded">
                {TYPE_LABELS[item.type] || "Related"}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 line-clamp-2">{item.name}</h3>
              {subtitle(item) && <p className="text-sm text-gray-600 mt-1">{subtitle(item)}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
