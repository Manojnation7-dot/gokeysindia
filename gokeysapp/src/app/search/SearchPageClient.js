'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  return path ? `${base}${path}` : '/images/placeholder.jpg';
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
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  };

  const highlightMatch = (text, query) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const availableTypes = ['', 'tour', 'group-tour', 'destination', 'blog'];

  return (
    <>
      <Header />
      <Head>
        <title>Search results for "{query}" | Gokeys India</title>
        <meta name="description" content={`Search results for "${query}" across tours, destinations, blogs.`} />
        <link rel="canonical" href={`https://gokeys.in/search?q=${encodeURIComponent(query)}`} />
        <meta property="og:title" content={`Search results for "${query}" | GoKeys`} />
        <meta property="og:description" content={`Browse curated tours, blogs and destinations matching "${query}"`} />
        <meta property="og:url" content={`https://gokeys.in/search?q=${encodeURIComponent(query)}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SearchResultsPage",
              name: `Search results for ${query}`,
              description: `Tours, blogs, and destinations matching ${query}`,
              url: `https://gokeys.in/search?q=${encodeURIComponent(query)}`,
            }),
          }}
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Results for "{query}"</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {availableTypes.map((t) => (
            <button
              key={t || 'all'}
              onClick={() => router.push(`/search?q=${query}&type=${t}&page=1`)}
              className={`px-4 py-1 rounded-full border text-sm capitalize ${
                t === type || (!t && !type)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-blue-600 text-blue-600'
              }`}
            >
              {t === '' ? 'All' : t.replace('-', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500 italic">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => {
              const itemType = item.type;
              const link = contentRoutes[itemType] && item.slug
                ? `${contentRoutes[itemType]}${item.slug}`
                : '#';
              const imageUrl = getImageUrl(item);

              return (
                <Link
                  key={`${itemType}-${item.id}`}
                  href={link}
                  className="block border border-gray-200 rounded-lg p-4 hover:shadow transition"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={item.name || item.title}
                      width={400}
                      height={300}
                      className="w-full h-40 object-cover rounded-md mb-3"
                      loading="lazy"
                    />
                  )}
                  <div className="text-blue-700 text-lg font-semibold flex items-center gap-2">
                    <span>{icons[itemType]}</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(item.name || item.title || 'Untitled', query),
                      }}
                    />
                  </div>
                  {item.duration && (
                    <div className="text-sm text-gray-600">{item.duration} Days</div>
                  )}
                  <div
                    className="mt-2 text-sm text-gray-500 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(
                        stripHtml(
                          item.description || item.summary || item.content || item.excerpt || ''
                        ).slice(0, 120),
                        query
                      ),
                    }}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {!loading && count > results.length && (
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: Math.ceil(count / 9) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => router.push(`/search?q=${query}&type=${type}&page=${i + 1}`)}
                className={`px-3 py-1 border rounded text-sm ${
                  page === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
