import Image from "next/image";
import Link from "next/link";
import { SectionHead, MoreLinks } from "@/components/ui/kit";

const categoryName = (c) => (typeof c === "string" ? c : c?.name);
export const postDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
export const postImage = (post) =>
  post.cover_image?.[0]?.optimized_card || post.cover_image?.[0]?.image || post.cover_image_url || "/images/placeholder.jpg";

export function StoryCard({ post }) {
  const cat = categoryName(post.categories?.[0]);
  return (
    <Link href={`/blog/${post.slug}`} className="gk-card gk-card-hover group flex flex-col h-full">
      <div className="gk-media h-44">
        <Image
          src={postImage(post)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        {cat && <span className="gk-chip self-start mb-2">{cat}</span>}
        <h3 className="gk-h3 line-clamp-2">{post.title}</h3>
        {post.content && <p className="text-[15px] text-slate-ink mt-1.5 line-clamp-2">{post.content.replace(/<[^>]+>/g, "")}</p>}
        {(post.published_date || post.read_minutes) && (
          <p className="text-xs text-slate-ink mt-auto pt-3">
            {[post.published_date && postDate(post.published_date), post.read_minutes && `${post.read_minutes} min read`].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function TravelStories({ posts = [], error = null }) {
  if (error || !posts.length) return null;

  return (
    <section className="gk-section">
      <div className="gk-wrap">
        <SectionHead
          eyebrow="Travel stories"
          title="Travel Stories & Experiences"
          text="Real journeys, spiritual moments, and unforgettable experiences shared by travelers exploring India with Gokeys."
          href="/blog"
          linkLabel="All articles"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post, idx) => (
            <StoryCard key={post.id || idx} post={post} />
          ))}
        </div>
        <MoreLinks
          label="More guides:"
          items={posts.slice(3).map((p) => ({ href: `/blog/${p.slug}`, label: p.title }))}
        />
      </div>
    </section>
  );
}
