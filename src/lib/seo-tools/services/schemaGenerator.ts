import type { SchemaData, SchemaOutput } from '../types';
import { SCHEMA_CONTEXT } from '../constants';

/**
 * Generate JSON-LD schema markup
 */
export function generateJsonLd(
  schemaType: string,
  data: SchemaData,
  options: { minify?: boolean } = {}
): SchemaOutput {
  const schema: Record<string, unknown> = {
    '@context': SCHEMA_CONTEXT,
    '@type': schemaType,
  };

  // Process data fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const processed = processValue(value);
      if (processed !== undefined && processed !== null) {
        schema[key] = processed;
      }
    }
  });

  const json = options.minify
    ? JSON.stringify(schema)
    : JSON.stringify(schema, null, 2);

  const scriptTag = `<script type="application/ld+json">
${json}
</script>`;

  return {
    json,
    scriptTag,
    schema,
  };
}

/**
 * Process a value for JSON-LD output
 */
function processValue(value: unknown): unknown {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  if (Array.isArray(value)) {
    const processed = value
      .map(processValue)
      .filter((v) => v !== null && v !== undefined);
    return processed.length > 0 ? processed : undefined;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    // Handle nested schema objects
    if (obj['@type']) {
      const processed: Record<string, unknown> = {};
      Object.entries(obj).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          const p = processValue(v);
          if (p !== undefined && p !== null) {
            processed[k] = p;
          }
        }
      });
      return Object.keys(processed).length > 0 ? processed : undefined;
    }

    // Handle regular objects
    const processed: Record<string, unknown> = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        const p = processValue(v);
        if (p !== undefined && p !== null) {
          processed[k] = p;
        }
      }
    });
    return Object.keys(processed).length > 0 ? processed : undefined;
  }

  return value;
}

/**
 * Generate FAQ Page schema
 */
export function generateFaqSchema(
  questions: { question: string; answer: string }[]
): SchemaOutput {
  const data: SchemaData = {
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return generateJsonLd('FAQPage', data);
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): SchemaOutput {
  const data: SchemaData = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return generateJsonLd('BreadcrumbList', data);
}

/**
 * Generate Article schema with common defaults
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo: string };
}): SchemaOutput {
  const data: SchemaData = {
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
  };

  return generateJsonLd('Article', data);
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(org: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
}): SchemaOutput {
  const data: SchemaData = {
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    sameAs: org.sameAs,
    contactPoint: org.contactPoint
      ? {
          '@type': 'ContactPoint',
          telephone: org.contactPoint.telephone,
          contactType: org.contactPoint.contactType,
        }
      : undefined,
  };

  return generateJsonLd('Organization', data);
}

/**
 * Generate Product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  brand?: string;
  sku?: string;
  price?: number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
}): SchemaOutput {
  const data: SchemaData = {
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    sku: product.sku,
    offers: product.price
      ? {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.priceCurrency || 'USD',
          availability: product.availability
            ? `https://schema.org/${product.availability}`
            : undefined,
        }
      : undefined,
    aggregateRating:
      product.ratingValue && product.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return generateJsonLd('Product', data);
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(business: {
  name: string;
  description?: string;
  image?: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}): SchemaOutput {
  const data: SchemaData = {
    name: business.name,
    description: business.description,
    image: business.image,
    telephone: business.telephone,
    address: {
      '@type': 'PostalAddress',
      ...business.address,
    },
    geo: business.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: business.geo.latitude,
          longitude: business.geo.longitude,
        }
      : undefined,
    openingHoursSpecification: business.openingHours,
    priceRange: business.priceRange,
  };

  return generateJsonLd('LocalBusiness', data);
}
