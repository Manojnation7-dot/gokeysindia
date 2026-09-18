import SearchPageClient from './SearchPageClient';
import { buildMetadata } from '@/lib/seoHelpers';

export const dynamic = 'force-dynamic'; // ensure dynamic rendering

function searchMetadata(params) {
  const query = typeof params?.q === 'string' ? params.q : '';
  const type = typeof params?.type === 'string' ? params.type : '';
  const page = Number(params?.page);
  const canonicalParams = new URLSearchParams();
  if (query) canonicalParams.set('q', query);
  if (type) canonicalParams.set('type', type);
  if (Number.isInteger(page) && page > 1) canonicalParams.set('page', String(page));
  const suffix = canonicalParams.toString();
  return buildMetadata({
    title: query ? `Search results for "${query}"` : 'Search',
    description: query
      ? `Search results for "${query}" across tours, destinations and blogs.`
      : 'Search tours, destinations and travel blogs from Gokeys India.',
    path: `/search${suffix ? `?${suffix}` : ''}`,
    image: '/images/gokeyslogo.png',
  });
}

export async function generateMetadata({ searchParams }) {
  return searchMetadata(await searchParams);
}

export default async function SearchPage({ searchParams }) {
  const metadata = searchMetadata(await searchParams);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          name: metadata.title,
          description: metadata.description,
          url: metadata.alternates.canonical,
        }).replace(/</g, '\\u003c') }}
      />
      <SearchPageClient />
    </>
  );
}
