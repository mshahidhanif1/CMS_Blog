"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PostCard({ post, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10] bg-gray-100 dark:bg-gray-800">
          {post.featuredImage?.url ? (
            <img
              src={post.featuredImage.url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-gray-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5} />
              </svg>
            </div>
          )}

          {/* Category badge */}
          {post.categories?.[0]?.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              {post.categories[0].category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{post.author?.email?.split("@")[0] || "Editor"}</span>
            <span>·</span>
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
            {post.readTime && (
              <>
                <span>·</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Read more */}
          <div className="flex items-center gap-1.5 text-blue-500 text-sm font-semibold pt-1 group-hover:gap-3 transition-all">
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}