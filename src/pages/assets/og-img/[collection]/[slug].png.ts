import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage, type OgImageOptions } from '../../../../utils/og-image';

interface OgPageProps {
  type: 'blog' | 'guide';
  title: string;
  description?: string;
  author?: string;
  date?: Date;
  collection: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<{ params: { collection: string; slug: string }; props: OgPageProps }> = [];

  // Blog posts
  const blogPosts = await getCollection('blog', ({ data }) => {
    if (data.draft) return false;
    return data.date <= new Date();
  });

  for (const post of blogPosts) {
    paths.push({
      params: { collection: 'blog', slug: post.slug },
      props: {
        type: 'blog',
        title: post.data.title,
        description: post.data.description,
        author: undefined, // Will resolve author name separately if needed
        date: post.data.date,
        collection: 'blog',
      },
    });
  }

  // AI Search Engine guides
  const aiSearchEngineGuides = await getCollection('ai-search-engine', ({ data }) => !data.draft);
  for (const guide of aiSearchEngineGuides) {
    paths.push({
      params: { collection: 'ai-search-engine', slug: guide.slug },
      props: {
        type: 'guide',
        title: guide.data.title,
        description: guide.data.description,
        collection: 'ai-search-engine',
      },
    });
  }

  // AI Crawler Bot guides
  const aiCrawlerBotGuides = await getCollection('ai-crawler-bot', ({ data }) => !data.draft);
  for (const guide of aiCrawlerBotGuides) {
    paths.push({
      params: { collection: 'ai-crawler-bot', slug: guide.slug },
      props: {
        type: 'guide',
        title: guide.data.title,
        description: guide.data.description,
        collection: 'ai-crawler-bot',
      },
    });
  }

  // AI Chat Bot guides
  const aiChatBotGuides = await getCollection('ai-chat-bot', ({ data }) => !data.draft);
  for (const guide of aiChatBotGuides) {
    paths.push({
      params: { collection: 'ai-chat-bot', slug: guide.slug },
      props: {
        type: 'guide',
        title: guide.data.title,
        description: guide.data.description,
        collection: 'ai-chat-bot',
      },
    });
  }

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const ogProps = props as OgPageProps;

  const options: OgImageOptions = {
    type: ogProps.type,
    title: ogProps.title,
    description: ogProps.description,
    author: ogProps.author,
    date: ogProps.date,
    collection: ogProps.collection,
  };

  const png = await generateOgImage(options);

  return new Response(png, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
