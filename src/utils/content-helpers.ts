/**
 * Content helpers for filtering published content across all collections.
 *
 * All content types use `published_at` for scheduling future content.
 * Content is considered published if:
 * 1. It's not marked as draft
 * 2. Its published_at date has passed (is in the past or present)
 */

/**
 * Minimum shape required for publishable content
 */
type PublishableData = {
  published_at: Date;
  draft?: boolean;
};

/**
 * Check if a piece of content is published (not draft and published_at has passed)
 *
 * @param data - The content data object with published_at and optional draft fields
 * @returns true if the content should be publicly visible
 */
export function isPublished<T extends PublishableData>(data: T): boolean {
  // Filter out drafts
  if (data.draft) return false;

  // Filter out future content (scheduled content)
  const now = new Date();
  return data.published_at <= now;
}

/**
 * Filter function for use with getCollection()
 * Filters out drafts and future-dated content
 *
 * @example
 * const posts = await getCollection('blog', publishedFilter);
 * const guides = await getCollection('ai-search-engine', publishedFilter);
 */
export function publishedFilter({ data }: { data: PublishableData }): boolean {
  return isPublished(data);
}
