import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL, buildMetadata } from "@/lib/seoHelpers";
import { buildBreadcrumbList } from "@/lib/seoSchemas";
import {
  BLOG_PAGE_SIZE, getBlogCategories, getBlogCategory, getBlogPage, pageHref, requestedPage, withPage,
} from "@/lib/blog";
import BlogListPage from "../../BlogListPage";

// /blog/category/<slug>: every published post of one category, 24 a page (?page=N)
const titleOf = (c) => c.meta_title || `${c.name} Blog`;
const descriptionOf = (c) =>
  c.meta_description || `${c.name} travel guides and tips from Gokeys India, a travel company in Haridwar.`;

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const page = requestedPage(await searchParams) || 1;
  const category = await getBlogCategory(slug);
  if (!category) return { title: "Category Not Found", robots: { index: false, follow: true } };
  return buildMetadata({
    title: withPage(titleOf(category), page),
    description: page > 1 ? `Page ${page}. ${descriptionOf(category)}` : descriptionOf(category),
    path: pageHref(`/blog/category/${category.slug}`, page), // each page is its own canonical
  });
}

function collectionSchema(category, posts, page, path) {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: withPage(titleOf(category), page),
    description: descriptionOf(category),
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: (page - 1) * BLOG_PAGE_SIZE + i + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export default async function BlogCategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const page = requestedPage(await searchParams);
  if (!page) notFound();
  const [category, data, categories] = await Promise.all([
    getBlogCategory(slug), getBlogPage(page, slug), getBlogCategories(),
  ]);
  if (!category || !data || !data.posts.length) notFound(); // unknown category, no posts yet, or past the last page

  const basePath = `/blog/category/${category.slug}`;
  return (
    <BlogListPage
      posts={data.posts}
      currentPage={page}
      totalPages={data.totalPages}
      basePath={basePath}
      heading={withPage(category.name, page)}
      eyebrow="Gokeys travel blog"
      intro={page === 1 ? category.intro : null} // the intro once, on the first page
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: category.name }]}
      categories={categories}
      activeCategory={category.slug}
      schema={[
        collectionSchema(category, data.posts, page, pageHref(basePath, page)),
        buildBreadcrumbList([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: category.name, url: basePath },
        ]),
      ]}
    />
  );
}
