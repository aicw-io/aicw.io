import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { publishedFilter } from '../utils/content-helpers';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', publishedFilter);
  const sortedPosts = posts.sort((a, b) => b.data.published_at.valueOf() - a.data.published_at.valueOf());

  // Get author data for each post
  const itemsWithAuthors = await Promise.all(
    sortedPosts.map(async (post) => {
      const author = await getEntry(post.data.author);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.published_at,
        author: author.data.name,
        categories: post.data.categories,
        link: `/blog/${post.slug}/`,
      };
    })
  );

  return rss({
    title: 'AICW Blog',
    description: 'Insights on AI visibility, competitive intelligence, and how to optimize your brand for AI discovery',
    site: context.site?.toString() || 'https://www.aicw.io',
    items: itemsWithAuthors,
    customData: `<language>en-us</language>`,
  });
}
