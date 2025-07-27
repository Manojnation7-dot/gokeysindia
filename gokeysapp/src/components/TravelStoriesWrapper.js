import TravelStories from "./TravelStories";

export default async function TravelStoriesWrapper({ limit = 8 }) {
  let posts = [];
  let error = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/blogs/?limit=${limit}`, {
      next: { revalidate: 60 }, // or force-cache for full static
    });

    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const data = await res.json();
    posts = data.results || data;
  } catch (err) {
    console.error("TravelStoriesWrapper error:", err);
    error = err.message;
  }

  return <TravelStories posts={posts} error={error} />;
}