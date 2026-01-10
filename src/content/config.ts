import { defineCollection, z, reference } from 'astro:content';

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    avatar: z.string(),
    email: z.string().email().optional(),
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Core metadata
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    date_updated_at: z.coerce.date().optional(),

    // Open Graph metadata (ayodesk-inspired)
    og_title: z.string().optional(),
    og_description: z.string().optional(),

    // Twitter Card metadata (ayodesk-inspired)
    twitter_title: z.string().optional(),
    twitter_description: z.string().optional(),

    // Navigation (ayodesk-inspired)
    breadcrumbs: z.string().optional(),

    // SEO metadata (ayodesk-inspired)
    keywords: z.string().optional(),      // Comma-separated keywords for meta tag and schema
    things: z.string().optional(),        // Entity/topic linking for enhanced schema
    robots: z.string().optional(),        // robots directive override (default: index, follow)

    // Content metadata
    author: reference('authors').optional().default('aicw-team'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    categories: z.array(z.string()).default(['general']),
    tags: z.array(z.string()).default([]),

    // Publication status
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

// Books collection - book metadata and landing page content
const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    coverImage: z.string(),
    pageCount: z.number().optional(),
    downloads: z.array(z.object({
      format: z.enum(['pdf', 'epub']),
      url: z.string(),
      size: z.string().optional(),
    })).optional(),
    purchaseLinks: z.array(z.object({
      store: z.enum(['amazon', 'kindle', 'gumroad', 'other']),
      label: z.string(),
      url: z.string(),
    })).optional(),
    chapters: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

// Book chapters collection
const bookChapters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    chapterNumber: z.number(),
    book: z.string(),
  }),
});

// Guides collection schema (shared for ai-search-engine, ai-crawler-bot, ai-chat-bot)
const guides = defineCollection({
  type: 'content',
  schema: z.object({
    // Core metadata
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    date_updated_at: z.coerce.date().optional(),

    // SEO metadata
    og_title: z.string().optional(),
    og_description: z.string().optional(),
    twitter_title: z.string().optional(),
    twitter_description: z.string().optional(),
    breadcrumbs: z.string().optional(),
    keywords: z.string().optional(),
    things: z.string().optional(),

    // Optional extras
    author: reference('authors').optional().default('aicw-team'),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
  authors,
  books,
  'book-chapters': bookChapters,
  'ai-search-engine': guides,
  'ai-crawler-bot': guides,
  'ai-chat-bot': guides,
};
