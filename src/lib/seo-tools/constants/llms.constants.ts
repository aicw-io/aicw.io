import type { LlmsSection, LlmsLinkCategory, LlmsTemplate } from '../types';

export const LLMS_FILE_SPEC = {
  FILENAME: 'llms.txt',
  ALT_FILENAME: 'llms-full.txt',
  MIME_TYPE: 'text/plain',
  ENCODING: 'UTF-8',
} as const;

export const LLMS_SECTIONS: LlmsSection[] = [
  { id: 'overview', name: 'Overview', required: true, description: 'Brief description of your site/project', placeholder: 'A brief overview of what this site/project is about...', order: 1 },
  { id: 'quick-links', name: 'Quick Links', required: true, description: 'Most important links for AI to know', placeholder: '- [Link Name](URL): Brief description', order: 2 },
  { id: 'getting-started', name: 'Getting Started', required: false, description: 'How to get started with your product/site', placeholder: 'Steps or information for getting started...', order: 3 },
  { id: 'key-features', name: 'Key Features', required: false, description: 'Main features or capabilities', placeholder: '- Feature 1: Description\n- Feature 2: Description', order: 4 },
  { id: 'documentation', name: 'Documentation', required: false, description: 'Links to documentation', placeholder: '- [Docs](URL): Main documentation\n- [API](URL): API reference', order: 5 },
  { id: 'examples', name: 'Examples', required: false, description: 'Example use cases or code', placeholder: 'Example use cases, code samples, etc.', order: 6 },
  { id: 'support', name: 'Support & Contact', required: false, description: 'Support channels and contact info', placeholder: '- Email: support@example.com\n- Discord: link', order: 7 },
];

export const LLMS_LINK_CATEGORIES: LlmsLinkCategory[] = [
  { id: 'primary', name: 'Primary Links', description: 'Most important pages' },
  { id: 'documentation', name: 'Documentation', description: 'Docs and guides' },
  { id: 'resources', name: 'Resources', description: 'Additional resources' },
  { id: 'social', name: 'Social & Community', description: 'Social links' },
  { id: 'other', name: 'Other', description: 'Miscellaneous links' },
];

export const LLMS_FORMAT_OPTIONS = {
  LINE_WIDTH: 80,
  SECTION_SEPARATOR: '\n\n---\n\n',
  HEADING_STYLE: '#' as const,
  LIST_STYLE: '-' as const,
} as const;

export const LLMS_VALIDATION = {
  MIN_OVERVIEW_LENGTH: 50,
  MAX_OVERVIEW_LENGTH: 1000,
  MIN_LINKS: 1,
  MAX_LINKS: 100,
  URL_PATTERN: /^https?:\/\/.+/,
} as const;

export const LLMS_ERROR_CODES = {
  MISSING_TITLE: 'LLMS_MISSING_TITLE',
  MISSING_OVERVIEW: 'LLMS_MISSING_OVERVIEW',
  MISSING_LINKS: 'LLMS_MISSING_LINKS',
  INVALID_URL: 'LLMS_INVALID_URL',
  OVERVIEW_TOO_SHORT: 'LLMS_OVERVIEW_TOO_SHORT',
  OVERVIEW_TOO_LONG: 'LLMS_OVERVIEW_TOO_LONG',
} as const;

