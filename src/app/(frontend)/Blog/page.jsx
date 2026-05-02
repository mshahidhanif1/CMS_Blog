import { getPayload } from "payload";
import configPromise from "@payload-config";
import PostCard from "@/components/PostCard";

export const metadata = {
  title: "All Articles — NexBlog",
  description: "Browse all tech articles, AI updates and tutorials.",
};

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise });

  const { docs: posts, totalDocs } = await payload.find({
    // @ts-ignore
    collection: "posts",
    where: { status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 12,
    depth: 2,
  });

  // Get unique categories
  const allCategories = posts.flatMap((p) => p.categories?.map((c) => c.category) || []);
  const categories = ["All", ...new Set(allCategories)].filter(Boolean);

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Header */}
      <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            The Blog
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-4">
            All Articles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {totalDocs} articles on tech, AI, and tutorials.
          </p>
        </div>

        {/* Category filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 ${
                  i === 0
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}