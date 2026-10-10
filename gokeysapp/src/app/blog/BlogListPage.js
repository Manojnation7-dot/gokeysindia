import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InquiryFormCard from '@/components/SimpleEnquiryForm';
import { buildBreadcrumbList } from '@/lib/seoSchemas';
import SmartSEO from '@/components/SmartSEO';
import { StoryCard, postDate, postImage } from '@/components/TravelStories';
import { Breadcrumbs } from '@/components/ui/kit';

const pageHref = (n) => (n <= 1 ? '/blog' : `/blog?page=${n}`);

export default function BlogListPage({ blogPosts, currentPage = 1, totalPages = 1 }) {
  const truncateHtmlToText = (html, maxLength = 150) => {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '');
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '...';
  };

  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const posts = Array.isArray(blogPosts) ? blogPosts : [];
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <SmartSEO schema={breadcrumbSchema} />
      <main className="bg-mist">
        <div className="gk-wrap pt-10 pb-16">
          {/* Hero Section */}
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <p className="gk-eyebrow mb-2">Travel stories and experiences</p>
          <h1 className="gk-h1">Travel Blog</h1>
          <p className="gk-lead mt-3 max-w-2xl">
            Discover inspiring travel stories, tips, and destinations from around the world.
          </p>

          {posts.length > 0 ? (
            <>
              {/* Featured (first) post */}
              <Link href={`/blog/${featured.slug}`} className="gk-card gk-card-hover group grid md:grid-cols-2 mt-8">
                <div className="gk-media h-60 md:h-full md:min-h-80">
                  <Image
                    src={postImage(featured)}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-9 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {featured.categories.map((cat, idx) => (
                      <span key={idx} className="gk-chip">{cat.name}</span>
                    ))}
                    {currentPage === 1 && <span className="text-xs text-slate-ink">Featured</span>}
                  </div>
                  <h2 className="gk-h2">{featured.title}</h2>
                  <p className="gk-lead mt-3 line-clamp-3">{truncateHtmlToText(featured.content, 200)}</p>
                  {featured.published_date && (
                    <p className="text-xs text-slate-ink mt-4">
                      Gokeys team · {postDate(featured.published_date)}
                      {featured.read_minutes ? ` · ${featured.read_minutes} min read` : ""}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                    Read More <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                  {rest.map((post) => (
                    <StoryCard key={post.slug} post={{ ...post, content: truncateHtmlToText(post.content) }} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="mt-4 text-slate-ink">No blog posts available yet. Check back soon!</p>
            </div>
          )}

          {/* Pagination: real links so every page can be crawled */}
          {totalPages > 1 && (
            <nav className="flex flex-wrap justify-center items-center gap-2 mt-10" aria-label="Pagination">
              {currentPage > 1 && (
                <Link href={pageHref(currentPage - 1)} className="gk-pill">Previous</Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={pageHref(pageNum)}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                  className={`h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-full text-sm font-bold ${
                    currentPage === pageNum ? 'bg-ink text-white' : 'bg-white border border-line text-ink'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link href={pageHref(currentPage + 1)} className="gk-pill">Next</Link>
              )}
            </nav>
          )}

          <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
            <div>
              <h2 className="gk-h2">Plan the trip behind the story</h2>
              <p className="gk-lead mt-3">
                Read something you like? Send us a question and a planner replies with a plan and a price.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <Link href="/tours" className="gk-pill">Tour packages</Link>
                <Link href="/grouptour" className="gk-pill">Group tours</Link>
                <Link href="/destinations" className="gk-pill">Destinations</Link>
                <Link href="/cabs" className="gk-pill">Cabs</Link>
              </div>
            </div>
            <InquiryFormCard placeName="Post Page" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
