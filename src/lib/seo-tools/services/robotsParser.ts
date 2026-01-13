import type {
  RobotsParsedFile,
  RobotsRule,
  RobotsDirective,
  ParseError,
  UrlTestResult,
} from '../types';
import { ROBOTS_ERROR_CODES } from '../constants';

/**
 * Parse robots.txt content into structured data
 */
export function parseRobotsTxt(content: string): RobotsParsedFile {
  const lines = content.split('\n');
  const errors: ParseError[] = [];
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];
  let host: string | undefined;

  let currentUserAgents: string[] = [];
  let currentDirectives: RobotsDirective[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // Parse directive
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) {
      errors.push({
        line: lineNumber,
        message: `Invalid line format: expected "directive: value"`,
        code: ROBOTS_ERROR_CODES.SYNTAX_ERROR,
      });
      return;
    }

    const directive = trimmedLine.substring(0, colonIndex).trim();
    const value = trimmedLine.substring(colonIndex + 1).trim();

    switch (directive.toLowerCase()) {
      case 'user-agent':
        // If we have pending directives, save the current rule
        if (currentUserAgents.length > 0 && currentDirectives.length > 0) {
          currentUserAgents.forEach((ua) => {
            rules.push({
              userAgent: ua,
              rules: [...currentDirectives],
            });
          });
          currentDirectives = [];
          currentUserAgents = [];
        }

        // If directives is empty but we already have user agents, just add to the list
        if (currentDirectives.length === 0) {
          currentUserAgents.push(value);
        } else {
          currentUserAgents = [value];
        }
        break;

      case 'disallow':
        if (currentUserAgents.length === 0) {
          errors.push({
            line: lineNumber,
            message: 'Disallow directive must follow a User-agent directive',
            code: ROBOTS_ERROR_CODES.MISSING_USER_AGENT,
          });
        } else {
          currentDirectives.push({
            type: 'disallow',
            path: value,
            line: lineNumber,
          });
        }
        break;

      case 'allow':
        if (currentUserAgents.length === 0) {
          errors.push({
            line: lineNumber,
            message: 'Allow directive must follow a User-agent directive',
            code: ROBOTS_ERROR_CODES.MISSING_USER_AGENT,
          });
        } else {
          currentDirectives.push({
            type: 'allow',
            path: value,
            line: lineNumber,
          });
        }
        break;

      case 'sitemap':
        if (!isValidUrl(value)) {
          errors.push({
            line: lineNumber,
            message: `Invalid sitemap URL: ${value}`,
            code: ROBOTS_ERROR_CODES.INVALID_SITEMAP_URL,
          });
        } else {
          sitemaps.push(value);
        }
        break;

      case 'host':
        host = value;
        break;

      case 'crawl-delay':
        // Validate it's a number (we store but don't actively use)
        if (isNaN(Number(value))) {
          errors.push({
            line: lineNumber,
            message: 'Crawl-delay must be a number',
            code: ROBOTS_ERROR_CODES.INVALID_CRAWL_DELAY,
          });
        }
        break;

      default:
        // Unknown directive - could be a typo
        if (directive.toLowerCase() !== 'noindex') {
          errors.push({
            line: lineNumber,
            message: `Unknown directive: ${directive}`,
            code: ROBOTS_ERROR_CODES.INVALID_DIRECTIVE,
          });
        }
    }
  });

  // Save any remaining rules
  if (currentUserAgents.length > 0 && currentDirectives.length > 0) {
    currentUserAgents.forEach((ua) => {
      rules.push({
        userAgent: ua,
        rules: [...currentDirectives],
      });
    });
  }

  return {
    rules,
    sitemaps,
    host,
    rawContent: content,
    parseErrors: errors,
  };
}

/**
 * Test if a URL is allowed for a specific user agent
 */
export function testUrl(
  parsed: RobotsParsedFile,
  url: string,
  userAgent: string
): UrlTestResult {
  // Get path from URL
  let path: string;
  try {
    const urlObj = new URL(url);
    path = urlObj.pathname + urlObj.search;
  } catch {
    path = url.startsWith('/') ? url : `/${url}`;
  }

  // Find applicable rules
  const applicableRules = parsed.rules.filter(
    (r) => r.userAgent === userAgent || r.userAgent === '*'
  );

  // Specific user-agent takes precedence over *
  const specificRules = applicableRules.find((r) => r.userAgent === userAgent);
  const wildcardRules = applicableRules.find((r) => r.userAgent === '*');
  const rulesToUse = specificRules || wildcardRules;

  if (!rulesToUse) {
    return {
      url,
      userAgent,
      isAllowed: true,
      reason: 'No rules found for this user agent (default: allowed)',
    };
  }

  // Find the most specific matching rule
  let matchedRule: RobotsDirective | undefined;
  let longestMatch = -1;

  for (const rule of rulesToUse.rules) {
    if (pathMatches(path, rule.path)) {
      const matchLength = rule.path.length;
      if (matchLength > longestMatch) {
        longestMatch = matchLength;
        matchedRule = rule;
      }
    }
  }

  if (!matchedRule) {
    return {
      url,
      userAgent,
      isAllowed: true,
      reason: 'No matching rules (default: allowed)',
    };
  }

  return {
    url,
    userAgent,
    isAllowed: matchedRule.type === 'allow',
    matchedRule,
    reason:
      matchedRule.type === 'allow'
        ? `Allowed by rule on line ${matchedRule.line}: Allow: ${matchedRule.path}`
        : `Blocked by rule on line ${matchedRule.line}: Disallow: ${matchedRule.path}`,
  };
}

/**
 * Check if a path matches a robots.txt pattern
 */
function pathMatches(path: string, pattern: string): boolean {
  // Empty pattern matches nothing for Disallow, everything for Allow
  if (!pattern) return false;

  // Handle * wildcard and $ end anchor
  let regex = pattern
    .replace(/[.+?^{}()|[\]\\]/g, '\\$&') // Escape special regex chars except * and $
    .replace(/\*/g, '.*'); // * matches anything

  // $ at end means exact match
  if (regex.endsWith('\\$')) {
    regex = regex.slice(0, -2) + '$';
  }

  regex = `^${regex}`;

  try {
    return new RegExp(regex).test(path);
  } catch {
    return path.startsWith(pattern);
  }
}

/**
 * Validate a URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
