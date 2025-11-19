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
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // Open Graph metadata (ayodesk-inspired)
    og_title: z.string().optional(),
    og_description: z.string().optional(),

    // Twitter Card metadata (ayodesk-inspired)
    twitter_title: z.string().optional(),
    twitter_description: z.string().optional(),

    // Navigation (ayodesk-inspired)
    breadcrumbs: z.string().optional(),

    // Content metadata
    author: reference('authors'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    categories: z.array(z.string()).default(['general']),
    tags: z.array(z.string()).default([]),

    // Publication status
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, authors };
