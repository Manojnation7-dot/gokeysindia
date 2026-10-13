import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import TravelStories from '@/components/TravelStories';
import InquiryFormCard from '@/components/SimpleEnquiryForm';
import FAQSection from '@/components/FaqsDetails';
import RelatedContent from '@/components/RelatedContent';
import PreviewBanner from '@/components/PreviewBanner';
import { previewQuery } from '@/lib/preview';
import { buildMetadata, seoFromApi } from '@/lib/seoHelpers';
import { CACHED, cacheFor } from '@/lib/api';
import { slimPost, readMinutes } from '@/lib/slim';

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in';

// ---------------------------------------------------------------------------
// Schema builders — pure functions, no `other`/metadata involvement.
// If you already have buildBreadcrumbList / buildFAQSchema in a shared lib
// (as shown in your snippet), import those instead and delete the local
// copies below — just keep the calling pattern in BlogDetailPage the same.
// ---------------------------------------------------------------------------

function buildBreadcrumbSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };
}

function htmlToPlainText(html = '') {
  return html
    .replace(/<\/(p|li|div|h[1-6])>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Meta description as plain text: the SEO description, else the start of the post
function postDescription(post) {
  const text = htmlToPlainText(post.meta_description || '') || htmlToPlainText(post.content || '');
  return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text || undefined;
}

function buildFAQSchema(post) {
  if (!post.faqs || post.faqs.length === 0) return null;
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${postUrl}#faq`,
    mainEntityOfPage: { '@id': `${postUrl}#article` }, // links to BlogPosting @id below
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: htmlToPlainText(faq.answer),
      },
    })),
  };
}

function buildBlogPostingSchema(post) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    headline: post.meta_title || post.title,
    description: postDescription(post),
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_date,
    dateModified: post.updated_at || post.published_date,
    author: {
      '@type': 'Organization',
      name: 'Gokeys India',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gokeys India',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/gokeyslogo.png`,
      },
    },
  };
}

// Renders one or more JSON-LD objects as real <script> tags.
// Filters out any null entries (e.g. FAQ schema when there are no FAQs).
function JsonLd({ items }) {
  const valid = items.filter(Boolean);
  return (
    <>
      {valid.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

// Breadcrumb Component
function Breadcrumb({ post }) {

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: null },
  ];

  return (
    <nav aria-label="Breadcrumb" className="gk-crumbs mb-3">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:text-teal">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
          {index < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
}

export async function generateStaticParams() {
  let blogPosts = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/blogs/`, CACHED);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    blogPosts = Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('Error fetching blog post slugs:', error);
  }

  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// generateMetadata now ONLY handles actual <meta> tags — title, description,
// canonical, OpenGraph, Twitter. No JSON-LD here anymore. Structured data is built
// and rendered inside BlogDetailPage as real <script type="application/ld+json">
// tags, which is the only format Google's structured data parser reads.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = `${apiUrl}/api/blogs/${slug}/${await previewQuery()}`;
    const res = await fetch(url, cacheFor(url)); // same request as the page: fetched once
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    post = await res.json();
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
  }
  const seo = seoFromApi(post, { preview: Boolean(await previewQuery()) });

  if (!post) {
    return buildMetadata({
      title: 'Blog Not Found',
      description: 'The blog post you are looking for does not exist.',
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: post.meta_title || post.title,
    description: postDescription(post),
    path: `/blog/${post.slug}`,
    image: seo.ogImage || post.cover_image_url,
    imageAlt: post.cover_image?.[0]?.alt_text || post.title,
    canonical: seo.canonical,
    noindex: seo.noindex,
    type: 'article',
    publishedTime: post.published_date,
    modifiedTime: post.updated_at || post.published_date,
    section: post.categories?.[0]?.name,
    tags: (post.tags || []).map((t) => t.name).filter(Boolean),
  });
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let post = null;
  let errorMessage = null;
  let relatedStories = [];
  let missing = false;
  const preview = await previewQuery();
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.gokeys.in';

    const url = `${apiUrl}/api/blogs/${slug}/${preview}`;
    const res = await fetch(url, cacheFor(url));
    if (res.status === 404) {
      missing = true; // unknown or draft post
    } else if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      post = await res.json();
    }
    const relatedRes = await fetch(`${apiUrl}/api/blogs/?page_size=7`, CACHED);
    if (relatedRes.ok) {
      let data = await relatedRes.json();
      const storiesArray = Array.isArray(data) ? data : data.results || [];
      relatedStories = storiesArray.filter(p => p.slug !== slug).slice(0, 6).map(slimPost);
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    errorMessage = 'Failed to load blog post.';
  }

  // Real 404 status (not a normal page that says 404), so Google drops the URL
  if (missing) notFound();

  if (!post || errorMessage) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Blog Not Found</h1>
        <p className="text-gray-600">{errorMessage || 'The blog you are looking for does not exist.'}</p>
      </main>
    );
  }

  // Build all three schemas up front so JsonLd can render them together.
  const breadcrumbSchema = buildBreadcrumbSchema(post);
  const faqSchema = buildFAQSchema(post); // null if no faqs — filtered out by JsonLd
  const blogPostingSchema = buildBlogPostingSchema(post);

  return (
    <>
      <JsonLd items={[breadcrumbSchema, blogPostingSchema, faqSchema]} />
      {preview && <PreviewBanner path={`/blog/${slug}`} />}

      <Header />
      <div className="bg-mist">
        {/* Post Header */}
        <header className="gk-wrap pt-8 pb-6 max-w-5xl!">
          {/* Breadcrumbs */}
          <Breadcrumb post={post} />
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.categories && post.categories.length > 0 ? (
              post.categories.map((category, index) => (
                <span key={index} className="gk-chip">{category.name}</span>
              ))
            ) : (
              <span className="text-slate-ink text-sm">No categories</span>
            )}
          </div>
          <h1 className="gk-h1 text-3xl! md:text-[2.75rem]!">{post.title}</h1>
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-ink mt-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Posted on {new Date(post.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              by {post.author || 'Gokeys India'}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readMinutes(post.content)} min read
            </span>
          </div>
        </header>

        {/* Featured Image */}
        {post.cover_image_url && (
          <div className="gk-wrap">
            <div className="gk-media h-56 sm:h-80 md:h-105 rounded-2xl">
              <Image
                src={post.cover_image_url}
                alt={post.cover_image?.[0]?.alt_text || post.title}
                fill
                sizes="(max-width: 1216px) 100vw, 1216px"
                className="object-cover"
                priority={true}
                quality={90}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="gk-wrap py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Post Content */}
          <div className="min-w-0">
            <article className="prose prose-lg max-w-none mb-8 space-y-6 text-gray-800 prose-headings:text-ink prose-a:text-teal" dangerouslySetInnerHTML={{ __html: post.content }} />
            <FAQSection faqs={post.faqs} />
            <CommentSection blogSlug={post.slug} />
          </div>

          {/* Query Form */}
          <aside className="lg:sticky lg:top-20">
            <InquiryFormCard placeName={post.title} />
          </aside>
        </main>
      </div>
      {/* Hand-picked in the admin ("Related content") */}
      <RelatedContent
        title="Plan this trip with Gokeys"
        items={[
          ...(post.related?.tours || []),
          ...(post.related?.group_tours || []),
          ...(post.related?.destinations || []),
          ...(post.related?.sightseeing || []),
        ]}
      />
      <RelatedContent title="Related articles" items={post.related?.posts} />
      <TravelStories posts={relatedStories} />
      <Footer />
    </>
  );
}