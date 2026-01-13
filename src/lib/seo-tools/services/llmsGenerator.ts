import type {
  LlmsData,
  LlmsGeneratorOptions,
  LlmsLink,
} from '../types';
import type { ValidationError, ValidationWarning } from '../types';
import {
  LLMS_FORMAT_OPTIONS,
  LLMS_LINK_CATEGORIES,
  LLMS_VALIDATION,
  LLMS_ERROR_CODES,
} from '../constants';

/**
 * Generate llms.txt content from structured data
 */
export function generateLlmsTxt(
  data: LlmsData,
  options: Partial<LlmsGeneratorOptions> = {}
): string {
  const opts: LlmsGeneratorOptions = {
    includeTitle: options.includeTitle ?? true,
    includeLinks: options.includeLinks ?? true,
    lineWidth: options.lineWidth ?? LLMS_FORMAT_OPTIONS.LINE_WIDTH,
    sectionSeparator: options.sectionSeparator ?? LLMS_FORMAT_OPTIONS.SECTION_SEPARATOR,
    headingStyle: options.headingStyle ?? LLMS_FORMAT_OPTIONS.HEADING_STYLE,
    listStyle: options.listStyle ?? LLMS_FORMAT_OPTIONS.LIST_STYLE,
  };

  const lines: string[] = [];

  // Title
  if (opts.includeTitle && data.title) {
    lines.push(`${opts.headingStyle} ${data.title}`);
    if (data.tagline) {
      lines.push('');
      lines.push(`> ${data.tagline}`);
    }
    if (data.url) {
      lines.push('');
      lines.push(`URL: ${data.url}`);
    }
    lines.push(opts.sectionSeparator);
  }

  // Overview
  if (data.overview) {
    lines.push(`${opts.headingStyle}${opts.headingStyle} Overview`);
    lines.push('');
    lines.push(wrapText(data.overview, opts.lineWidth));
    lines.push(opts.sectionSeparator);
  }

  // Links section
  if (opts.includeLinks && data.links.length > 0) {
    lines.push(`${opts.headingStyle}${opts.headingStyle} Quick Links`);
    lines.push('');

    // Group links by category
    const groupedLinks = groupLinksByCategory(data.links);

    Object.entries(groupedLinks).forEach(([category, links]) => {
      if (links.length > 0) {
        lines.push(`**${getCategoryName(category)}**`);
        links.forEach((link) => {
          const desc = link.description ? `: ${link.description}` : '';
          lines.push(`${opts.listStyle} [${link.name}](${link.url})${desc}`);
        });
        lines.push('');
      }
    });

    lines.push(opts.sectionSeparator);
  }

  // Custom sections
  const enabledSections = data.sections
    .filter((s) => s.enabled && s.content)
    .sort((a, b) => a.order - b.order);

  enabledSections.forEach((section) => {
    lines.push(`${opts.headingStyle}${opts.headingStyle} ${section.name}`);
    lines.push('');
    lines.push(section.content);
    lines.push(opts.sectionSeparator);
  });

  // Clean up extra separators at the end
  let result = lines.join('\n').trim();
  while (result.endsWith('---')) {
    result = result.slice(0, -3).trim();
  }

  return result;
}

/**
 * Validate llms.txt data
 */
export function validateLlmsData(data: LlmsData): {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    sectionCount: number;
    linkCount: number;
    wordCount: number;
    characterCount: number;
  };
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate title
  if (!data.title || data.title.trim() === '') {
    errors.push({
      code: LLMS_ERROR_CODES.MISSING_TITLE,
      message: 'Title is required',
      severity: 'error',
    });
  }

  // Validate overview
  if (!data.overview || data.overview.trim() === '') {
    errors.push({
      code: LLMS_ERROR_CODES.MISSING_OVERVIEW,
      message: 'Overview section is required',
      severity: 'error',
    });
  } else if (data.overview.length < LLMS_VALIDATION.MIN_OVERVIEW_LENGTH) {
    warnings.push({
      code: LLMS_ERROR_CODES.OVERVIEW_TOO_SHORT,
      message: `Overview is very short (${data.overview.length} chars). Consider adding more detail.`,
      severity: 'warning',
    });
  } else if (data.overview.length > LLMS_VALIDATION.MAX_OVERVIEW_LENGTH) {
    warnings.push({
      code: LLMS_ERROR_CODES.OVERVIEW_TOO_LONG,
      message: `Overview is quite long (${data.overview.length} chars). Consider being more concise.`,
      severity: 'warning',
    });
  }

  // Validate links
  if (!data.links || data.links.length === 0) {
    warnings.push({
      code: LLMS_ERROR_CODES.MISSING_LINKS,
      message: 'No links provided. Consider adding important links.',
      severity: 'warning',
    });
  } else {
    // Validate each link URL
    data.links.forEach((link) => {
      if (!LLMS_VALIDATION.URL_PATTERN.test(link.url)) {
        errors.push({
          code: LLMS_ERROR_CODES.INVALID_URL,
          message: `Invalid URL for link "${link.name}": ${link.url}`,
          severity: 'error',
        });
      }
    });
  }

  // Calculate stats
  const fullText = generateLlmsTxt(data);
  const stats = {
    sectionCount: data.sections.filter((s) => s.enabled).length,
    linkCount: data.links.length,
    wordCount: fullText.split(/\s+/).length,
    characterCount: fullText.length,
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

/**
 * Create empty llms.txt data structure
 */
export function createEmptyLlmsData(): LlmsData {
  return {
    title: '',
    tagline: '',
    url: '',
    overview: '',
    sections: [],
    links: [],
  };
}

/**
 * Create a new link entry
 */
export function createLlmsLink(
  name: string,
  url: string,
  options: { description?: string; category?: string } = {}
): LlmsLink {
  return {
    id: crypto.randomUUID(),
    name,
    url,
    description: options.description,
    category: options.category || 'other',
    order: 0,
  };
}

/**
 * Wrap text to specified width
 */
function wrapText(text: string, width: number): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + ' ' + word).trim().length <= width) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}

/**
 * Group links by category
 */
function groupLinksByCategory(links: LlmsLink[]): Record<string, LlmsLink[]> {
  return links.reduce(
    (acc, link) => {
      const category = link.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(link);
      return acc;
    },
    {} as Record<string, LlmsLink[]>
  );
}

/**
 * Get category display name
 */
function getCategoryName(categoryId: string): string {
  const category = LLMS_LINK_CATEGORIES.find((c) => c.id === categoryId);
  return category?.name || categoryId;
}
