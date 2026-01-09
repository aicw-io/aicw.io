#!/usr/bin/env node

/**
 * Internal Linking Script for aichatwatch.com
 * Adds 250+ internal cross-links between 204 content files
 *
 * Usage:
 *   node scripts/add-internal-links.mjs --dry-run    # Preview changes
 *   node scripts/add-internal-links.mjs --verbose    # Detailed output
 *   node scripts/add-internal-links.mjs              # Apply changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

// ============================================================================
// ENTITY MAPPINGS
// ============================================================================

/**
 * Comprehensive entity-to-URL mapping
 * Each entity has: slug, category, names (variations), priority
 */
const ENTITIES = [
  // ==================== CHATGPT / OPENAI ECOSYSTEM ====================
  {
    slug: 'chatgpt',
    category: 'ai-chat-bot',
    names: ['ChatGPT', 'Chat GPT', 'ChatGPT-4', 'ChatGPT Plus'],
    priority: 100
  },
  {
    slug: 'chatgpt-search',
    category: 'ai-search-engine',
    names: ['ChatGPT Search', 'ChatGPT search engine'],
    priority: 90
  },
  {
    slug: 'chatgpt-shopping',
    category: 'ai-search-engine',
    names: ['ChatGPT Shopping'],
    priority: 85
  },
  {
    slug: 'gptbot',
    category: 'ai-crawler-bot',
    names: ['GPTBot', 'GPT bot', 'OpenAI crawler', 'OpenAI bot'],
    priority: 80
  },
  {
    slug: 'chatgpt-user',
    category: 'ai-crawler-bot',
    names: ['ChatGPT-User'],
    priority: 70
  },
  {
    slug: 'oai-searchbot',
    category: 'ai-crawler-bot',
    names: ['OAI-SearchBot', 'OpenAI SearchBot'],
    priority: 70
  },
  {
    slug: 'oai-research',
    category: 'ai-crawler-bot',
    names: ['OAI-Research'],
    priority: 65
  },
  {
    slug: 'openai-gpt-user',
    category: 'ai-crawler-bot',
    names: ['OpenAI-GPT-User'],
    priority: 65
  },

  // ==================== CLAUDE / ANTHROPIC ECOSYSTEM ====================
  {
    slug: 'claude',
    category: 'ai-chat-bot',
    names: ['Claude', 'Claude AI', 'Claude 3', 'Claude 3.5', 'Claude Sonnet', 'Claude Opus', 'Claude 3 Opus', 'Claude 3.5 Sonnet', 'Claude Haiku'],
    priority: 100
  },
  {
    slug: 'claudebot',
    category: 'ai-crawler-bot',
    names: ['ClaudeBot', 'Claude bot'],
    priority: 80
  },
  {
    slug: 'claude-web',
    category: 'ai-crawler-bot',
    names: ['Claude-Web', 'Claude Web'],
    priority: 75
  },
  {
    slug: 'claude-user',
    category: 'ai-crawler-bot',
    names: ['Claude-User'],
    priority: 70
  },
  {
    slug: 'claude-searchbot',
    category: 'ai-crawler-bot',
    names: ['Claude-SearchBot'],
    priority: 70
  },
  {
    slug: 'anthropic-ai',
    category: 'ai-crawler-bot',
    names: ['Anthropic-AI', 'anthropic-ai'],
    priority: 75
  },

  // ==================== GOOGLE ECOSYSTEM ====================
  {
    slug: 'google-gemini',
    category: 'ai-chat-bot',
    names: ['Google Gemini', 'Gemini', 'Gemini AI', 'Gemini Pro', 'Gemini Advanced', 'Gemini Ultra', 'Gemini 1.5'],
    priority: 100
  },
  {
    slug: 'google-ai-overviews',
    category: 'ai-search-engine',
    names: ['Google AI Overviews', 'AI Overviews', 'Google SGE', 'Search Generative Experience'],
    priority: 90
  },
  {
    slug: 'googlebot',
    category: 'ai-crawler-bot',
    names: ['Googlebot', 'Google bot'],
    priority: 85
  },
  {
    slug: 'google-extended',
    category: 'ai-crawler-bot',
    names: ['Google-Extended'],
    priority: 80
  },
  {
    slug: 'google-cloudvertexbot',
    category: 'ai-crawler-bot',
    names: ['Google-CloudVertexBot', 'CloudVertexBot'],
    priority: 70
  },
  {
    slug: 'google-inspectiontool',
    category: 'ai-crawler-bot',
    names: ['Google-InspectionTool'],
    priority: 65
  },
  {
    slug: 'googleother',
    category: 'ai-crawler-bot',
    names: ['GoogleOther'],
    priority: 65
  },
  {
    slug: 'feedfetcher-google',
    category: 'ai-crawler-bot',
    names: ['FeedFetcher-Google', 'Feedfetcher'],
    priority: 60
  },
  {
    slug: 'storebot-google',
    category: 'ai-crawler-bot',
    names: ['Storebot-Google'],
    priority: 60
  },

  // ==================== PERPLEXITY ECOSYSTEM ====================
  {
    slug: 'perplexity',
    category: 'ai-chat-bot',
    names: ['Perplexity', 'Perplexity AI'],
    priority: 100
  },
  {
    slug: 'perplexity-ai',
    category: 'ai-search-engine',
    names: ['Perplexity search', 'Perplexity AI search'],
    priority: 95
  },
  {
    slug: 'perplexitybot',
    category: 'ai-crawler-bot',
    names: ['PerplexityBot', 'Perplexity bot', 'Perplexity crawler'],
    priority: 80
  },
  {
    slug: 'perplexity-user',
    category: 'ai-crawler-bot',
    names: ['Perplexity-User'],
    priority: 70
  },
  {
    slug: 'perplexity-ads-bot',
    category: 'ai-crawler-bot',
    names: ['Perplexity-Ads-Bot'],
    priority: 65
  },

  // ==================== MICROSOFT ECOSYSTEM ====================
  {
    slug: 'microsoft-copilot',
    category: 'ai-chat-bot',
    names: ['Microsoft Copilot', 'Copilot', 'Windows Copilot', 'Bing Chat', 'Bing Copilot'],
    priority: 100
  },
  {
    slug: 'bingbot',
    category: 'ai-crawler-bot',
    names: ['Bingbot', 'Bing bot', 'Bing crawler'],
    priority: 85
  },
  {
    slug: 'bingpreview',
    category: 'ai-crawler-bot',
    names: ['BingPreview'],
    priority: 70
  },
  {
    slug: 'msnbot',
    category: 'ai-crawler-bot',
    names: ['msnbot', 'MSN bot'],
    priority: 65
  },
  {
    slug: 'adidxbot',
    category: 'ai-crawler-bot',
    names: ['AdIdxBot'],
    priority: 60
  },

  // ==================== DEEPSEEK ECOSYSTEM ====================
  {
    slug: 'deepseek',
    category: 'ai-chat-bot',
    names: ['DeepSeek', 'DeepSeek V3', 'DeepSeek R1', 'DeepSeek AI', 'DeepSeek-V3', 'DeepSeek-R1'],
    priority: 100
  },
  {
    slug: 'deepseekbot',
    category: 'ai-crawler-bot',
    names: ['DeepSeekBot', 'DeepSeek bot', 'DeepSeek crawler'],
    priority: 80
  },

  // ==================== GROK / XAI ECOSYSTEM ====================
  {
    slug: 'grok',
    category: 'ai-chat-bot',
    names: ['Grok', 'Grok AI', 'xAI Grok', 'Grok 2', 'Grok-2'],
    priority: 100
  },
  {
    slug: 'grokbot',
    category: 'ai-crawler-bot',
    names: ['GrokBot', 'Grok bot', 'Grok crawler', 'xAI crawler'],
    priority: 80
  },

  // ==================== META AI ECOSYSTEM ====================
  {
    slug: 'meta-ai',
    category: 'ai-chat-bot',
    names: ['Meta AI', 'Facebook AI'],
    priority: 100
  },
  {
    slug: 'llama',
    category: 'ai-chat-bot',
    names: ['Llama', 'Llama 2', 'Llama 3', 'Llama 3.1', 'LLaMA', 'Meta Llama', 'Llama 3.2', 'Llama-3'],
    priority: 95
  },
  {
    slug: 'meta-externalagent',
    category: 'ai-crawler-bot',
    names: ['Meta-ExternalAgent'],
    priority: 75
  },
  {
    slug: 'meta-externalfetcher',
    category: 'ai-crawler-bot',
    names: ['Meta-ExternalFetcher'],
    priority: 70
  },
  {
    slug: 'facebookbot',
    category: 'ai-crawler-bot',
    names: ['Facebookbot', 'Facebook bot'],
    priority: 75
  },
  {
    slug: 'facebookexternalhit',
    category: 'ai-crawler-bot',
    names: ['facebookexternalhit'],
    priority: 65
  },

  // ==================== MISTRAL ECOSYSTEM ====================
  {
    slug: 'mistral',
    category: 'ai-chat-bot',
    names: ['Mistral', 'Mistral AI', 'Mistral Large', 'Mistral Medium', 'Mistral 7B'],
    priority: 100
  },
  {
    slug: 'mistral-le-chat',
    category: 'ai-chat-bot',
    names: ['Le Chat', 'Mistral Le Chat'],
    priority: 90
  },

  // ==================== YOU.COM ECOSYSTEM ====================
  {
    slug: 'you-com',
    category: 'ai-search-engine',
    names: ['You.com', 'You AI', 'YouChat'],
    priority: 100
  },
  {
    slug: 'youbot',
    category: 'ai-crawler-bot',
    names: ['YouBot', 'You.com bot', 'You.com crawler'],
    priority: 80
  },

  // ==================== BRAVE ECOSYSTEM ====================
  {
    slug: 'brave-search-ai',
    category: 'ai-search-engine',
    names: ['Brave Search', 'Brave AI', 'Brave Leo', 'Brave Search AI'],
    priority: 100
  },
  {
    slug: 'bravebot',
    category: 'ai-crawler-bot',
    names: ['BraveBot', 'Brave bot', 'Brave crawler'],
    priority: 80
  },

  // ==================== DUCKDUCKGO ECOSYSTEM ====================
  {
    slug: 'duckduckgo-ai-chat',
    category: 'ai-search-engine',
    names: ['DuckDuckGo AI Chat', 'DuckDuckGo AI', 'DDG AI', 'DuckDuckGo'],
    priority: 100
  },
  {
    slug: 'duckassistbot',
    category: 'ai-crawler-bot',
    names: ['DuckAssistBot', 'DuckDuckGo bot'],
    priority: 80
  },

  // ==================== BAIDU ECOSYSTEM ====================
  {
    slug: 'ernie-bot',
    category: 'ai-chat-bot',
    names: ['ERNIE Bot', 'Ernie', 'ERNIE', 'Baidu ERNIE'],
    priority: 100
  },
  {
    slug: 'baidu-ernie',
    category: 'ai-search-engine',
    names: ['Baidu AI', 'Baidu search AI'],
    priority: 90
  },
  {
    slug: 'baiduspider',
    category: 'ai-crawler-bot',
    names: ['Baiduspider', 'Baidu Spider', 'Baidu crawler'],
    priority: 80
  },

  // ==================== COHERE ECOSYSTEM ====================
  {
    slug: 'cohere-command',
    category: 'ai-chat-bot',
    names: ['Cohere Command', 'Cohere', 'Command R', 'Command R+', 'Command-R'],
    priority: 100
  },
  {
    slug: 'cohere-ai',
    category: 'ai-crawler-bot',
    names: ['Cohere-AI', 'cohere-ai'],
    priority: 80
  },
  {
    slug: 'cohere-training-data-crawler',
    category: 'ai-crawler-bot',
    names: ['Cohere-Training-Data-Crawler'],
    priority: 70
  },

  // ==================== STANDALONE CHATBOTS ====================
  {
    slug: 'github-copilot',
    category: 'ai-chat-bot',
    names: ['GitHub Copilot', 'GH Copilot'],
    priority: 95
  },
  {
    slug: 'amazon-codewhisperer',
    category: 'ai-chat-bot',
    names: ['Amazon CodeWhisperer', 'CodeWhisperer', 'AWS CodeWhisperer'],
    priority: 90
  },
  {
    slug: 'amazon-q',
    category: 'ai-chat-bot',
    names: ['Amazon Q', 'AWS Q'],
    priority: 90
  },
  {
    slug: 'cursor',
    category: 'ai-chat-bot',
    names: ['Cursor', 'Cursor AI', 'Cursor IDE'],
    priority: 90
  },
  {
    slug: 'codeium',
    category: 'ai-chat-bot',
    names: ['Codeium', 'Codeium AI'],
    priority: 85
  },
  {
    slug: 'tabnine',
    category: 'ai-chat-bot',
    names: ['Tabnine', 'TabNine'],
    priority: 85
  },
  {
    slug: 'huggingchat',
    category: 'ai-chat-bot',
    names: ['HuggingChat', 'Hugging Chat', 'HuggingFace Chat'],
    priority: 85
  },
  {
    slug: 'poe',
    category: 'ai-chat-bot',
    names: ['Poe', 'Poe AI', 'Quora Poe'],
    priority: 85
  },
  {
    slug: 'pi',
    category: 'ai-chat-bot',
    names: ['Pi', 'Pi AI', 'Inflection Pi'],
    priority: 80
  },
  {
    slug: 'character-ai',
    category: 'ai-chat-bot',
    names: ['Character.AI', 'Character AI', 'CharacterAI'],
    priority: 85
  },
  {
    slug: 'replika',
    category: 'ai-chat-bot',
    names: ['Replika', 'Replika AI'],
    priority: 80
  },
  {
    slug: 'jasper-chat',
    category: 'ai-chat-bot',
    names: ['Jasper Chat', 'Jasper AI', 'Jasper'],
    priority: 85
  },
  {
    slug: 'copy-ai',
    category: 'ai-chat-bot',
    names: ['Copy.ai', 'Copy AI', 'CopyAI'],
    priority: 80
  },
  {
    slug: 'writesonic',
    category: 'ai-chat-bot',
    names: ['Writesonic', 'Writesonic AI'],
    priority: 80
  },
  {
    slug: 'grammarly',
    category: 'ai-chat-bot',
    names: ['Grammarly', 'Grammarly AI'],
    priority: 85
  },
  {
    slug: 'drift',
    category: 'ai-chat-bot',
    names: ['Drift', 'Drift AI'],
    priority: 75
  },
  {
    slug: 'intercom-fin',
    category: 'ai-chat-bot',
    names: ['Intercom Fin', 'Fin AI', 'Intercom AI'],
    priority: 75
  },
  {
    slug: 'zendesk-ai',
    category: 'ai-chat-bot',
    names: ['Zendesk AI', 'Zendesk bot'],
    priority: 75
  },
  {
    slug: 'salesforce-einstein',
    category: 'ai-chat-bot',
    names: ['Salesforce Einstein', 'Einstein AI', 'Einstein GPT'],
    priority: 80
  },
  {
    slug: 'ibm-watsonx-assistant',
    category: 'ai-chat-bot',
    names: ['IBM Watsonx', 'Watson AI', 'Watsonx', 'Watson Assistant'],
    priority: 80
  },
  {
    slug: 'duolingo-max',
    category: 'ai-chat-bot',
    names: ['Duolingo Max', 'Duolingo AI'],
    priority: 75
  },
  {
    slug: 'khanmigo',
    category: 'ai-chat-bot',
    names: ['Khanmigo', 'Khan Academy AI'],
    priority: 75
  },
  {
    slug: 'woebot',
    category: 'ai-chat-bot',
    names: ['Woebot', 'Woebot Health'],
    priority: 70
  },
  {
    slug: 'wysa',
    category: 'ai-chat-bot',
    names: ['Wysa', 'Wysa AI'],
    priority: 70
  },
  {
    slug: 'openchat',
    category: 'ai-chat-bot',
    names: ['OpenChat'],
    priority: 70
  },
  {
    slug: 'reka',
    category: 'ai-chat-bot',
    names: ['Reka', 'Reka AI', 'Reka Core', 'Reka Flash'],
    priority: 75
  },
  {
    slug: 'yi',
    category: 'ai-chat-bot',
    names: ['Yi', 'Yi AI', 'Yi-34B'],
    priority: 75
  },
  {
    slug: 'qwen',
    category: 'ai-chat-bot',
    names: ['Qwen', 'Qwen AI', 'Qwen 2', 'Qwen-72B'],
    priority: 80
  },
  {
    slug: 'tongyi-qianwen',
    category: 'ai-chat-bot',
    names: ['Tongyi Qianwen', 'Alibaba AI'],
    priority: 75
  },
  {
    slug: 'tencent-hunyuan',
    category: 'ai-chat-bot',
    names: ['Tencent Hunyuan', 'Hunyuan'],
    priority: 75
  },
  {
    slug: 'bloom',
    category: 'ai-chat-bot',
    names: ['BLOOM', 'BigScience BLOOM'],
    priority: 70
  },
  {
    slug: 'falcon',
    category: 'ai-chat-bot',
    names: ['Falcon', 'Falcon AI', 'Falcon 40B', 'Falcon 180B'],
    priority: 75
  },
  {
    slug: 'phi',
    category: 'ai-chat-bot',
    names: ['Phi', 'Phi-2', 'Phi-3', 'Microsoft Phi'],
    priority: 75
  },
  {
    slug: 'gemma',
    category: 'ai-chat-bot',
    names: ['Gemma', 'Google Gemma', 'Gemma 2'],
    priority: 75
  },
  {
    slug: 'stablelm',
    category: 'ai-chat-bot',
    names: ['StableLM', 'Stable LM'],
    priority: 70
  },
  {
    slug: 'gpt-neox',
    category: 'ai-chat-bot',
    names: ['GPT-NeoX', 'GPT NeoX', 'EleutherAI'],
    priority: 70
  },
  {
    slug: 'ai21-jamba',
    category: 'ai-chat-bot',
    names: ['AI21 Jamba', 'Jamba', 'AI21 Labs'],
    priority: 70
  },

  // ==================== STANDALONE SEARCH ENGINES ====================
  {
    slug: 'kagi-search',
    category: 'ai-search-engine',
    names: ['Kagi', 'Kagi Search', 'Kagi AI'],
    priority: 85
  },
  {
    slug: 'phind',
    category: 'ai-search-engine',
    names: ['Phind', 'Phind AI', 'Phind search'],
    priority: 85
  },
  {
    slug: 'andi-search',
    category: 'ai-search-engine',
    names: ['Andi', 'Andi Search', 'Andi AI'],
    priority: 80
  },
  {
    slug: 'arc-search',
    category: 'ai-search-engine',
    names: ['Arc Search', 'Arc Browser AI'],
    priority: 80
  },
  {
    slug: 'elicit',
    category: 'ai-search-engine',
    names: ['Elicit', 'Elicit AI'],
    priority: 80
  },
  {
    slug: 'consensus',
    category: 'ai-search-engine',
    names: ['Consensus', 'Consensus AI'],
    priority: 80
  },
  {
    slug: 'semantic-scholar',
    category: 'ai-search-engine',
    names: ['Semantic Scholar'],
    priority: 80
  },
  {
    slug: 'connected-papers',
    category: 'ai-search-engine',
    names: ['Connected Papers'],
    priority: 75
  },
  {
    slug: 'scite-ai',
    category: 'ai-search-engine',
    names: ['Scite', 'scite AI', 'Scite.ai'],
    priority: 75
  },
  {
    slug: 'research-rabbit',
    category: 'ai-search-engine',
    names: ['Research Rabbit', 'ResearchRabbit'],
    priority: 70
  },
  {
    slug: 'scispace',
    category: 'ai-search-engine',
    names: ['SciSpace', 'Typeset'],
    priority: 75
  },
  {
    slug: 'wolfram-alpha',
    category: 'ai-search-engine',
    names: ['Wolfram Alpha', 'WolframAlpha', 'Wolfram|Alpha'],
    priority: 85
  },
  {
    slug: 'exa-ai',
    category: 'ai-search-engine',
    names: ['Exa', 'Exa AI', 'Exa.ai'],
    priority: 75
  },
  {
    slug: 'tavily',
    category: 'ai-search-engine',
    names: ['Tavily', 'Tavily AI'],
    priority: 70
  },
  {
    slug: 'iask-ai',
    category: 'ai-search-engine',
    names: ['iAsk.ai', 'iAsk'],
    priority: 70
  },
  {
    slug: 'komo-ai',
    category: 'ai-search-engine',
    names: ['Komo', 'Komo AI'],
    priority: 70
  },
  {
    slug: 'liner',
    category: 'ai-search-engine',
    names: ['Liner', 'Liner AI'],
    priority: 70
  },
  {
    slug: 'felo-ai',
    category: 'ai-search-engine',
    names: ['Felo', 'Felo AI'],
    priority: 70
  },
  {
    slug: 'undermind-ai',
    category: 'ai-search-engine',
    names: ['Undermind', 'Undermind AI'],
    priority: 70
  },
  {
    slug: 'open-evidence',
    category: 'ai-search-engine',
    names: ['Open Evidence', 'OpenEvidence'],
    priority: 70
  },
  {
    slug: 'medisearch',
    category: 'ai-search-engine',
    names: ['MediSearch', 'Medisearch AI'],
    priority: 70
  },
  // Legal AI search
  {
    slug: 'harvey-ai',
    category: 'ai-search-engine',
    names: ['Harvey AI', 'Harvey'],
    priority: 80
  },
  {
    slug: 'casetext-cocounsel',
    category: 'ai-search-engine',
    names: ['CoCounsel', 'Casetext', 'Casetext AI'],
    priority: 80
  },
  {
    slug: 'lexis-plus-ai',
    category: 'ai-search-engine',
    names: ['Lexis+ AI', 'LexisNexis AI'],
    priority: 75
  },
  {
    slug: 'westlaw-edge-ai',
    category: 'ai-search-engine',
    names: ['Westlaw Edge AI', 'Westlaw AI'],
    priority: 75
  },
  // Enterprise search
  {
    slug: 'algolia',
    category: 'ai-search-engine',
    names: ['Algolia', 'Algolia AI'],
    priority: 80
  },
  {
    slug: 'elasticsearch',
    category: 'ai-search-engine',
    names: ['Elasticsearch', 'Elastic Search'],
    priority: 80
  },
  {
    slug: 'glean',
    category: 'ai-search-engine',
    names: ['Glean', 'Glean AI'],
    priority: 75
  },
  {
    slug: 'coveo',
    category: 'ai-search-engine',
    names: ['Coveo', 'Coveo AI'],
    priority: 75
  },
  // Privacy search
  {
    slug: 'startpage',
    category: 'ai-search-engine',
    names: ['Startpage'],
    priority: 70
  },
  {
    slug: 'mojeek',
    category: 'ai-search-engine',
    names: ['Mojeek'],
    priority: 70
  },
  {
    slug: 'searxng',
    category: 'ai-search-engine',
    names: ['SearXNG', 'SearX'],
    priority: 70
  },
  {
    slug: 'qwant-french-privacy',
    category: 'ai-search-engine',
    names: ['Qwant'],
    priority: 70
  },
  // International
  {
    slug: 'yandex-gpt',
    category: 'ai-search-engine',
    names: ['Yandex GPT', 'YandexGPT'],
    priority: 75
  },
  {
    slug: 'naver-cue',
    category: 'ai-search-engine',
    names: ['Naver Cue', 'Naver AI'],
    priority: 70
  },
  // Image search
  {
    slug: 'tineye',
    category: 'ai-search-engine',
    names: ['TinEye'],
    priority: 70
  },
  {
    slug: 'pimeyes',
    category: 'ai-search-engine',
    names: ['PimEyes'],
    priority: 70
  },
  {
    slug: 'yep-search',
    category: 'ai-search-engine',
    names: ['Yep', 'Yep Search'],
    priority: 65
  },

  // ==================== CRAWLER BOTS ====================
  // SEO crawlers
  {
    slug: 'ahrefsbot',
    category: 'ai-crawler-bot',
    names: ['AhrefsBot', 'Ahrefs bot', 'Ahrefs crawler'],
    priority: 80
  },
  {
    slug: 'semrushbot',
    category: 'ai-crawler-bot',
    names: ['SemrushBot', 'Semrush bot', 'SEMrush crawler'],
    priority: 80
  },
  {
    slug: 'mj12bot-majestic-seo-crawler',
    category: 'ai-crawler-bot',
    names: ['MJ12bot', 'Majestic bot', 'Majestic crawler'],
    priority: 75
  },
  {
    slug: 'dotbot',
    category: 'ai-crawler-bot',
    names: ['DotBot', 'Moz bot'],
    priority: 75
  },
  {
    slug: 'rogerbot',
    category: 'ai-crawler-bot',
    names: ['Rogerbot', 'Roger bot'],
    priority: 70
  },
  {
    slug: 'sistrix-crawler',
    category: 'ai-crawler-bot',
    names: ['SISTRIX', 'Sistrix crawler'],
    priority: 70
  },
  {
    slug: 'serpstatbot',
    category: 'ai-crawler-bot',
    names: ['SerpstatBot', 'Serpstat bot'],
    priority: 70
  },
  {
    slug: 'seobilitybot',
    category: 'ai-crawler-bot',
    names: ['SeobilityBot', 'Seobility bot'],
    priority: 65
  },
  {
    slug: 'screaming-frog',
    category: 'ai-crawler-bot',
    names: ['Screaming Frog'],
    priority: 70
  },

  // Social media crawlers
  {
    slug: 'twitterbot',
    category: 'ai-crawler-bot',
    names: ['Twitterbot', 'Twitter bot', 'X bot'],
    priority: 75
  },
  {
    slug: 'linkedinbot',
    category: 'ai-crawler-bot',
    names: ['LinkedInBot', 'LinkedIn bot'],
    priority: 75
  },
  {
    slug: 'slackbot',
    category: 'ai-crawler-bot',
    names: ['Slackbot', 'Slack bot'],
    priority: 70
  },
  {
    slug: 'discordbot',
    category: 'ai-crawler-bot',
    names: ['Discordbot', 'Discord bot'],
    priority: 70
  },
  {
    slug: 'telegrambot',
    category: 'ai-crawler-bot',
    names: ['TelegramBot', 'Telegram bot'],
    priority: 70
  },
  {
    slug: 'pinterestbot',
    category: 'ai-crawler-bot',
    names: ['Pinterestbot', 'Pinterest bot'],
    priority: 70
  },
  {
    slug: 'snapchat',
    category: 'ai-crawler-bot',
    names: ['Snapchat bot'],
    priority: 65
  },
  {
    slug: 'whatsapp',
    category: 'ai-crawler-bot',
    names: ['WhatsApp bot'],
    priority: 65
  },

  // ByteDance / TikTok
  {
    slug: 'bytespider',
    category: 'ai-crawler-bot',
    names: ['Bytespider', 'ByteDance crawler'],
    priority: 80
  },
  {
    slug: 'bytedance-frontpage',
    category: 'ai-crawler-bot',
    names: ['ByteDance-Frontpage'],
    priority: 70
  },
  {
    slug: 'tiktokspider',
    category: 'ai-crawler-bot',
    names: ['TikTokSpider', 'TikTok crawler'],
    priority: 75
  },

  // Archive & data crawlers
  {
    slug: 'ccbot',
    category: 'ai-crawler-bot',
    names: ['CCBot', 'Common Crawl', 'CommonCrawl'],
    priority: 80
  },
  {
    slug: 'archive-org-bot',
    category: 'ai-crawler-bot',
    names: ['Archive.org bot', 'Internet Archive bot'],
    priority: 75
  },
  {
    slug: 'ia-archiver',
    category: 'ai-crawler-bot',
    names: ['ia_archiver'],
    priority: 70
  },
  {
    slug: 'ia-gensim',
    category: 'ai-crawler-bot',
    names: ['IA-GenSim'],
    priority: 65
  },
  {
    slug: 'diffbot',
    category: 'ai-crawler-bot',
    names: ['Diffbot'],
    priority: 75
  },
  {
    slug: 'omgilibot',
    category: 'ai-crawler-bot',
    names: ['Omgilibot', 'Webz.io bot'],
    priority: 70
  },
  {
    slug: 'webzio-extended',
    category: 'ai-crawler-bot',
    names: ['Webzio-Extended'],
    priority: 65
  },

  // Apple
  {
    slug: 'applebot',
    category: 'ai-crawler-bot',
    names: ['Applebot', 'Apple bot'],
    priority: 80
  },
  {
    slug: 'applebot-extended',
    category: 'ai-crawler-bot',
    names: ['Applebot-Extended'],
    priority: 75
  },
  {
    slug: 'apple-cloudkit',
    category: 'ai-crawler-bot',
    names: ['Apple-CloudKit'],
    priority: 65
  },

  // Amazon
  {
    slug: 'amazonbot',
    category: 'ai-crawler-bot',
    names: ['Amazonbot', 'Amazon bot'],
    priority: 75
  },

  // International search crawlers
  {
    slug: 'yandexbot',
    category: 'ai-crawler-bot',
    names: ['YandexBot', 'Yandex bot', 'Yandex crawler'],
    priority: 80
  },
  {
    slug: 'sogou-spider',
    category: 'ai-crawler-bot',
    names: ['Sogou Spider', 'Sogou bot'],
    priority: 70
  },
  {
    slug: 'naverbot',
    category: 'ai-crawler-bot',
    names: ['Naverbot', 'Naver bot'],
    priority: 70
  },
  {
    slug: 'daumoa',
    category: 'ai-crawler-bot',
    names: ['Daumoa', 'Daum bot'],
    priority: 65
  },
  {
    slug: 'coccocbot',
    category: 'ai-crawler-bot',
    names: ['Cốc Cốc Bot', 'CocCoc bot'],
    priority: 65
  },
  {
    slug: 'seznam-bot',
    category: 'ai-crawler-bot',
    names: ['SeznamBot', 'Seznam bot'],
    priority: 65
  },
  {
    slug: 'mojeekbot',
    category: 'ai-crawler-bot',
    names: ['MojeekBot', 'Mojeek bot'],
    priority: 70
  },
  {
    slug: 'qwantify',
    category: 'ai-crawler-bot',
    names: ['Qwantify', 'Qwant bot'],
    priority: 70
  },
  {
    slug: '360spider',
    category: 'ai-crawler-bot',
    names: ['360Spider'],
    priority: 65
  },

  // Monitoring & analytics
  {
    slug: 'uptimerobot',
    category: 'ai-crawler-bot',
    names: ['UptimeRobot'],
    priority: 65
  },
  {
    slug: 'pingdom',
    category: 'ai-crawler-bot',
    names: ['Pingdom'],
    priority: 65
  },
  {
    slug: 'datadog',
    category: 'ai-crawler-bot',
    names: ['Datadog', 'Datadog bot'],
    priority: 70
  },
  {
    slug: 'newrelic-synthetics',
    category: 'ai-crawler-bot',
    names: ['New Relic', 'NewRelic'],
    priority: 65
  },
  {
    slug: 'wappalyzer',
    category: 'ai-crawler-bot',
    names: ['Wappalyzer'],
    priority: 65
  },
  {
    slug: 'builtwith',
    category: 'ai-crawler-bot',
    names: ['BuiltWith'],
    priority: 65
  },
  {
    slug: 'securitytrails',
    category: 'ai-crawler-bot',
    names: ['SecurityTrails'],
    priority: 60
  },

  // Ad & marketing crawlers
  {
    slug: 'grapeshot',
    category: 'ai-crawler-bot',
    names: ['Grapeshot'],
    priority: 65
  },
  {
    slug: 'proximic',
    category: 'ai-crawler-bot',
    names: ['Proximic'],
    priority: 60
  },
  {
    slug: 'adbeat',
    category: 'ai-crawler-bot',
    names: ['Adbeat'],
    priority: 60
  },
  {
    slug: 'hubspot-crawler',
    category: 'ai-crawler-bot',
    names: ['HubSpot crawler', 'HubSpot bot'],
    priority: 65
  },

  // Content & feed crawlers
  {
    slug: 'feedlybot',
    category: 'ai-crawler-bot',
    names: ['FeedlyBot', 'Feedly bot'],
    priority: 65
  },
  {
    slug: 'petalbot',
    category: 'ai-crawler-bot',
    names: ['PetalBot', 'Huawei bot'],
    priority: 70
  },
  {
    slug: 'friendlycrawler',
    category: 'ai-crawler-bot',
    names: ['FriendlyCrawler'],
    priority: 60
  },
  {
    slug: 'imagesiftbot',
    category: 'ai-crawler-bot',
    names: ['ImagesiftBot'],
    priority: 60
  },
  {
    slug: 'isscyborg',
    category: 'ai-crawler-bot',
    names: ['ISSCyborg'],
    priority: 55
  },
  {
    slug: 'kangaroo-bot',
    category: 'ai-crawler-bot',
    names: ['Kangaroo Bot'],
    priority: 55
  },
  {
    slug: 'timpibot',
    category: 'ai-crawler-bot',
    names: ['Timpibot'],
    priority: 55
  },

  // AI research / training bots
  {
    slug: 'ai2bot',
    category: 'ai-crawler-bot',
    names: ['AI2Bot', 'AI2 bot', 'Allen AI bot'],
    priority: 70
  },
  {
    slug: 'ai2bot-dolma',
    category: 'ai-crawler-bot',
    names: ['AI2Bot-Dolma', 'Dolma crawler'],
    priority: 65
  },
  {
    slug: 'mlbot',
    category: 'ai-crawler-bot',
    names: ['MLBot'],
    priority: 60
  },
  {
    slug: 'pangubot',
    category: 'ai-crawler-bot',
    names: ['PanguBot', 'Pangu bot'],
    priority: 65
  },
  {
    slug: 'chatglm-spider',
    category: 'ai-crawler-bot',
    names: ['ChatGLM-Spider'],
    priority: 65
  },

  // Cloudflare
  {
    slug: 'cloudflare-always-online',
    category: 'ai-crawler-bot',
    names: ['Cloudflare-AlwaysOnline', 'Cloudflare bot'],
    priority: 65
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate that all entity target files exist
 */
function validateEntities() {
  const errors = [];
  for (const entity of ENTITIES) {
    const filePath = path.join(CONTENT_DIR, entity.category, `${entity.slug}.md`);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing: ${entity.category}/${entity.slug}.md`);
    }
  }
  return errors;
}

/**
 * Get all markdown files from content directory
 */
function getAllContentFiles() {
  const files = [];
  const categories = ['ai-chat-bot', 'ai-search-engine', 'ai-crawler-bot', 'blog'];

  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryPath)) continue;

    const categoryFiles = fs.readdirSync(categoryPath)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        path: path.join(categoryPath, f),
        category,
        slug: f.replace('.md', '')
      }));

    files.push(...categoryFiles);
  }

  return files;
}

/**
 * Extract protected zones from content that should not be modified
 */
function getProtectedZones(content) {
  const zones = [];

  // Frontmatter (between --- markers)
  const frontmatterMatch = content.match(/^---[\s\S]*?---/);
  if (frontmatterMatch) {
    zones.push({ start: 0, end: frontmatterMatch[0].length, type: 'frontmatter' });
  }

  // JSON-LD schema blocks
  const jsonLdRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/g;
  let match;
  while ((match = jsonLdRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'json-ld' });
  }

  // Code blocks (fenced)
  const codeBlockRegex = /```[\s\S]*?```/g;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'code-block' });
  }

  // Inline code
  const inlineCodeRegex = /`[^`]+`/g;
  while ((match = inlineCodeRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'inline-code' });
  }

  // FAQ details blocks
  const detailsRegex = /<details>[\s\S]*?<\/details>/g;
  while ((match = detailsRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'details' });
  }

  // Existing links [text](url)
  const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
  while ((match = linkRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'existing-link' });
  }

  // Image references ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\([^)]+\)/g;
  while ((match = imageRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'image' });
  }

  // URLs
  const urlRegex = /https?:\/\/[^\s\)>\]]+/g;
  while ((match = urlRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'url' });
  }

  // Headings (# through ######)
  const headingRegex = /^#{1,6}\s+.+$/gm;
  while ((match = headingRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'heading' });
  }

  // HTML anchor tags with id (section anchors)
  const anchorRegex = /<a\s+id="[^"]+"\s*><\/a>/g;
  while ((match = anchorRegex.exec(content)) !== null) {
    zones.push({ start: match.index, end: match.index + match[0].length, type: 'anchor' });
  }

  return zones.sort((a, b) => a.start - b.start);
}

