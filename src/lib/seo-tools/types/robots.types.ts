import type { ValidationError, ValidationWarning } from './index';

export interface RobotsRule {
  userAgent: string;
  rules: RobotsDirective[];
}

export interface RobotsDirective {
  type: 'allow' | 'disallow';
  path: string;
  line: number;
}

export interface RobotsParsedFile {
  rules: RobotsRule[];
  sitemaps: string[];
  host?: string;
  rawContent: string;
  parseErrors: ParseError[];
}

export interface ParseError {
  line: number;
  column?: number;
  message: string;
  code: string;
}

export interface UrlTestResult {
  url: string;
  userAgent: string;
  isAllowed: boolean;
  matchedRule?: RobotsDirective;
  reason: string;
}

export interface RobotsValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: {
    ruleCount: number;
    userAgentCount: number;
    sitemapCount: number;
    lineCount: number;
    fileSize: number;
  };
}

export interface RobotsUserAgent {
  id: string;
  name: string;
  pattern: string;
  icon: string;
  category: 'search' | 'ai' | 'social' | 'other';
}

export interface RobotsTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}
