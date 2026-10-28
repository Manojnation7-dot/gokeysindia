import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seoHelpers";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import { getBlogCategories, getBlogPage, pageHref, requestedPage, withPage } from "@/lib/blog";
import BlogListPage from "./BlogListPage";

const TITLE = "Explore Top Travel Stories";
const DESCRIPTION =
  "Discover Amazing Travel Stories with Gokeys to explore various places, activities, destination and experiences.";

export async function generateMetadata({ searchParams }) {
  const page = requestedPage(await searchParams) || 1;
  return buildMetadata({
    title: withPage(TITLE, page),
    description: page > 1 ? `Page ${page}. ${DESCRIPTION}` : DESCRIPTION,
    path: pageHref("/blog", page), // each page is its own canonical
    image: "/images/gokeyslogo.png",
  });
}

export default async function BlogPage({ searchParams }) {
  const page = requestedPage(await searchParams);
  if (!page) notFound();
  const [data, categories] = await Promise.all([getBlogPage(page), getBlogCategories()]);
  if (!data && page > 1) notFound(); // past the last page
  const { posts = [], totalPages = 1 } = data || {};

  return (
    <BlogListPage
      posts={posts}
      currentPage={page}
      totalPages={totalPages}
      heading={withPage("Travel Blog", page)}
      categories={categories}
      schema={buildBreadcrumbList([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }])}
    />
  );
}
