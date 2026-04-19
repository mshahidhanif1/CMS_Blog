import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "author"],
    description: "Create and manage your blog posts here",
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── CONTENT TAB ───────────────────────────────────────
    {
      type: "tabs",
      tabs: [
        {
          label: "📝 Content",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Post Title",
              admin: {
                description: "The main title of your blog post",
              },
            },
            {
              name: "slug",
              type: "text",
              required: false,
              unique: true,
              label: "URL Slug",
              admin: {
                description:
                  "The URL of your post e.g: my-blog-post (auto-filled from title, you can change it)",
              },
              hooks: {
                beforeChange: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    }
                    // Also clean any manually entered slug
                    if (value) {
                      return value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                    }
                    return value;
                  },
                ],
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              label: "Short Excerpt",
              admin: {
                description:
                  "A short summary of your post (2-3 sentences). Shown on blog listing page",
              },
            },
            {
              name: "featuredImage",
              type: "upload",
              relationTo: "media",
              required: false,
              label: "Featured Image",
              admin: {
                description:
                  "The main image shown at the top of your post and in social shares",
              },
            },
            {
              name: "content",
              type: "richText",
              label: "Post Content",
              editor: lexicalEditor({}),
            //   required: true,
              admin: {
                description: "Write your full blog post content here",
              },
            },
            {
              name: "youtubeUrl",
              type: "text",
              label: "YouTube Video URL (Optional)",
              admin: {
                description:
                  "Paste a YouTube video link to embed it in your post e.g: https://youtube.com/watch?v=xxxxx",
              },
            },
          ],
        },

        // ─── SEO TAB ───────────────────────────────────────
        {
          label: "🔍 SEO",
          fields: [
            {
              name: "seoTitle",
              type: "text",
              label: "SEO Title",
              admin: {
                description:
                  "Title shown in Google search results. Keep it under 60 characters. Leave empty to use post title",
              },
            },
            {
              name: "seoDescription",
              type: "textarea",
              label: "SEO Meta Description",
              admin: {
                description:
                  "Description shown in Google search results. Keep it between 150-160 characters. Very important for SEO!",
              },
            },
            {
              name: "focusKeyword",
              type: "text",
              label: "Focus Keyword",
              admin: {
                description:
                  "The main keyword you want this post to rank for e.g: best running shoes 2025",
              },
            },
            {
              name: "canonicalUrl",
              type: "text",
              label: "Canonical URL (Advanced)",
              admin: {
                description:
                  "Only fill this if this post was originally published somewhere else. Prevents duplicate content issues",
              },
            },
            {
              name: "noIndex",
              type: "checkbox",
              label: "Hide from Google (noindex)",
              defaultValue: false,
              admin: {
                description:
                  "Check this if you do NOT want Google to index this post (e.g. draft or test posts)",
              },
            },
            // ─── Open Graph (Social Sharing) ───
            {
              type: "collapsible",
              label: "📱 Social Sharing (Open Graph)",
              admin: {
                description:
                  "Controls how your post looks when shared on Facebook, Twitter etc.",
              },
              fields: [
                {
                  name: "ogTitle",
                  type: "text",
                  label: "Social Share Title",
                  admin: {
                    description:
                      "Title shown when shared on social media. Leave empty to use SEO title",
                  },
                },
                {
                  name: "ogDescription",
                  type: "textarea",
                  label: "Social Share Description",
                  admin: {
                    description:
                      "Description shown when shared on social media. Leave empty to use SEO description",
                  },
                },
                {
                  name: "ogImage",
                  type: "upload",
                  relationTo: "media",
                  label: "Social Share Image",
                  admin: {
                    description:
                      "Image shown when shared on Facebook/Twitter. Recommended size: 1200x630px. Leave empty to use featured image",
                  },
                },
              ],
            },
          ],
        },

        // ─── SETTINGS TAB ───────────────────────────────────────
        {
          label: "⚙️ Settings",
          fields: [
            {
              name: "status",
              type: "select",
              label: "Post Status",
              required: true,
              defaultValue: "draft",
              options: [
                { label: "📝 Draft (not visible)", value: "draft" },
                { label: "✅ Published (live)", value: "published" },
                { label: "🗓 Scheduled", value: "scheduled" },
              ],
              admin: {
                description:
                  "Draft = only you can see it. Published = live on your blog",
              },
            },
            {
              name: "publishedAt",
              type: "date",
              label: "Publish Date",
              admin: {
                description: "When was/will this post be published",
                date: {
                  pickerAppearance: "dayAndTime",
                },
                condition: (data) =>
                  data.status === "published" || data.status === "scheduled",
              },
            },
            {
              name: "author",
              type: "relationship",
              relationTo: "users",
              label: "Author",
              admin: {
                description: "Who wrote this post",
              },
            },
            {
              name: "categories",
              type: "array",
              label: "Categories",
              admin: {
                description:
                  "Add categories for this post e.g: Technology, Health, Finance",
              },
              fields: [
                {
                  name: "category",
                  type: "text",
                  label: "Category Name",
                },
              ],
            },
            {
              name: "tags",
              type: "array",
              label: "Tags",
              admin: {
                description:
                  "Add tags to help organize your posts e.g: ai, python, tutorial",
              },
              fields: [
                {
                  name: "tag",
                  type: "text",
                  label: "Tag",
                },
              ],
            },
            {
              name: "readTime",
              type: "number",
              label: "Read Time (minutes)",
              admin: {
                description:
                  "Estimated read time in minutes (auto-calculated, you can override)",
              },
            },
            {
              name: "featured",
              type: "checkbox",
              label: "⭐ Featured Post",
              defaultValue: false,
              admin: {
                description:
                  "Check this to show this post in the featured section on homepage",
              },
            },
            {
              name: "allowComments",
              type: "checkbox",
              label: "Allow Comments",
              defaultValue: true,
              admin: {
                description: "Allow readers to leave comments on this post",
              },
            },
          ],
        },
      ],
    },
  ],
};
