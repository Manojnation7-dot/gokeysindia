'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Breadcrumbs, CtaBand } from '@/components/ui/kit';

const icons = {
  tour: '🧳',
  'group-tour': '👥',
  destination: '📍',
  blog: '📝',
};

const contentRoutes = {
  tour: '/tours/',
  'group-tour': '/grouptour/',
  destination: '/destinations/',
  blog: '/blog/',
};

const getImageUrl = (item) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://gokeys.in';
  const path =
    item.featured_image?.optimized_card ||
    item.featured_image?.optimized_banner ||
    item.featured_image?.image ||
    item.cover_image_url ||
    '';
  if (!path) return '/images/placeholder.jpg';
  // The API already sends full URLs (https://api.gokeys.in/media/...)
  return /^https?:\/\//.test(path) ? path : `${base}${path}`;
};

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const q = searchParams.get('q') || '';
    const t = searchParams.get('type') || '';
    const p = parseInt(searchParams.get('page') || '1');

    setQuery(q);
    setType(t);
    setPage(p);
  }, [searchParams]);

  useEffect(() => {
    if (!query) return;

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/search/`);
    url.searchParams.set('q', query);
    if (type) url.searchParams.set('type', type);
    url.searchParams.set('page', page);

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setCount(data.count || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, type, page]);

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Escape first, then wrap matches in <mark>: API text can never inject HTML
  const escapeHtml = (text) =>
    String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const highlightMatch = (text, query) => {
    const safeText = escapeHtml(text || '');
    if (!query) return safeText;
    // Escape regex characters so searches like "(" or "c++" don't crash the page
    const safe = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safeText.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
  };

  const availableTypes = ['', 'tour', 'group-tour', 'destination', 'blog'];
  const typeLabels = { '': 'All', tour: 'Tours', 'group-tour': 'Group tours', destination: 'Destinations', blog: 'Travel guides' };
  const cardLabels = { tour: 'Tour', 'group-tour': 'Group tour', destination: 'Destination', blog: 'Travel guide' };
  const searchHref = (q, t, p = 1) =>
    `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(t || '')}&page=${p}`;
  const totalPages = Math.ceil(count / 9);

  return (
    <>
      <Header />
      <main className="bg-mist min-h-[70vh]">
        {/* Hero with search box */}
        <section className="bg-ink">
          <div className="gk-wrap py-10 md:py-12">
            <Breadcrumbs light items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
            <h1 className="gk-h1 text-white! text-3xl! md:text-[2.75rem]!">
              {query ? <>Results for &ldquo;<span className="text-sun">{query}</span>&rdquo;</> : 'Search Gokeys'}
            </h1>
            <form action="/search" method="get" role="search" className="mt-6 max-w-2xl bg-white rounded-2xl p-2.5 flex gap-2.5">
              <input
                key={query}
                type="search"
                name="q"
                defaultValue={query}
                required
                maxLength={100}
                aria-label="Search destinations or tours"
                placeholder="Kedarnath, Auli Chopta, Char Dham"
                className="gk-field flex-1"
              />
              <input type="hidden" name="type" value={type} />
              <button type="submit" className="gk-btn gk-btn-sun">Search</button>
            </form>
            <div className="flex flex-wrap gap-2 mt-5">
              {availableTypes.map((t) => {
                const active = t === type || (!t && !type);
                return (
                  <button
                    key={t || 'all'}
                    onClick={() => router.push(searchHref(query, t))}
                    aria-pressed={active}
                    className={`gk-pill ${active ? 'bg-sun! border-sun! text-ink!' : ''}`}
                  >
                    {typeLabels[t]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="gk-wrap py-10">
          {!loading && query && (
            <p className="text-sm text-slate-ink mb-5">
              {count} {count === 1 ? 'result' : 'results'}
              {type ? ` in ${typeLabels[type] || type}` : ''}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="gk-card animate-pulse">
                  <div className="h-44 bg-chip" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3 w-20 rounded bg-chip" />
                    <div className="h-5 w-3/4 rounded bg-chip" />
                    <div className="h-3 w-full rounded bg-chip" />
                  </div>
                </div>
              ))}
            </div>
          ) : !query ? (
            <p className="text-slate-ink">Type a destination, tour or place to search.</p>
          ) : results.length === 0 ? (
            <div className="gk-card p-8 text-center max-w-xl mx-auto">
              <h2 className="gk-h3">No results found.</h2>
              <p className="text-slate-ink mt-2">
                Try another word, or tell us where you want to go and a planner will suggest a trip.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                <Link href="/tours" className="gk-btn gk-btn-line">Browse tours</Link>
                <Link href="/contact" className="gk-btn gk-btn-sun">Plan my trip</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((item) => {
                const itemType = item.type;
                const link = contentRoutes[itemType] && item.slug
                  ? `${contentRoutes[itemType]}${item.slug}`
                  : '#';
                const imageUrl = getImageUrl(item);
                const snippet = stripHtml(
                  item.description || item.summary || item.content || item.excerpt || ''
                ).slice(0, 140);

                return (
                  <Link
                    key={`${itemType}-${item.id}`}
                    href={link}
                    className="gk-card gk-card-hover group flex flex-col h-full"
                  >
                    <div className="gk-media h-44">
                      <Image
                        src={imageUrl}
                        alt={item.name || item.title || 'Search result'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 gk-chip bg-white!">
                        {icons[itemType]} {cardLabels[itemType] || 'Result'}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3
                        className="gk-h3 line-clamp-2 [&_mark]:bg-sun-soft [&_mark]:text-ink [&_mark]:rounded [&_mark]:px-0.5"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.name || item.title || 'Untitled', query),
                        }}
                      />
                      {item.duration && (
                        <span className="gk-chip self-start mt-2">{item.duration} Days</span>
                      )}
                      {snippet && (
                        <p
                          className="mt-2 text-[15px] text-slate-ink line-clamp-2 [&_mark]:bg-sun-soft [&_mark]:text-ink [&_mark]:rounded [&_mark]:px-0.5"
                          dangerouslySetInnerHTML={{ __html: highlightMatch(snippet, query) }}
                        />
                      )}
                      <span className="mt-auto pt-4 text-sm font-bold text-teal">
                        View {(cardLabels[itemType] || 'details').toLowerCase()} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <nav className="mt-10 flex justify-center gap-2 flex-wrap" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => router.push(searchHref(query, type, i + 1))}
                  aria-current={page === i + 1 ? 'page' : undefined}
                  className={`h-9 min-w-9 px-3 rounded-full text-sm font-bold ${
                    page === i + 1 ? 'bg-ink text-white' : 'bg-white border border-line text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}

          <div className="mt-14">
            <CtaBand title="Cannot find what you are looking for?" text="Tell us your dates and who is travelling. A planner replies with a plan and a price.">
              <Link href="/contact" className="gk-btn gk-btn-ink">Get in touch</Link>
            </CtaBand>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
