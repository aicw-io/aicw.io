import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // Get author data for each post
  const itemsWithAuthors = await Promise.all(
    sortedPosts.map(async (post) => {
      const author = await getEntry(post.data.author);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        author: author.data.name,
        categories: post.data.categories,
        link: `/blog/${post.slug}/`,
      };
    })
  );

  return rss({
    title: 'AI Chat Watch Blog',
    description: 'Insights on AI visibility, competitive intelligence, and how to optimize your brand for AI discovery',
    site: context.site?.toString() || 'https://www.aicw.io',
    items: itemsWithAuthors,
    customData: `<language>en-us</language>`,
  });
}
