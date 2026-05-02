import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import TableOfContents from "@/components/TableoFContent";

export async function generateMetadata({ params }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    // @ts-ignore
    collection: "posts",
    where: {
      slug: { equals: slug },  // ← use slug not params.slug
      status: { equals: "published" },
    },
    depth: 2,
  });

  const post = docs[0];
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    robots: { index: !post.noIndex },
    openGraph: {
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || post.seoDescription || post.excerpt,
      images: post.ogImage?.url
        ? [post.ogImage.url]
        : post.featuredImage?.url
          ? [post.featuredImage.url]
          : [],
    },
  };
}
function extractHeadings(content) {
  if (!content?.root?.children) return [];
  return content.root.children
    .filter((node) => node.type === "heading")
    .map((node) => ({
      id: node.children?.map((c) => c.text).join("").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      text: node.children?.map((c) => c.text).join(""),
      level: node.tag || "h2",
    }));
}
function renderContent(content) {
  if (!content?.root?.children) return null;

  const renderNode = (node, i) => {
    if (node.type === "paragraph") {
      const text = node.children?.map((c) => c.text).join("") || "";
      if (!text.trim()) return <div key={i} className="h-4" />;
      return (
        <p key={i} className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
          {node.children?.map((child, j) => renderInline(child, j))}
        </p>
      );
    }
    if (node.type === "heading") {
      const text = node.children?.map((c) => c.text).join("") || "";
      const Tag = node.tag || "h2";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-")  // ← add id
      const styles = {
        h2: "text-3xl font-black text-gray-900 dark:text-white mt-12 mb-5",
        h3: "text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4",
        h4: "text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3",
      };
      return (
        <Tag key={i} id={id} className={styles[Tag] || styles.h2}>  {/* ← add id */}
          {text}
        </Tag>
      );
    }
    if (node.type === "quote") {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-blue-500 pl-6 my-8 italic text-xl text-gray-600 dark:text-gray-400"
        >
          {node.children?.map((c) => c.text).join("")}
        </blockquote>
      );
    }
    if (node.type === "list") {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return (
        <ListTag
          key={i}
          className={`mb-6 pl-6 space-y-2 ${node.listType === "number" ? "list-decimal" : "list-disc"
            }`}
        >
          {node.children?.map((item, j) => (
            <li key={j} className="text-lg text-gray-700 dark:text-gray-300">
              {item.children?.map((c) => c.text).join("")}
            </li>
          ))}
        </ListTag>
      );
    }
    if (node.type === "code") {
      return (
        <pre
          key={i}
          className="bg-gray-900 dark:bg-gray-950 text-green-400 rounded-xl p-6 mb-6 overflow-x-auto text-sm font-mono"
        >
          <code>{node.children?.map((c) => c.text).join("")}</code>
        </pre>
      );
    }
    return null;
  };

  const renderInline = (node, i) => {
    let text = node.text || "";
    if (node.format & 1) text = <strong key={i} className="font-bold text-gray-900 dark:text-white">{text}</strong>;
    if (node.format & 2) text = <em key={i} className="italic">{text}</em>;
    if (node.format & 8) text = <code key={i} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-blue-500 text-sm font-mono">{text}</code>;
    return <span key={i}>{text}</span>;
  };

  return content.root.children.map((node, i) => renderNode(node, i));
}

export default async function BlogPost({ params }) {
  const payload = await getPayload({ config: configPromise });
  const { slug } = await params
  const { docs } = await payload.find({
    // @ts-ignore
    collection: "posts",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    depth: 2,
  });

  const post = docs[0];
  if (!post) notFound();
  const headings = extractHeadings(post.content);
  // console.log("headings",JSON.stringify(headings))

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Hero */}
      <div className="w-full pt-20">
        {post.featuredImage?.url && (
          <div className="w-full max-h-[500px] overflow-hidden">
            <img
              src={post.featuredImage.url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Article */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-16 items-start">
        <article className="max-w-2xl mx-auto px-6 py-16">
          {/* Category */}
          {post.categories?.[0]?.category && (
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              {post.categories[0].category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {(post.author?.email?.[0] || "E").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {post.author?.email?.split("@")[0] || "Editor"}
                </p>
                <p className="text-xs text-gray-400">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : ""}
                  {post.readTime ? ` · ${post.readTime} min read` : ""}
                </p>
              </div>
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-auto">
                {post.tags.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium"
                  >
                    #{t.tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose-content">
            {renderContent(post.content)}
          </div>

          {/* YouTube embed */}
          {post.youtubeUrl && (
            <div className="mt-12 rounded-2xl overflow-hidden aspect-video">
              <iframe
                src={post.youtubeUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          )}

          {/* Bottom divider + back */}
          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-500 transition-colors group"
            >
              <svg
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to articles
            </a>

            {/* Share */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-1">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors text-gray-500"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </article>
        <TableOfContents headings={headings} />
      </div>
    </main>
  );
}