import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InquiryFormCard from '@/components/SimpleEnquiryForm';
import SmartSEO from '@/components/SmartSEO';
import { StoryCard, postDate, postImage } from '@/components/TravelStories';
import { Breadcrumbs } from '@/components/ui/kit';
import { pageHref } from '@/lib/blog';

// Category chips: plain links, the current one highlighted
function CategoryChips({ categories, active }) {
  if (!categories?.length) return null;
  const chip = 'h-9 px-4 shrink-0 whitespace-nowrap inline-flex items-center rounded-full text-sm font-bold border transition-colors';
  const on = 'bg-ink text-white border-ink';
  const off = 'bg-white text-ink border-line hover:border-ink';
  return (
    // phones: one row that scrolls sideways; wider screens: wrapped rows
    <nav aria-label="Blog categories"
         className="flex gap-2 mt-6 overflow-x-auto -mx-4 px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap sm:overflow-visible">
      <a href="/blog" className={`${chip} ${active ? off : on}`} aria-current={active ? undefined : 'page'}>All</a>
      {categories.map((c) => (
        <a key={c.slug} href={`/blog/category/${c.slug}`} aria-current={active === c.slug ? 'page' : undefined}
           className={`${chip} ${active === c.slug ? on : off}`}>
          {c.name}
        </a>
      ))}
    </nav>
  );
}

// Plain <a href> links to every page, so each one can be crawled
function Pagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex flex-wrap justify-center items-center gap-2 mt-10" aria-label="Pagination">
      {currentPage > 1 && <a href={pageHref(basePath, currentPage - 1)} rel="prev" className="gk-pill">Previous</a>}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <a
          key={n}
          href={pageHref(basePath, n)}
          aria-current={currentPage === n ? 'page' : undefined}
          className={`h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-full text-sm font-bold ${
            currentPage === n ? 'bg-ink text-white' : 'bg-white border border-line text-ink'
          }`}
        >
          {n}
        </a>
      ))}
      {currentPage < totalPages && <a href={pageHref(basePath, currentPage + 1)} rel="next" className="gk-pill">Next</a>}
    </nav>
  );
}

// A blog archive page: /blog or /blog/category/<slug>
export default function BlogListPage({
  posts = [],
  currentPage = 1,
  totalPages = 1,
  basePath = '/blog',
  heading = 'Travel Blog',
  eyebrow = 'Travel stories and experiences',
  intro = 'Discover inspiring travel stories, tips, and destinations from around the world.',
  breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Blog' }],
  schema,
  categories = [],
  activeCategory = null,
}) {
  const [featured, ...rest] = posts;
  const featuredCategory = featured?.category?.name || featured?.categories?.[0]?.name;

  return (
    <>
      <Header />
      <SmartSEO schema={schema} />
      <main className="bg-mist">
        <div className="gk-wrap pt-10 pb-16">
          <Breadcrumbs items={breadcrumbs} />
          <p className="gk-eyebrow mb-2">{eyebrow}</p>
          <h1 className="gk-h1">{heading}</h1>
          {intro && <p className="gk-lead mt-3 max-w-3xl">{intro}</p>}
          <CategoryChips categories={categories} active={activeCategory} />

          {featured ? (
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
                    {featuredCategory && <span className="gk-chip">{featuredCategory}</span>}
                    {currentPage === 1 && <span className="text-xs text-slate-ink">Featured</span>}
                  </div>
                  <h2 className="gk-h2">{featured.title}</h2>
                  <p className="gk-lead mt-3 line-clamp-3">{featured.content}</p>
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
                  {rest.map((post) => <StoryCard key={post.slug} post={post} />)}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="mt-4 text-slate-ink">No blog posts available yet. Check back soon!</p>
            </div>
          )}

          <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />

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
