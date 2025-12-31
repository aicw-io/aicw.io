/**
 * Source Domain Page Vue.js Application
 * Renders detailed information for a single source domain
 */

// Favicon URL template for AI model icons
const FAVICON_32_TEMPLATE = 'https://www.google.com/s2/favicons?domain={{DOMAIN}}&sz=32';

// Initialize Vue app for source domain pages
window.sourceApp = new Vue({
    el: '#app',
    data: {
        domain: window.DomainData || {},
        bots: window.BotsData || [],
        meta: window.ReportMeta || {},
        expandedExcerpts: {},  // Track which excerpts are expanded to show full answer
        fullAnswers: null,  // Will be populated when answers file loads
        showAllQuestions: false  // Toggle for questions list expand/collapse
    },
    computed: {
        /**
         * Count of AI models that cited this domain
         */
        botCount() {
            if (this.domain.bots) {
                return this.domain.bots.split(',').filter(b => b.trim()).length;
            }
            if (this.domain.mentionsByModel) {
                return Object.keys(this.domain.mentionsByModel).filter(
                    k => this.domain.mentionsByModel[k] > 0
                ).length;
            }
            return 0;
        },

        /**
         * Get bots that have data for this domain
         */
        botsWithData() {
            if (!this.bots || !this.bots.length) return [];

            const domainBots = this.domain.bots
                ? this.domain.bots.split(',').map(b => b.trim())
                : [];

            return this.bots.filter(bot => {
                // Check if bot cited this domain
                if (domainBots.includes(bot.id)) return true;
                if (this.domain.mentionsByModel && this.domain.mentionsByModel[bot.id] > 0) return true;
                return false;
            }).sort((a, b) => {
                // Sort by influence (voice) descending
                const influenceA = this.domain.influenceByModel?.[a.id] || 0;
                const influenceB = this.domain.influenceByModel?.[b.id] || 0;
                return influenceB - influenceA;
            });
        },

        /**
         * Check if domain has any excerpts
         */
        hasExcerpts() {
            if (!this.domain.excerptsByModel) return false;
            return Object.keys(this.domain.excerptsByModel).some(
                key => this.domain.excerptsByModel[key] && this.domain.excerptsByModel[key].length > 0
            );
        },

        /**
         * Get favicon URL for the domain
         */
        faviconUrl() {
            if (!this.domain.value) return '';
            return `https://www.google.com/s2/favicons?domain=${this.domain.value}&sz=128`;
        },

        /**
         * Get unique questions from all excerpts
         */
        uniqueQuestions() {
            const questions = new Map();
            const excerptsByModel = this.domain?.excerptsByModel || {};
            for (const [modelId, excerpts] of Object.entries(excerptsByModel)) {
                for (const excerpt of (excerpts || [])) {
                    if (excerpt.promptId && !questions.has(excerpt.promptId)) {
                        questions.set(excerpt.promptId, {
                            promptId: excerpt.promptId,
                            question: excerpt.question || this.getQuestionText(excerpt)
                        });
                    }
                }
            }
            return Array.from(questions.values());
        },

        /**
         * Count of unique questions
         */
        questionCount() {
            return this.uniqueQuestions.length;
        },

        /**
         * Questions to display (first 3 or all if expanded)
         */
        displayedQuestions() {
            if (this.showAllQuestions) return this.uniqueQuestions;
            return this.uniqueQuestions.slice(0, 3);
        },

        /**
         * Check if there are more than 3 questions
         */
        hasMoreQuestions() {
            return this.uniqueQuestions.length > 3;
        }
    },
    methods: {
        /**
         * Format percentage value
         */
        formatPercent(value) {
            if (value === undefined || value === null) return 'N/A';
            const percent = (value * 100).toFixed(1);
            return `${percent}%`;
        },

        /**
         * Format appearance order
         */
        formatOrder(value) {
            if (value === undefined || value === null) return 'N/A';
            return value.toFixed(1);
        },

        /**
         * Format position value - removes trailing zeros and # prefix
         * e.g., 6.0 -> "6", 2.5 -> "2.5"
         */
        formatPosition(value) {
            if (value === undefined || value === null || value <= 0) return 'N/A';
            // Remove trailing zeros: 6.0 -> 6, 2.5 -> 2.5
            const formatted = parseFloat(value.toFixed(1));
            return String(formatted);
        },

        /**
         * Format link path - show path portion after domain
         */
        formatLinkPath(link) {
            if (!link) return '';
            // If the link doesn't include the domain, show it as-is
            if (!link.includes('/')) return link;
            // Extract path after domain
            const domainEnd = link.indexOf('/');
            if (domainEnd === -1) return link;
            const path = link.substring(domainEnd);
            return path || '/';
        },

        /**
         * Extract domain from a brand link URL for favicon
         */
        getBrandDomain(link) {
            if (!link) return '';
            try {
                const url = link.includes('://') ? link : `https://${link}`;
                return new URL(url).hostname.replace('www.', '');
            } catch {
                return link.replace(/^www\./, '').split('/')[0];
            }
        },

        /**
         * Get model name from ID
         */
        getModelName(modelId) {
            const bot = this.bots.find(b => b.id === modelId);
            return bot ? bot.name : modelId;
        },

        /**
         * Get favicon URL for an AI model
         */
        getModelIconUrl(botId) {
            const bot = this.bots.find(b => b.id === botId);
            const url = bot && bot.url && bot.url.length > 0 ? bot.url : '';
            if (url.length > 0) {
                const domain = url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
                return FAVICON_32_TEMPLATE.replace('{{DOMAIN}}', domain);
            }
            return '';
        },

        /**
         * Get mentions count for a specific bot
         */
        getMentionsForBot(botId) {
            if (this.domain.mentionsByModel && this.domain.mentionsByModel[botId] !== undefined) {
                return this.domain.mentionsByModel[botId];
            }
            return 0;
        },

        /**
         * Get influence percentage for a specific bot
         */
        getInfluenceForBot(botId) {
            if (this.domain.influenceByModel && this.domain.influenceByModel[botId] !== undefined) {
                return this.formatPercent(this.domain.influenceByModel[botId]);
            }
            return 'N/A';
        },

        /**
         * Get position for a specific bot
         */
        getPositionForBot(botId) {
            if (this.domain.appearanceOrderByModel && this.domain.appearanceOrderByModel[botId] !== undefined) {
                return this.formatPosition(this.domain.appearanceOrderByModel[botId]);
            }
            return 'N/A';
        },

        /**
         * Highlight links in text
         * Highlights full link paths (e.g., "bigsur.ai/blog/analytics") not just domain names
         * Handles both string excerpts and excerpt objects with .excerpt property
         * Also adds truncation indicators [...] at start/end if text was truncated
         */
        highlightDomain(excerptData) {
            // Handle excerpt objects (with .excerpt property) or plain strings
            let text = '';
            let appearanceOrder = 0;
            if (typeof excerptData === 'string') {
                text = excerptData;
            } else if (excerptData && typeof excerptData === 'object') {
                text = excerptData.excerpt || excerptData.text || '';
                appearanceOrder = excerptData.appearanceOrder || 0;
            }

            if (!text) return text || '';

            // Add truncation indicators
            const CONTEXT_CHARS = 300;
            // Start truncation: if match position > 300, text was cut at start
            if (appearanceOrder > CONTEXT_CHARS) {
                text = '[...] ' + text;
            }
            // End truncation: excerpts virtually always end mid-text
            text = text + ' [...]';

            // Collect all links to highlight: full URLs from sources[] + domain name
            const linksToHighlight = [];

            // Add all full links from domain.sources (if available)
            if (this.domain.sources && Array.isArray(this.domain.sources)) {
                this.domain.sources.forEach(source => {
                    if (source.link) {
                        linksToHighlight.push(source.link);
                    }
                });
            }

            // Add the domain name as fallback
            if (this.domain.value) {
                linksToHighlight.push(this.domain.value);
            }

            // Sort by length (longest first) to avoid partial highlights
            linksToHighlight.sort((a, b) => b.length - a.length);

            // Apply highlights (longest links first)
            for (const link of linksToHighlight) {
                const regex = new RegExp(`(${this.escapeRegex(link)})`, 'gi');
                text = text.replace(regex, '<mark class="domain-highlight">$1</mark>');
            }

            return text;
        },

        /**
         * Escape special regex characters
         */
        escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        /**
         * Format date to human-readable long format
         * e.g., "November 12, 2025"
         */
        formatDateLong(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        },

        /**
         * Toggle excerpt expansion to show full answer
         * Implements accordion behavior - only one excerpt expanded at a time
         */
        toggleExcerpt(modelId, index) {
            const key = `${modelId}-${index}`;
            const isCurrentlyExpanded = this.expandedExcerpts[key];

            // Collapse all other excerpts (accordion behavior)
            this.expandedExcerpts = {};

            // Toggle the clicked excerpt (if it was expanded, it stays collapsed)
            if (!isCurrentlyExpanded) {
                this.$set(this.expandedExcerpts, key, true);
            }
        },

        /**
         * Check if excerpt is expanded
         */
        isExpanded(modelId, index) {
            return this.expandedExcerpts[`${modelId}-${index}`] || false;
        },

        /**
         * Get full answer for an excerpt
         */
        getFullAnswer(excerpt, modelId) {
            if (!this.fullAnswers || !excerpt.promptId) return null;
            const date = this.meta.reportDate;
            return this.fullAnswers?.[excerpt.promptId]?.[date]?.[modelId] || null;
        },

        /**
         * Check if full answer is available for excerpt
         */
        hasFullAnswer(excerpt, modelId) {
            return this.getFullAnswer(excerpt, modelId) !== null;
        },

        /**
         * Extract question text from promptId
         * e.g., "1-what-are-the-top-ai-chat-9690be43" -> "What Are The Top Ai Chat..."
         */
        getQuestionFromPromptId(promptId) {
            if (!promptId) return null;
            const parts = promptId.split('-');
            if (parts.length < 3) return null;
            // Remove number prefix and hash suffix
            const slugParts = parts.slice(1, -1);
            return slugParts.join(' ').replace(/\b\w/g, c => c.toUpperCase()) + '...';
        },

        /**
         * Get full question text from excerpt
         * Uses excerpt.question if available, otherwise falls back to parsing promptId
         */
        getQuestionText(excerpt) {
            // Use full question text if available from aggregation
            if (excerpt && excerpt.question) return excerpt.question;
            // Fallback to parsing promptId
            if (!excerpt || !excerpt.promptId) return null;
            const parts = excerpt.promptId.split('-');
            if (parts.length < 3) return null;
            const slugParts = parts.slice(1, -1);
            return slugParts.join(' ').replace(/\b\w/g, c => c.toUpperCase());
        },

        /**
         * Get trend indicator for a metric
         * Returns icon class and color based on trend value
         */
        getTrendIndicator(trendValue) {
            if (trendValue === undefined || trendValue === null) return null;
            if (trendValue === 999) return { icon: 'fa-star', class: 'text-yellow-400', label: 'New' };
            if (trendValue === 10) return { icon: 'fa-arrow-up', class: 'text-green-400', label: 'Rising' };
            if (trendValue === -1) return { icon: 'fa-arrow-down', class: 'text-red-400', label: 'Falling' };
            if (trendValue === 1) return { icon: 'fa-minus', class: 'text-gray-400', label: 'Stable' };
            return null;
        },

        /**
         * Group excerpts by promptId for organized display
         */
        groupExcerptsByPrompt(excerpts) {
            if (!excerpts || !Array.isArray(excerpts)) return {};
            return excerpts.reduce((groups, excerpt) => {
                const key = excerpt.promptId || 'unknown';
                if (!groups[key]) groups[key] = [];
                groups[key].push(excerpt);
                return groups;
            }, {});
        }
    },
    mounted() {
        console.log('Source domain page loaded for:', this.domain.value);
        // Check if answers were loaded before Vue mounted
        if (window.fullAnswers && !this.fullAnswers) {
            this.fullAnswers = window.fullAnswers;
        }
    }
});
