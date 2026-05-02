"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function HeroPost({ post }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (!post) return null;

  return (
    <section ref={ref} className="relative h-[100vh] min-h-[600px] overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        {post.featuredImage?.url ? (
          <img
            src={post.featuredImage.url}
            alt={post.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative h-full flex flex-col justify-end pb-16 px-6 max-w-7xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Category badge */}
          {post.categories?.[0]?.category && (
            <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              {post.categories[0].category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-300 text-lg max-w-2xl mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta + CTA */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <span>{post.author?.email?.split("@")[0] || "Editor"}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
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
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
            >
              Read Article
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 9l-7 7-7-7" strokeWidth={2} />
        </svg>
      </motion.div>
    </section>
  );
}