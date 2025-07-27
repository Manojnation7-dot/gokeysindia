"use client";
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InquiryFormCard from '@/components/SimpleEnquiryForm';
import { buildBreadcrumbList } from '@/lib/seoSchemas';
import SmartSEO from '@/components/SmartSEO';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function BlogListPage({ blogPosts, currentPage = 1, totalPages = 1 }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const truncateHtmlToText = (html, maxLength = 150) => {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '');
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '...';
  };

  const breadcrumbSchema = buildBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <SmartSEO schema={breadcrumbSchema} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-700">Travel Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover inspiring travel stories, tips, and destinations from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {Array.isArray(blogPosts) && blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden transform hover:-translate-y-1"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {post.cover_image_url && (
                      <div className="md:w-1/2 aspect-[3/2] float-left mr-6">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          width={400}
                          height={266}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className={`p-6 ${post.cover_image_url ? 'md:ml-1/2' : ''}`}>
                      <div className="mb-2 flex items-center space-x-2">
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(post.published_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {truncateHtmlToText(post.content)}
                      </p>
                      <div className="flex items-center text-green-700 font-medium">
                        Read More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="clear-both"></div>
                  </Link>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="mt-4 text-gray-600">No blog posts available yet. Check back soon!</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded border ${currentPage === pageNum ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
          <div className="md:col-span-1">
            <InquiryFormCard placeName="Post Page" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}