/**
 * Check if a position is within a protected zone
 */
function isProtected(position, zones) {
  return zones.some(zone => position >= zone.start && position < zone.end);
}

/**
 * Get entities sorted by name length (longest first) and priority
 */
function getSortedEntities() {
  // Create flat list of all name variations with entity reference
  const nameVariations = [];
  for (const entity of ENTITIES) {
    for (const name of entity.names) {
      nameVariations.push({
        name,
        entity,
        length: name.length
      });
    }
  }

  // Sort by length (descending) then priority (descending)
  return nameVariations.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return b.entity.priority - a.entity.priority;
  });
}

/**
 * Find context-appropriate entity URL based on source file category
 * Returns { url, targetSlug } for self-link checking
 */
function getContextualUrl(entity, sourceCategory, sourceSlug) {
  // If entity is in same category as source, use it directly
  if (entity.category === sourceCategory) {
    return {
      url: `/${entity.category}/${entity.slug}/`,
      targetSlug: entity.slug
    };
  }

  // Look for same entity in source category (e.g., "Perplexity" chatbot vs search engine)
  // Only match if the entity has the SAME primary name (first name in array)
  const primaryName = entity.names[0].toLowerCase();
  const sameEntityInCategory = ENTITIES.find(e =>
    e.category === sourceCategory &&
    e.names[0].toLowerCase() === primaryName
  );

  if (sameEntityInCategory) {
    return {
      url: `/${sameEntityInCategory.category}/${sameEntityInCategory.slug}/`,
      targetSlug: sameEntityInCategory.slug
    };
  }

  // Default to the entity's own URL
  return {
    url: `/${entity.category}/${entity.slug}/`,
    targetSlug: entity.slug
  };
}

