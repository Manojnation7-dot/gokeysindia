import TravelStories from "./TravelStories";
import { CACHED } from "@/lib/api";
import { slimPost } from "@/lib/slim";

export default async function TravelStoriesWrapper({ limit = 8 }) {
  let posts = [];
  let error = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/blogs/?page_size=${limit}`, CACHED);

    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const data = await res.json();
    posts = (data.results || data).map(slimPost);
  } catch (err) {
    console.error("TravelStoriesWrapper error:", err);
    error = err.message;
  }

  return <TravelStories posts={posts} error={error} />;
}