export const LLMS_TEMPLATES: LlmsTemplate[] = [
  {
    id: 'saas',
    name: 'SaaS Product',
    description: 'For software-as-a-service products',
    icon: 'cloud',
    data: {
      title: 'Your SaaS Product Name',
      tagline: 'A brief tagline describing your product',
      overview: `[Your Product] is a [type of solution] that helps [target audience] to [main benefit].

Key capabilities include:
- [Feature 1]: Brief description
- [Feature 2]: Brief description
- [Feature 3]: Brief description

Our platform is designed for [use case] and integrates with [common tools/platforms].`,
      sections: [
        { id: 'getting-started', name: 'Getting Started', content: 'To get started with [Product]:\n\n1. Sign up for an account\n2. Complete the onboarding wizard\n3. Connect your integrations\n4. Start using the main features', order: 3, enabled: true },
        { id: 'key-features', name: 'Key Features', content: '**Core Features**\n- Feature A: Description\n- Feature B: Description\n\n**Integrations**\n- Integrates with popular tools', order: 4, enabled: true },
      ],
      links: [
        { id: '1', name: 'Homepage', url: 'https://example.com', description: 'Main website', category: 'primary', order: 1 },
        { id: '2', name: 'Documentation', url: 'https://docs.example.com', description: 'Full documentation', category: 'documentation', order: 2 },
        { id: '3', name: 'Pricing', url: 'https://example.com/pricing', description: 'Pricing plans', category: 'primary', order: 3 },
      ],
    },
  },
  {
    id: 'blog',
    name: 'Blog / Content Site',
    description: 'For blogs and content websites',
    icon: 'pen-tool',
    data: {
      title: 'Your Blog Name',
      tagline: 'A blog about [topic]',
      overview: `[Blog Name] is a [type of content] publication focused on [topics/themes].

We cover:
- [Topic 1]
- [Topic 2]
- [Topic 3]

Our content is designed for [target audience] who want to [benefit].`,
      sections: [
        { id: 'key-features', name: 'Popular Topics', content: '- Topic 1: Description\n- Topic 2: Description\n- Topic 3: Description', order: 4, enabled: true },
      ],
      links: [
        { id: '1', name: 'Homepage', url: 'https://example.com', description: 'Main blog', category: 'primary', order: 1 },
        { id: '2', name: 'About', url: 'https://example.com/about', description: 'About us', category: 'primary', order: 2 },
        { id: '3', name: 'RSS Feed', url: 'https://example.com/rss.xml', description: 'Subscribe to updates', category: 'resources', order: 3 },
      ],
    },
  },
  {
    id: 'documentation',
    name: 'Documentation Site',
    description: 'For documentation or knowledge bases',
    icon: 'book',
    data: {
      title: 'Product Documentation',
      tagline: 'Official documentation for [Product]',
      overview: `This documentation covers everything you need to know about [Product].

Documentation sections:
- Getting Started: Quick start guides
- API Reference: Complete API documentation
- Tutorials: Step-by-step guides
- FAQ: Common questions and answers`,
      sections: [
        { id: 'getting-started', name: 'Getting Started', content: 'Start with our [Quick Start Guide](URL) to get up and running in minutes.', order: 3, enabled: true },
      ],
      links: [
        { id: '1', name: 'Quick Start', url: 'https://docs.example.com/quickstart', description: 'Get started in 5 minutes', category: 'documentation', order: 1 },
        { id: '2', name: 'API Reference', url: 'https://docs.example.com/api', description: 'Complete API documentation', category: 'documentation', order: 2 },
        { id: '3', name: 'Examples', url: 'https://docs.example.com/examples', description: 'Code examples', category: 'documentation', order: 3 },
      ],
    },
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'For online stores',
    icon: 'shopping-cart',
    data: {
      title: 'Your Store Name',
      tagline: 'Your tagline here',
      overview: `[Store Name] is an online store specializing in [product category].

We offer:
- [Product type 1]
- [Product type 2]
- [Product type 3]

All products come with [guarantee/shipping info].`,
      sections: [],
      links: [
        { id: '1', name: 'Shop', url: 'https://example.com/shop', description: 'Browse all products', category: 'primary', order: 1 },
        { id: '2', name: 'Categories', url: 'https://example.com/categories', description: 'Product categories', category: 'primary', order: 2 },
        { id: '3', name: 'Contact', url: 'https://example.com/contact', description: 'Customer support', category: 'resources', order: 3 },
      ],
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio / Personal',
    description: 'For personal or portfolio sites',
    icon: 'user',
    data: {
      title: 'Your Name',
      tagline: 'Your professional title',
      overview: `I'm a [profession] specializing in [specialty].

I help [target clients] with:
- [Service 1]
- [Service 2]
- [Service 3]

Based in [location], available for [type of work].`,
      sections: [],
      links: [
        { id: '1', name: 'Portfolio', url: 'https://example.com/work', description: 'View my work', category: 'primary', order: 1 },
        { id: '2', name: 'About', url: 'https://example.com/about', description: 'About me', category: 'primary', order: 2 },
        { id: '3', name: 'Contact', url: 'https://example.com/contact', description: 'Get in touch', category: 'primary', order: 3 },
      ],
    },
  },
  {
    id: 'blank',
    name: 'Blank Template',
    description: 'Start from scratch',
    icon: 'file',
    data: {
      title: '',
      tagline: '',
      overview: '',
      sections: [],
      links: [],
    },
  },
];
