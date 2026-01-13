import type {
  SitemapUrl,
  SitemapGeneratorOptions,
  SitemapExportResult,
  ChangeFrequency,
  Priority,
} from '../types';
import {
  SITEMAP_NAMESPACES,
  SITEMAP_LIMITS,
  SITEMAP_DEFAULTS,
  SITEMAP_ERROR_CODES,
} from '../constants';

/**
 * Generate sitemap XML from URL list
 */
export function generateSitemapXml(
  urls: SitemapUrl[],
  options: Partial<SitemapGeneratorOptions> = {}
): SitemapExportResult {
  const opts: SitemapGeneratorOptions = {
    includeLastmod: options.includeLastmod ?? SITEMAP_DEFAULTS.INCLUDE_LASTMOD,
    includePriority: options.includePriority ?? SITEMAP_DEFAULTS.INCLUDE_PRIORITY,
    includeChangefreq: options.includeChangefreq ?? SITEMAP_DEFAULTS.INCLUDE_CHANGEFREQ,
    xmlDeclaration: options.xmlDeclaration ?? SITEMAP_DEFAULTS.XML_DECLARATION,
    prettyPrint: options.prettyPrint ?? SITEMAP_DEFAULTS.PRETTY_PRINT,
    defaultPriority: options.defaultPriority ?? SITEMAP_DEFAULTS.PRIORITY,
    defaultChangefreq: options.defaultChangefreq ?? SITEMAP_DEFAULTS.CHANGE_FREQUENCY,
  };

  const warnings: string[] = [];
  const validUrls = urls.filter((u) => u.isValid);

  // Check limits
  if (validUrls.length > SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP) {
    warnings.push(
      `URL count (${validUrls.length}) exceeds recommended limit (${SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP}). Consider using a sitemap index.`
    );
  }

  const indent = opts.prettyPrint ? '  ' : '';
  const newline = opts.prettyPrint ? '\n' : '';

  let xml = '';

  // XML declaration
  if (opts.xmlDeclaration) {
    xml += `<?xml version="1.0" encoding="UTF-8"?>${newline}`;
  }

  // Root element with namespaces
  xml += `<urlset xmlns="${SITEMAP_NAMESPACES.SITEMAP}"`;

  // Add additional namespaces if needed
  const hasImages = validUrls.some((u) => u.images && u.images.length > 0);
  const hasAlternates = validUrls.some((u) => u.alternates && u.alternates.length > 0);

  if (hasImages) {
    xml += `${newline}${indent}xmlns:image="${SITEMAP_NAMESPACES.IMAGE}"`;
  }
  if (hasAlternates) {
    xml += `${newline}${indent}xmlns:xhtml="${SITEMAP_NAMESPACES.XHTML}"`;
  }

  xml += `>${newline}`;

  // Generate URL entries
  validUrls.forEach((url) => {
    xml += `${indent}<url>${newline}`;
    xml += `${indent}${indent}<loc>${escapeXml(url.loc)}</loc>${newline}`;

    if (opts.includeLastmod && url.lastmod) {
      xml += `${indent}${indent}<lastmod>${url.lastmod}</lastmod>${newline}`;
    }

    if (opts.includeChangefreq) {
      const changefreq = url.changefreq || opts.defaultChangefreq;
      xml += `${indent}${indent}<changefreq>${changefreq}</changefreq>${newline}`;
    }

    if (opts.includePriority) {
      const priority = url.priority || opts.defaultPriority;
      xml += `${indent}${indent}<priority>${priority}</priority>${newline}`;
    }

    // Images
    if (url.images && url.images.length > 0) {
      url.images.forEach((image) => {
        xml += `${indent}${indent}<image:image>${newline}`;
        xml += `${indent}${indent}${indent}<image:loc>${escapeXml(image.loc)}</image:loc>${newline}`;
        if (image.caption) {
          xml += `${indent}${indent}${indent}<image:caption>${escapeXml(image.caption)}</image:caption>${newline}`;
        }
        if (image.title) {
          xml += `${indent}${indent}${indent}<image:title>${escapeXml(image.title)}</image:title>${newline}`;
        }
        xml += `${indent}${indent}</image:image>${newline}`;
      });
    }

    // Alternates (hreflang)
    if (url.alternates && url.alternates.length > 0) {
      url.alternates.forEach((alt) => {
        xml += `${indent}${indent}<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}"/>${newline}`;
      });
    }

    xml += `${indent}</url>${newline}`;
  });

  xml += `</urlset>`;

  const fileSize = new Blob([xml]).size;

  return {
    xml,
    urlCount: validUrls.length,
    fileSize,
    isValid: warnings.length === 0,
    warnings,
  };
}

/**
 * Validate a URL for sitemap inclusion
 */
export function validateSitemapUrl(url: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL is required');
    return { isValid: false, errors };
  }

  // Check URL format
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use http or https protocol');
    }
  } catch {
    errors.push('Invalid URL format');
  }

  // Check URL length
  if (url.length > SITEMAP_LIMITS.MAX_URL_LENGTH) {
    errors.push(`URL exceeds maximum length of ${SITEMAP_LIMITS.MAX_URL_LENGTH} characters`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Create a new sitemap URL entry
 */
export function createSitemapUrl(
  loc: string,
  options: Partial<{
    lastmod: string;
    changefreq: ChangeFrequency;
    priority: Priority;
  }> = {}
): SitemapUrl {
  const validation = validateSitemapUrl(loc);

  return {
    id: crypto.randomUUID(),
    loc,
    lastmod: options.lastmod,
    changefreq: options.changefreq,
    priority: options.priority,
    isValid: validation.isValid,
    errors: validation.errors,
  };
}

/**
 * Generate sitemap index XML
 */
export function generateSitemapIndex(
  sitemaps: { loc: string; lastmod?: string }[],
  options: { prettyPrint?: boolean; xmlDeclaration?: boolean } = {}
): string {
  const prettyPrint = options.prettyPrint ?? SITEMAP_DEFAULTS.PRETTY_PRINT;
  const xmlDeclaration = options.xmlDeclaration ?? SITEMAP_DEFAULTS.XML_DECLARATION;

  const indent = prettyPrint ? '  ' : '';
  const newline = prettyPrint ? '\n' : '';

  let xml = '';

  if (xmlDeclaration) {
    xml += `<?xml version="1.0" encoding="UTF-8"?>${newline}`;
  }

  xml += `<sitemapindex xmlns="${SITEMAP_NAMESPACES.SITEMAP}">${newline}`;

  sitemaps.forEach((sitemap) => {
    xml += `${indent}<sitemap>${newline}`;
    xml += `${indent}${indent}<loc>${escapeXml(sitemap.loc)}</loc>${newline}`;
    if (sitemap.lastmod) {
      xml += `${indent}${indent}<lastmod>${sitemap.lastmod}</lastmod>${newline}`;
    }
    xml += `${indent}</sitemap>${newline}`;
  });

  xml += `</sitemapindex>`;

  return xml;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
