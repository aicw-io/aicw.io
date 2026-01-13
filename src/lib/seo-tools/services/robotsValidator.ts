import type { RobotsParsedFile, RobotsValidationResult } from '../types';
import type { ValidationError, ValidationWarning } from '../types';
import {
  ROBOTS_VALIDATION,
  ROBOTS_ERROR_CODES,
  ROBOTS_WARNING_CODES,
} from '../constants';

/**
 * Validate a parsed robots.txt file
 */
export function validateRobotsTxt(
  parsed: RobotsParsedFile
): RobotsValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Add parse errors
  parsed.parseErrors.forEach((error) => {
    errors.push({
      code: error.code,
      message: error.message,
      line: error.line,
      column: error.column,
      severity: 'error',
    });
  });

  // Check file size
  const fileSize = new Blob([parsed.rawContent]).size;
  if (fileSize > ROBOTS_VALIDATION.MAX_FILE_SIZE_BYTES) {
    errors.push({
      code: ROBOTS_ERROR_CODES.FILE_TOO_LARGE,
      message: `File size (${Math.round(fileSize / 1024)}KB) exceeds maximum (${ROBOTS_VALIDATION.MAX_FILE_SIZE_BYTES / 1024}KB)`,
      severity: 'error',
    });
  }

  // Check for missing sitemap
  if (parsed.sitemaps.length === 0) {
    warnings.push({
      code: ROBOTS_WARNING_CODES.NO_SITEMAP,
      message: 'No sitemap directive found',
      severity: 'warning',
      suggestion:
        'Add a Sitemap directive to help search engines discover your content',
    });
  }

  // Check for broad disallow blocking everything
  parsed.rules.forEach((rule) => {
    const hasFullDisallow = rule.rules.some(
      (r) => r.type === 'disallow' && r.path === '/'
    );
    const hasNoAllow = !rule.rules.some((r) => r.type === 'allow');

    if (hasFullDisallow && hasNoAllow && rule.userAgent === '*') {
      warnings.push({
        code: ROBOTS_WARNING_CODES.BROAD_DISALLOW,
        message: 'Blocking all crawlers from the entire site',
        severity: 'warning',
        suggestion:
          'Consider allowing specific paths or removing the broad disallow',
      });
    }
  });

  // Check for Crawl-delay (deprecated by Google)
  if (parsed.rawContent.toLowerCase().includes('crawl-delay')) {
    warnings.push({
      code: ROBOTS_WARNING_CODES.CRAWL_DELAY_IGNORED,
      message: 'Crawl-delay directive is ignored by major search engines',
      severity: 'warning',
      suggestion:
        'Use Google Search Console to adjust crawl rate instead',
    });
  }

  // Calculate stats
  const stats = {
    ruleCount: parsed.rules.reduce((sum, r) => sum + r.rules.length, 0),
    userAgentCount: new Set(parsed.rules.map((r) => r.userAgent)).size,
    sitemapCount: parsed.sitemaps.length,
    lineCount: parsed.rawContent.split('\n').length,
    fileSize,
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}