/**
 * Process a single file and find link opportunities
 */
function processFile(file, sortedNames, dryRun, verbose) {
  const content = fs.readFileSync(file.path, 'utf-8');
  const protectedZones = getProtectedZones(content);

  const linksToAdd = [];
  const linkedEntities = new Set(); // Track already linked entities (first mention only)

  // First pass: collect all link opportunities
  for (const variation of sortedNames) {
    const { name, entity } = variation;

    // Skip if we already linked this entity (first mention only)
    if (linkedEntities.has(entity.slug)) {
      continue;
    }

    // Build regex for this name (word boundary, case insensitive)
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // For multi-word names ending with common verbs, add negative lookahead
    // to avoid matching "ChatGPT search the" (verb) vs "ChatGPT Search" (product)
    const verbWords = ['search', 'chat', 'browse', 'find', 'write', 'code'];
    const lastWord = name.split(' ').pop()?.toLowerCase();
    let pattern = `\\b(${escapedName})\\b`;

    if (verbWords.includes(lastWord) && name.includes(' ')) {
      // Add negative lookahead for articles/prepositions that indicate verb usage
      pattern = `\\b(${escapedName})\\b(?!\\s+(?:the|a|an|for|to|and|or|in|on|at|with|from|by|your|my|our|their|this|that|these|those|it|is|was|were|are|can|will|would|could|should))`;
    }

    const regex = new RegExp(pattern, 'gi');

    let match;
    while ((match = regex.exec(content)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;
      const matchedText = match[1];

      // Check if position is protected
      if (isProtected(matchStart, protectedZones)) {
        continue;
      }

      // Check if we already linked this entity
      if (linkedEntities.has(entity.slug)) {
        break; // Stop looking for more matches
      }

      // Get context-appropriate URL
      const { url, targetSlug } = getContextualUrl(entity, file.category, file.slug);

      // Skip if this would be a self-link
      if (targetSlug === file.slug) {
        continue;
      }

      // Get surrounding context for reporting
      const contextStart = Math.max(0, matchStart - 30);
      const contextEnd = Math.min(content.length, matchEnd + 30);
      const context = content.slice(contextStart, contextEnd).replace(/\n/g, ' ');

      linksToAdd.push({
        anchor: matchedText,
        url,
        start: matchStart,
        end: matchEnd,
        position: matchStart,
        context: `...${context}...`,
        lineNumber: content.slice(0, matchStart).split('\n').length
      });

      // Mark entity as linked
      linkedEntities.add(entity.slug);

      break; // First mention only
    }
  }

  // Second pass: apply links in reverse order (highest position first)
  // This ensures earlier insertions don't affect later positions
  let modifiedContent = content;

  if (!dryRun && linksToAdd.length > 0) {
    // Sort by position descending (process from end to beginning)
    const sortedLinks = [...linksToAdd].sort((a, b) => b.start - a.start);

    for (const linkInfo of sortedLinks) {
      const link = `[${linkInfo.anchor}](${linkInfo.url})`;
      modifiedContent =
        modifiedContent.slice(0, linkInfo.start) +
        link +
        modifiedContent.slice(linkInfo.end);
    }
  }

  return {
    file: file.path,
    category: file.category,
    slug: file.slug,
    linksAdded: linksToAdd,
    modifiedContent
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  console.log('='.repeat(60));
  console.log('Internal Linking Script for aichatwatch.com');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'APPLY CHANGES'}`);
  console.log(`Verbose: ${verbose}`);
  console.log('');

  // Validate entities
  console.log('Validating entity mappings...');
  const validationErrors = validateEntities();
  if (validationErrors.length > 0) {
    console.error('Validation errors found:');
    validationErrors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`✓ All ${ENTITIES.length} entities validated`);

  // Get all content files
  const files = getAllContentFiles();
  console.log(`✓ Found ${files.length} content files`);

  // Get sorted name variations
  const sortedNames = getSortedEntities();
  console.log(`✓ Processing ${sortedNames.length} name variations`);
  console.log('');

  // Process files
  console.log('Processing files...');
  const results = [];
  let totalLinks = 0;

  for (const file of files) {
    const result = processFile(file, sortedNames, dryRun, verbose);
    results.push(result);
    totalLinks += result.linksAdded.length;

    if (result.linksAdded.length > 0) {
      if (verbose) {
        console.log(`\n${file.category}/${file.slug}.md: +${result.linksAdded.length} links`);
        for (const link of result.linksAdded) {
          console.log(`  Line ${link.lineNumber}: [${link.anchor}](${link.url})`);
          console.log(`    Context: ${link.context}`);
        }
      } else {
        process.stdout.write('.');
      }

      // Write changes if not dry run
      if (!dryRun) {
        fs.writeFileSync(file.path, result.modifiedContent, 'utf-8');
      }
    }
  }

  console.log('\n');

  // Generate report
  console.log('='.repeat(60));
  console.log('REPORT');
  console.log('='.repeat(60));

  const filesWithLinks = results.filter(r => r.linksAdded.length > 0);

  console.log(`Files analyzed: ${files.length}`);
  console.log(`Files with new links: ${filesWithLinks.length}`);
  console.log(`Total links ${dryRun ? 'to add' : 'added'}: ${totalLinks}`);
  console.log('');

  // Links by source category
  const bySourceCategory = {};
  for (const result of results) {
    if (result.linksAdded.length > 0) {
      bySourceCategory[result.category] = (bySourceCategory[result.category] || 0) + result.linksAdded.length;
    }
  }

  console.log('Links by source category:');
  for (const [cat, count] of Object.entries(bySourceCategory)) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log('');

  // Links by target category
  const byTargetCategory = {};
  for (const result of results) {
    for (const link of result.linksAdded) {
      const targetCat = link.url.split('/')[1];
      byTargetCategory[targetCat] = (byTargetCategory[targetCat] || 0) + 1;
    }
  }

  console.log('Links by target category:');
  for (const [cat, count] of Object.entries(byTargetCategory)) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log('');

  // Top linked entities
  const byEntity = {};
  for (const result of results) {
    for (const link of result.linksAdded) {
      const entity = link.url.split('/')[2];
      byEntity[entity] = (byEntity[entity] || 0) + 1;
    }
  }

  const topEntities = Object.entries(byEntity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  console.log('Top 15 linked entities:');
  for (const [entity, count] of topEntities) {
    console.log(`  ${entity}: ${count}`);
  }
  console.log('');

  if (dryRun) {
    console.log('='.repeat(60));
    console.log('This was a DRY RUN. No files were modified.');
    console.log('Run without --dry-run to apply changes.');
    console.log('='.repeat(60));
  } else {
    console.log('='.repeat(60));
    console.log(`SUCCESS! Added ${totalLinks} internal links to ${filesWithLinks.length} files.`);
    console.log('Run `npm run build` to verify the changes.');
    console.log('='.repeat(60));
  }
}

main().catch(console.error);
