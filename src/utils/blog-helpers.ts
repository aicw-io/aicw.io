import type { CollectionEntry } from 'astro:content';

/**
 * Check if a blog post is published (not draft and pubDate has passed)
 */
export function isPostPublished(post: CollectionEntry<'blog'>): boolean {
  // Filter out drafts
  if (post.data.draft) return false;

  // Filter out future posts (scheduled posts)
  const now = new Date();
  return post.data.pubDate <= now;
}

/**
 * Filter an array of posts to only include published ones
 */
export function filterPublishedPosts(
  posts: CollectionEntry<'blog'>[]
): CollectionEntry<'blog'>[] {
  return posts.filter(isPostPublished);
}
