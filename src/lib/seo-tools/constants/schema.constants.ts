import type { SchemaTypeInfo } from '../types';

export const SCHEMA_CONTEXT = 'https://schema.org';

export const SCHEMA_TYPES: SchemaTypeInfo[] = [
  { id: 'Article', name: 'Article', description: 'An article, news story, or blog post', category: 'content', icon: 'article', popularity: 95 },
  { id: 'Product', name: 'Product', description: 'A product being sold', category: 'commerce', icon: 'shopping-bag', popularity: 98 },
  { id: 'Organization', name: 'Organization', description: 'A company, business, or organization', category: 'business', icon: 'building', popularity: 90 },
  { id: 'Person', name: 'Person', description: 'A person (individual)', category: 'business', icon: 'user', popularity: 75 },
  { id: 'LocalBusiness', name: 'Local Business', description: 'A local business or store', category: 'business', icon: 'store', popularity: 92 },
  { id: 'Event', name: 'Event', description: 'An event happening at a certain time/place', category: 'events', icon: 'calendar', popularity: 80 },
  { id: 'FAQPage', name: 'FAQ Page', description: 'A page containing frequently asked questions', category: 'content', icon: 'help-circle', popularity: 88 },
  { id: 'HowTo', name: 'How-To', description: 'Instructions for completing a task', category: 'content', icon: 'list-checks', popularity: 70 },
  { id: 'Recipe', name: 'Recipe', description: 'A cooking recipe', category: 'content', icon: 'chef-hat', popularity: 85 },
  { id: 'Review', name: 'Review', description: 'A review of an item', category: 'commerce', icon: 'star', popularity: 78 },
  { id: 'BreadcrumbList', name: 'Breadcrumb', description: 'A breadcrumb navigation trail', category: 'navigation', icon: 'chevrons-right', popularity: 82 },
  { id: 'VideoObject', name: 'Video', description: 'A video file or embed', category: 'media', icon: 'video', popularity: 75 },
  { id: 'JobPosting', name: 'Job Posting', description: 'A job listing', category: 'business', icon: 'briefcase', popularity: 72 },
];

export const SCHEMA_CATEGORIES = [
  { id: 'content', name: 'Content', icon: 'file-text' },
  { id: 'commerce', name: 'Commerce', icon: 'shopping-cart' },
  { id: 'business', name: 'Business', icon: 'building-2' },
  { id: 'events', name: 'Events', icon: 'calendar-days' },
  { id: 'media', name: 'Media', icon: 'image' },
  { id: 'navigation', name: 'Navigation', icon: 'navigation' },
] as const;

export const SCHEMA_VALIDATION = {
  URL_PATTERN: /^https?:\/\/.+/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DATE_PATTERN: /^\d{4}-\d{2}-\d{2}$/,
  DATETIME_PATTERN: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/,
  RATING_MIN: 1,
  RATING_MAX: 5,
  PRICE_MIN: 0,
} as const;

export const SCHEMA_ERROR_CODES = {
  MISSING_REQUIRED: 'SCHEMA_MISSING_REQUIRED',
  INVALID_URL: 'SCHEMA_INVALID_URL',
  INVALID_EMAIL: 'SCHEMA_INVALID_EMAIL',
  INVALID_DATE: 'SCHEMA_INVALID_DATE',
  INVALID_RATING: 'SCHEMA_INVALID_RATING',
  INVALID_PRICE: 'SCHEMA_INVALID_PRICE',
  MISSING_CONTEXT: 'SCHEMA_MISSING_CONTEXT',
  MISSING_TYPE: 'SCHEMA_MISSING_TYPE',
} as const;
