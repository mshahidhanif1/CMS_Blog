import { getPayload } from "payload";
import configPromise from "@payload-config";
import HeroPost from "@/components/HeroPost";
import PostCard from "@/components/PostCard";
import Newsletter from "@/components/Newsletter";

export const metadata = {
  title: "NexBlog — Tech, AI & Tutorials",
  description: "The latest in tech, AI tools, and developer tutorials.",
};

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise });

  const { docs: posts } = await payload.find({
    // @ts-ignore
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 10,
    depth: 2,
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const recentPosts = posts.filter((p) => p.id !== featuredPost?.id).slice(0, 6);

  // Get unique categories
  const allCategories = posts.flatMap((p) => p.categories?.map((c) => c.category) || []);
  const categories = [...new Set(allCategories)].filter(Boolean);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Hero */}
      <HeroPost post={featuredPost} />

      {/* Recent Posts */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-1">Latest</p>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Recent Articles</h2>
          </div>
          <a
            href="/Blog"
            className="text-sm font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 group"
          >
            View all
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <p className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-1">Browse</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Categories</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, i) => (
                <a
                  key={i}
                  href={`/category/${cat?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}