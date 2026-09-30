import { buildMetadata } from "@/lib/seoHelpers";
import { fetchData } from "@/lib/api";
import BlogListPage from "./BlogListPage";
import { slimPost } from "@/lib/slim";


export async function generateMetadata({ searchParams }) {
  const params = await searchParams; // Await searchParams
  const requestedPage = Number(params?.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;
  return buildMetadata({
    title: "Explore Top Travel Stories",
    description:
      "Discover Amazing Travel Stories with Gokeys to explore various places, activities, destination and experiences.",
    path: page === 1 ? "/blog" : `/blog?page=${page}`,
    image: "/images/gokeyslogo.png",
  });
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams; // Await searchParams
  // Safe way to get page number
  const currentPage = Number(params?.page) || 1;
  const pageSize = 6;

  try {
    const response = await fetchData(`blogs/?is_active=true&page=${currentPage}&page_size=${pageSize}`) || {};
    
    const blogPosts = response.results || [];
    const totalPosts = response.count || 0;
    const totalPages = Math.ceil(totalPosts / pageSize);

    return <BlogListPage blogPosts={blogPosts.map(slimPost)} currentPage={currentPage} totalPages={totalPages} />;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return <BlogListPage blogPosts={[]} currentPage={1} totalPages={1} />;
  }
}
