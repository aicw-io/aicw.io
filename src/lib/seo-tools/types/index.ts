// Common types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  line?: number;
  column?: number;
  field?: string;
  severity: 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  line?: number;
  column?: number;
  field?: string;
  severity: 'warning';
  suggestion?: string;
}

// Re-export tool-specific types
export * from './robots.types';
export * from './sitemap.types';
export * from './schema.types';
export * from './llms.types';
