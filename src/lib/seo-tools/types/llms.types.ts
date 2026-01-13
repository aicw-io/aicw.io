export interface LlmsData {
  title: string;
  tagline?: string;
  url?: string;
  overview: string;
  sections: LlmsSectionData[];
  links: LlmsLink[];
}

export interface LlmsSectionData {
  id: string;
  name: string;
  content: string;
  order: number;
  enabled: boolean;
}

export interface LlmsLink {
  id: string;
  name: string;
  url: string;
  description?: string;
  category: string;
  order: number;
}

export interface LlmsGeneratorOptions {
  includeTitle: boolean;
  includeLinks: boolean;
  lineWidth: number;
  sectionSeparator: string;
  headingStyle: '#' | '##';
  listStyle: '-' | '*';
}

export interface LlmsSection {
  id: string;
  name: string;
  required: boolean;
  description: string;
  placeholder: string;
  order: number;
}

export interface LlmsTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Partial<LlmsData>;
}

export interface LlmsLinkCategory {
  id: string;
  name: string;
  description: string;
}
