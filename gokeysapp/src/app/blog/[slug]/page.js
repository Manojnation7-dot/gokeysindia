import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import TravelStories from '@/components/TravelStories';
import InquiryFormCard from '@/components/SimpleEnquiryForm';
import FAQSection from '@/components/FaqsDetails';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in';

// ---------------------------------------------------------------------------
// Schema builders — pure functions, no `other`/metadata involvement.
// If you already have buildBreadcrumbList / buildFAQSchema in a shared lib
// (as shown in your snippet), import those instead and delete the local
// copies below — just keep the calling pattern in BlogDetailPage the same.
// ---------------------------------------------------------------------------

function buildBreadcrumbSchema(post) {
  const primaryCategory = post.categories?.[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      ...(primaryCategory?.name
        ? [{
            '@type': 'ListItem',
            position: 3,
            name: primaryCategory.name,
            item: `${SITE_URL}/blog/category/${primaryCategory.name.toLowerCase().replace(/\s+/g, '-')}`,
          }]
        : []),
      {
        '@type': 'ListItem',
        position: primaryCategory ? 4 : 3,
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
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_date,
    dateModified: post.updated_date || post.published_date,
    author: {
      '@type': 'Organization',
      name: post.author || 'Gokeys India',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

// Breadcrumb Component
function Breadcrumb({ post }) {
  const primaryCategory = post.categories && post.categories.length > 0 ? post.categories[0] : null;

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    ...(primaryCategory && primaryCategory.name
      ? [{ label: primaryCategory.name, href: `/blog/category/${primaryCategory.name.toLowerCase().replace(/\s+/g, '-')}` }]
      : []),
    { label: post.title, href: null },
  ];

  return (
    <nav className="text-sm text-gray-600 mb-3">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:text-green-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
          {index < items.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
}

export async function generateStaticParams() {
  let blogPosts = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/blogs/`);
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
// canonical, OpenGraph. No JSON-LD here anymore. Structured data is built
// and rendered inside BlogDetailPage as real <script type="application/ld+json">
// tags, which is the only format Google's structured data parser reads.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/blogs/${slug}/`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    post = await res.json();
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
  }

  if (!post) {
    return {
      title: 'Blog Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      images: post.cover_image_url ? [{ url: post.cover_image_url, width: 800, height: 400, alt: post.title }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let post = null;
  let errorMessage = null;
  let relatedStories = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.gokeys.in';

    const res = await fetch(`${apiUrl}/api/blogs/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    post = await res.json();
    const relatedRes = await fetch(`${apiUrl}/api/blogs/?is_active=true&limit=7`);
    if (relatedRes.ok) {
      let data = await relatedRes.json();
      const storiesArray = Array.isArray(data) ? data : data.results || [];
      relatedStories = storiesArray.filter(p => p.slug !== slug).slice(0, 6);
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    errorMessage = 'Failed to load blog post.';
  }

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

      <Header />
      {/* Post Header */}
      <header className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
          {/* Breadcrumbs */}
          <Breadcrumb post={post} />
          {/* Metadata */}
          <div className="flex items-center text-gray-600 mt-3">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Posted on {new Date(post.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <svg className="w-5 h-5 ml-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>by {post.author || 'Gokeys India'}</span>
          </div>
          {/* Categories */}
          <div className="mt-3">
            {post.categories && post.categories.length > 0 ? (
              post.categories.map((category, index) => (
                <span key={index} className="inline-block bg-green-600 text-white text-sm font-medium px-2 py-1 rounded mr-2 hover:bg-green-700">
                  {category.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No categories</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Post Content - 2/3 */}
        <div className="md:col-span-2">
          {/* Featured Image */}
          {post.cover_image_url && (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              width={800}
              height={400}
              className="w-full max-h-80 rounded-lg mb-6 object-cover aspect-[2/1]"
              priority={true}
              quality={90}
            />
          )}
          {/* Post Content */}
          <article className="prose prose-lg prose-green max-w-none mb-8 space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
          <FAQSection faqs={post.faqs} />
          <CommentSection blogSlug={post.slug} />
        </div>

        {/* Query Form (Design Only) - 1/3 */}
        <div className="md:col-span-1">
          <InquiryFormCard placeName={post.title} />
        </div>
      </main>
      <TravelStories posts={relatedStories} />
      <Footer />
    </>
  );
}