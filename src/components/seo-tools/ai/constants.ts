// AI Assist Constants

export const AI_MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

export const STORAGE_KEYS = {
  consent: 'aicw-ai-consent',
  dontAskAgain: 'aicw-ai-dont-ask',
  modelCached: 'aicw-ai-cached',
} as const;

export const AI_REQUIREMENTS = {
  minRam: 8, // GB
  modelSize: 125, // MB approximate
  downloadTime: '1-2 minutes',
} as const;

export const SCHEMA_SYSTEM_PROMPT = `You are a JSON-LD schema generator. Based on the user's description, generate valid schema.org JSON-LD.

Rules:
1. Output ONLY valid JSON, no markdown code blocks, no explanation
2. Choose the most appropriate schema type (Article, Product, Organization, Person, LocalBusiness, FAQPage, etc.)
3. Include @context and @type fields
4. Include all required fields with reasonable defaults
5. Use ISO 8601 date format for dates
6. Use full URLs where appropriate`;

export const LLMS_SYSTEM_PROMPT = `You are an llms.txt file generator. Based on the user's description, generate a well-structured llms.txt file.

Rules:
1. Output ONLY the llms.txt content, no explanation
2. Start with a title line (# Title)
3. Include a tagline if appropriate (> tagline)
4. Add an Overview section with clear description
5. Include Quick Links section if URLs are mentioned
6. Add relevant additional sections based on the content
7. Use markdown formatting`;

export const SCHEMA_USER_PROMPT_TEMPLATE = `Generate JSON-LD schema for: {input}`;

export const LLMS_USER_PROMPT_TEMPLATE = `Generate llms.txt file for: {input}`;

export type AiTool = 'schema' | 'llms';

export type BannerState =
  | 'collapsed'
  | 'consent'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'unsupported'
  | 'error';

export type AiState = 'idle' | 'loading' | 'ready' | 'generating' | 'error';

export interface AiSupportStatus {
  supported: boolean;
  reason?: string;
  hasLowMemory?: boolean;
}
