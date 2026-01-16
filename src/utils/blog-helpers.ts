import type { CollectionEntry } from 'astro:content';
import { isPublished, publishedFilter } from './content-helpers';

// Re-export the generic helpers for convenience
export { isPublished, publishedFilter };

/**
 * Check if a blog post is published (not draft and published_at has passed)
 */
export function isPostPublished(post: CollectionEntry<'blog'>): boolean {
  return isPublished(post.data);
}

/**
 * Filter an array of posts to only include published ones
 */
export function filterPublishedPosts(
  posts: CollectionEntry<'blog'>[]
): CollectionEntry<'blog'>[] {
  return posts.filter(isPostPublished);
}
