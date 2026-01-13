import type { RobotsUserAgent, RobotsTemplate } from '../types';

export const ROBOTS_USER_AGENTS: RobotsUserAgent[] = [
  // Search Engines
  { id: 'googlebot', name: 'Googlebot', pattern: 'Googlebot', icon: 'google', category: 'search' },
  { id: 'googlebot-image', name: 'Googlebot Images', pattern: 'Googlebot-Image', icon: 'google', category: 'search' },
  { id: 'googlebot-news', name: 'Googlebot News', pattern: 'Googlebot-News', icon: 'google', category: 'search' },
  { id: 'bingbot', name: 'Bingbot', pattern: 'Bingbot', icon: 'bing', category: 'search' },
  { id: 'yandexbot', name: 'Yandex Bot', pattern: 'YandexBot', icon: 'yandex', category: 'search' },
  { id: 'baidubot', name: 'Baidu Spider', pattern: 'Baiduspider', icon: 'baidu', category: 'search' },
  { id: 'duckduckbot', name: 'DuckDuckBot', pattern: 'DuckDuckBot', icon: 'duckduckgo', category: 'search' },
  { id: 'slurp', name: 'Yahoo Slurp', pattern: 'Slurp', icon: 'yahoo', category: 'search' },

  // AI Crawlers
  { id: 'gptbot', name: 'GPTBot (OpenAI)', pattern: 'GPTBot', icon: 'openai', category: 'ai' },
  { id: 'chatgpt-user', name: 'ChatGPT-User', pattern: 'ChatGPT-User', icon: 'openai', category: 'ai' },
  { id: 'claude-web', name: 'Claude-Web (Anthropic)', pattern: 'Claude-Web', icon: 'anthropic', category: 'ai' },
  { id: 'anthropic-ai', name: 'anthropic-ai', pattern: 'anthropic-ai', icon: 'anthropic', category: 'ai' },
  { id: 'ccbot', name: 'CCBot (Common Crawl)', pattern: 'CCBot', icon: 'commoncrawl', category: 'ai' },
  { id: 'google-extended', name: 'Google-Extended', pattern: 'Google-Extended', icon: 'google', category: 'ai' },
  { id: 'cohere-ai', name: 'cohere-ai', pattern: 'cohere-ai', icon: 'cohere', category: 'ai' },
  { id: 'perplexitybot', name: 'PerplexityBot', pattern: 'PerplexityBot', icon: 'perplexity', category: 'ai' },
  { id: 'bytespider', name: 'Bytespider (TikTok)', pattern: 'Bytespider', icon: 'tiktok', category: 'ai' },
  { id: 'amazonbot', name: 'Amazonbot', pattern: 'Amazonbot', icon: 'amazon', category: 'ai' },
  { id: 'meta-externalagent', name: 'Meta External Agent', pattern: 'meta-externalagent', icon: 'meta', category: 'ai' },
  { id: 'applebot-extended', name: 'Applebot-Extended', pattern: 'Applebot-Extended', icon: 'apple', category: 'ai' },

  // Social Media
  { id: 'facebookbot', name: 'Facebook Bot', pattern: 'facebookexternalhit', icon: 'facebook', category: 'social' },
  { id: 'twitterbot', name: 'Twitter Bot', pattern: 'Twitterbot', icon: 'twitter', category: 'social' },
  { id: 'linkedinbot', name: 'LinkedIn Bot', pattern: 'LinkedInBot', icon: 'linkedin', category: 'social' },

  // Other
  { id: 'all', name: 'All Bots (*)', pattern: '*', icon: 'robot', category: 'other' },
];

export const ROBOTS_USER_AGENT_CATEGORIES = [
  { id: 'search', name: 'Search Engines' },
  { id: 'ai', name: 'AI Crawlers' },
  { id: 'social', name: 'Social Media' },
  { id: 'other', name: 'Other' },
] as const;

export const ROBOTS_TEMPLATES: RobotsTemplate[] = [
  {
    id: 'allow-all',
    name: 'Allow All',
    description: 'Allow all crawlers to access everything',
    content: `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml`,
  },
  {
    id: 'block-all',
    name: 'Block All',
    description: 'Block all crawlers from accessing anything',
    content: `# Block all crawlers
User-agent: *
Disallow: /`,
  },
  {
    id: 'block-ai',
    name: 'Block AI Crawlers',
    description: 'Allow search engines but block AI training crawlers',
    content: `# Allow search engines
User-agent: Googlebot
User-agent: Bingbot
User-agent: DuckDuckBot
Allow: /

# Block AI crawlers
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: Claude-Web
User-agent: anthropic-ai
User-agent: CCBot
User-agent: Google-Extended
User-agent: cohere-ai
User-agent: PerplexityBot
User-agent: Bytespider
User-agent: Amazonbot
User-agent: meta-externalagent
User-agent: Applebot-Extended
Disallow: /

# Default: allow others
User-agent: *
Allow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml`,
  },
  {
    id: 'standard',
    name: 'Standard Setup',
    description: 'Common configuration with admin/private areas blocked',
    content: `# Standard robots.txt
User-agent: *
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Disallow: /tmp/
Disallow: /*.json$
Disallow: /*.xml$

# Sitemap
Sitemap: https://example.com/sitemap.xml`,
  },
];

export const ROBOTS_VALIDATION = {
  MAX_FILE_SIZE_BYTES: 500 * 1024, // 500KB limit (Google's limit)
  MAX_LINE_LENGTH: 500,
} as const;

export const ROBOTS_ERROR_CODES = {
  SYNTAX_ERROR: 'ROBOTS_SYNTAX_ERROR',
  INVALID_DIRECTIVE: 'ROBOTS_INVALID_DIRECTIVE',
  MISSING_USER_AGENT: 'ROBOTS_MISSING_USER_AGENT',
  INVALID_PATH: 'ROBOTS_INVALID_PATH',
  FILE_TOO_LARGE: 'ROBOTS_FILE_TOO_LARGE',
  DUPLICATE_RULE: 'ROBOTS_DUPLICATE_RULE',
  CONFLICTING_RULES: 'ROBOTS_CONFLICTING_RULES',
  INVALID_CRAWL_DELAY: 'ROBOTS_INVALID_CRAWL_DELAY',
  INVALID_SITEMAP_URL: 'ROBOTS_INVALID_SITEMAP_URL',
} as const;

export const ROBOTS_WARNING_CODES = {
  CRAWL_DELAY_IGNORED: 'ROBOTS_CRAWL_DELAY_IGNORED',
  BROAD_DISALLOW: 'ROBOTS_BROAD_DISALLOW',
  NO_SITEMAP: 'ROBOTS_NO_SITEMAP',
  DEPRECATED_DIRECTIVE: 'ROBOTS_DEPRECATED_DIRECTIVE',
} as const;
