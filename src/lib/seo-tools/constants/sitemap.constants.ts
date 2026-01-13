export const SITEMAP_LIMITS = {
  MAX_URLS_PER_SITEMAP: 50000,
  MAX_FILE_SIZE_MB: 50,
  MAX_URL_LENGTH: 2048,
} as const;

export const SITEMAP_CHANGE_FREQUENCIES = [
  { value: 'always', label: 'Always', description: 'Updates constantly' },
  { value: 'hourly', label: 'Hourly', description: 'Updates every hour' },
  { value: 'daily', label: 'Daily', description: 'Updates once a day' },
  { value: 'weekly', label: 'Weekly', description: 'Updates once a week' },
  { value: 'monthly', label: 'Monthly', description: 'Updates once a month' },
  { value: 'yearly', label: 'Yearly', description: 'Updates once a year' },
  { value: 'never', label: 'Never', description: 'Archived content' },
] as const;

export const SITEMAP_PRIORITY_OPTIONS = [
  { value: '1.0', label: 'Highest (1.0)', description: 'Most important pages' },
  { value: '0.9', label: 'Very High (0.9)', description: '' },
  { value: '0.8', label: 'High (0.8)', description: 'Important pages' },
  { value: '0.7', label: 'Above Normal (0.7)', description: '' },
  { value: '0.6', label: 'Normal (0.6)', description: '' },
  { value: '0.5', label: 'Default (0.5)', description: 'Default priority' },
  { value: '0.4', label: 'Below Normal (0.4)', description: '' },
  { value: '0.3', label: 'Low (0.3)', description: 'Less important pages' },
  { value: '0.2', label: 'Very Low (0.2)', description: '' },
  { value: '0.1', label: 'Lowest (0.1)', description: 'Least important' },
] as const;

export const SITEMAP_DEFAULTS = {
  PRIORITY: '0.5' as const,
  CHANGE_FREQUENCY: 'weekly' as const,
  INCLUDE_LASTMOD: true,
  INCLUDE_PRIORITY: true,
  INCLUDE_CHANGEFREQ: true,
  XML_DECLARATION: true,
  PRETTY_PRINT: true,
} as const;

export const SITEMAP_NAMESPACES = {
  SITEMAP: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  IMAGE: 'http://www.google.com/schemas/sitemap-image/1.1',
  VIDEO: 'http://www.google.com/schemas/sitemap-video/1.1',
  NEWS: 'http://www.google.com/schemas/sitemap-news/0.9',
  XHTML: 'http://www.w3.org/1999/xhtml',
} as const;

export const SITEMAP_ERROR_CODES = {
  INVALID_URL: 'SITEMAP_INVALID_URL',
  URL_TOO_LONG: 'SITEMAP_URL_TOO_LONG',
  DUPLICATE_URL: 'SITEMAP_DUPLICATE_URL',
  INVALID_PRIORITY: 'SITEMAP_INVALID_PRIORITY',
  INVALID_CHANGEFREQ: 'SITEMAP_INVALID_CHANGEFREQ',
  INVALID_LASTMOD: 'SITEMAP_INVALID_LASTMOD',
  TOO_MANY_URLS: 'SITEMAP_TOO_MANY_URLS',
} as const;

export const SITEMAP_PAGE_TYPE_PRESETS = [
  { id: 'homepage', name: 'Homepage', priority: '1.0' as const, changefreq: 'daily' as const },
  { id: 'category', name: 'Category Pages', priority: '0.8' as const, changefreq: 'weekly' as const },
  { id: 'product', name: 'Product Pages', priority: '0.8' as const, changefreq: 'weekly' as const },
  { id: 'blog-post', name: 'Blog Posts', priority: '0.6' as const, changefreq: 'monthly' as const },
  { id: 'static', name: 'Static Pages', priority: '0.5' as const, changefreq: 'yearly' as const },
  { id: 'archive', name: 'Archive Pages', priority: '0.3' as const, changefreq: 'never' as const },
] as const;
