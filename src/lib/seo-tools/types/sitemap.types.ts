export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
export type Priority = '1.0' | '0.9' | '0.8' | '0.7' | '0.6' | '0.5' | '0.4' | '0.3' | '0.2' | '0.1';

export interface SitemapUrl {
  id: string;
  loc: string;
  lastmod?: string;
  changefreq?: ChangeFrequency;
  priority?: Priority;
  images?: SitemapImage[];
  alternates?: SitemapAlternate[];
  isValid: boolean;
  errors: string[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

export interface SitemapAlternate {
  hreflang: string;
  href: string;
}

export interface SitemapGeneratorOptions {
  includeLastmod: boolean;
  includePriority: boolean;
  includeChangefreq: boolean;
  xmlDeclaration: boolean;
  prettyPrint: boolean;
  defaultPriority: Priority;
  defaultChangefreq: ChangeFrequency;
}

export interface SitemapExportResult {
  xml: string;
  urlCount: number;
  fileSize: number;
  isValid: boolean;
  warnings: string[];
}
