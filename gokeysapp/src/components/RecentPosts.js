import Link from 'next/link';
import Image from 'next/image';

export default async function RecentPosts() {
  let posts = [];
  let errorMessage = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('Fetching recent posts from:', `${apiUrl}/api/blogs/?limit=3`); // Debug log
    const res = await fetch(`${apiUrl}/api/blogs/?limit=3`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    posts = await res.json();
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    errorMessage = 'Failed to load recent posts.';
  }

  return (
    <section className="my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        Recent Posts
      </h3>
      {errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col h-full">
                {/* Image Wrapper */}
                {post.cover_image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      quality={85}
                    />
                    {/* Static Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
                    {/* Date Badge */}
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
                      {new Date(post.published_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                )}
                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No recent posts available.</p>
      )}
    </section>
  );
}