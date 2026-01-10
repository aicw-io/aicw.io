/**
 * Entity Page Vue.js Application
 * Renders detailed information for a single brand/entity
 */

// Favicon URL template for AI model icons
const FAVICON_32_TEMPLATE = 'https://www.google.com/s2/favicons?domain={{DOMAIN}}&sz=32';

// Initialize Vue app for entity pages
window.entityApp = new Vue({
    el: '#app',
    data: {
        entity: window.EntityData || {},
        bots: window.BotsData || [],
        meta: window.ReportMeta || {},
        expandedExcerpts: {},  // Track which excerpts are expanded to show full answer
        fullAnswers: null,  // Will be populated when answers file loads
        showAllQuestions: false,  // Toggle for questions list expand/collapse
        activeExcerptTab: null  // Currently selected tab for excerpts
    },
    computed: {
        /**
         * Count of AI models that mentioned this entity
         */
        botCount() {
            if (this.entity.bots) {
                return this.entity.bots.split(',').filter(b => b.trim()).length;
            }
            if (this.entity.mentionsByModel) {
                return Object.keys(this.entity.mentionsByModel).filter(
                    k => this.entity.mentionsByModel[k] > 0
                ).length;
            }
            return 0;
        },

        /**
         * Get bots that have data for this entity
         */
        botsWithData() {
            if (!this.bots || !this.bots.length) return [];

            const entityBots = this.entity.bots
                ? this.entity.bots.split(',').map(b => b.trim())
                : [];

            return this.bots.filter(bot => {
                // Check if bot mentioned this entity
                if (entityBots.includes(bot.id)) return true;
                if (this.entity.mentionsByModel && this.entity.mentionsByModel[bot.id] > 0) return true;
                return false;
            }).sort((a, b) => {
                // Sort by influence (voice) descending
                const influenceA = this.entity.influenceByModel?.[a.id] || 0;
                const influenceB = this.entity.influenceByModel?.[b.id] || 0;
                return influenceB - influenceA;
            });
        },

        /**
         * Check if entity has any excerpts
         */
        hasExcerpts() {
            if (!this.entity.excerptsByModel) return false;
            return Object.keys(this.entity.excerptsByModel).some(
                key => this.entity.excerptsByModel[key] && this.entity.excerptsByModel[key].length > 0
            );
        },

        /**
         * Extract domain from entity link URL
         */
        brandDomain() {
            if (!this.entity.link) return null;
            try {
                // Add https:// if no protocol is present
                const url = this.entity.link.includes('://')
                    ? this.entity.link
                    : `https://${this.entity.link}`;
                return new URL(url).hostname.replace('www.', '');
            } catch {
                // If URL parsing still fails, strip protocol and www prefix
                return this.entity.link
                    .replace(/^https?:\/\//, '')
                    .replace(/^www\./, '');
            }
        },

        /**
         * Get favicon URL for the brand
         */
        faviconUrl() {
            if (!this.brandDomain) return '';
            return `https://www.google.com/s2/favicons?domain=${this.brandDomain}&sz=128`;
        },

        /**
         * Get unique questions from all excerpts
         */
        uniqueQuestions() {
            const questions = new Map();
            const excerptsByModel = this.entity?.excerptsByModel || {};
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
        },

        /**
         * Get models for excerpt tabs
         */
        excerptTabs() {
            if (!this.entity.excerptsByModel) return [];
            return this.botsWithData.map(bot => ({
                id: bot.id,
                name: bot.name,
                count: (this.entity.excerptsByModel[bot.id] || []).length
            }));
        },

        /**
         * Get excerpts for the active tab
         */
        activeTabExcerpts() {
            if (!this.activeExcerptTab || !this.entity.excerptsByModel) return [];
            return this.entity.excerptsByModel[this.activeExcerptTab] || [];
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
            if (this.entity.mentionsByModel && this.entity.mentionsByModel[botId] !== undefined) {
                return this.entity.mentionsByModel[botId];
            }
            return 0;
        },

        /**
         * Get influence percentage for a specific bot
         */
        getInfluenceForBot(botId) {
            if (this.entity.influenceByModel && this.entity.influenceByModel[botId] !== undefined) {
                return this.formatPercent(this.entity.influenceByModel[botId]);
            }
            return 'N/A';
        },

        /**
         * Get position for a specific bot
         */
        getPositionForBot(botId) {
            if (this.entity.appearanceOrderByModel && this.entity.appearanceOrderByModel[botId] !== undefined) {
                return this.formatPosition(this.entity.appearanceOrderByModel[botId]);
            }
            return 'N/A';
        },

        /**
         * Highlight entity name in text
         * Handles both string excerpts and excerpt objects with .excerpt property
         */
        highlightEntity(excerptData) {
            // Handle excerpt objects (with .excerpt property) or plain strings
            let text = '';
            if (typeof excerptData === 'string') {
                text = excerptData;
            } else if (excerptData && typeof excerptData === 'object') {
                text = excerptData.excerpt || excerptData.text || '';
            }

            if (!text || !this.entity.value) return text || '';

            const entityName = this.entity.value;
            // Create a case-insensitive regex to find the entity name
            const regex = new RegExp(`(${this.escapeRegex(entityName)})`, 'gi');

            return text.replace(regex, '<mark class="brand-highlight">$1</mark>');
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
         * Format bot IDs as human-readable names
         */
        formatBotNames(botIds) {
            if (!botIds) return '';
            return botIds.split(',').map(id => {
                const bot = this.bots.find(b => b.id === id.trim());
                return bot ? bot.name : id;
            }).join(', ');
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
        },

        /**
         * Get the website page URL for a source URL
         * Extracts domain and creates slug for internal website page link
         */
        getWebsitePageUrl(sourceUrl) {
            if (!sourceUrl) return '#';
            // Extract domain (everything before the first /)
            const domain = sourceUrl.split('/')[0];
            // Slugify: replace non-alphanumeric with dashes, lowercase
            const slug = domain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            return `../website/${slug}.html`;
        },

        /**
         * Get array of bot IDs from comma-separated string
         */
        getBotIds(botsString) {
            if (!botsString) return [];
            return botsString.split(',').map(b => b.trim()).filter(b => b);
        },

        /**
         * Select an excerpt tab
         */
        selectExcerptTab(tabId) {
            this.activeExcerptTab = tabId;

            // Update DOM to show/hide tab content (for static HTML)
            const allTabs = document.querySelectorAll('.excerpt-tab-content');
            const allButtons = document.querySelectorAll('.excerpt-tab');

            // Hide all tab contents
            allTabs.forEach(tab => {
                tab.style.display = 'none';
            });

            // Show selected tab content
            const selectedTab = document.querySelector(`.excerpt-tab-content[data-tab-content="${tabId}"]`);
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }

            // Update button active states
            allButtons.forEach(btn => {
                const btnTabId = btn.getAttribute('data-tab-id');
                if (btnTabId === tabId) {
                    // Remove inactive classes (including background)
                    btn.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'text-gray-400', 'dark:text-gray-600', 'text-gray-500', 'hover:text-gray-700', 'dark:hover:text-gray-300');
                    // Add active classes (including background)
                    btn.classList.add('bg-indigo-100', 'dark:bg-indigo-900/30', 'text-indigo-700', 'dark:text-indigo-300', 'border-b-2', 'border-indigo-500');
                } else {
                    // Remove active classes (including background)
                    btn.classList.remove('bg-indigo-100', 'dark:bg-indigo-900/30', 'text-indigo-700', 'dark:text-indigo-300', 'border-b-2', 'border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400', 'border-indigo-600', 'dark:border-indigo-400');
                    // Add inactive classes (including background hover)
                    btn.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
                }
            });
        }
    },
    mounted() {
        console.log('Entity page loaded for:', this.entity.value);
        // Check if answers were loaded before Vue mounted
        if (window.fullAnswers && !this.fullAnswers) {
            this.fullAnswers = window.fullAnswers;
        }
        // Auto-select first tab with excerpts
        if (this.excerptTabs.length > 0) {
            const firstWithContent = this.excerptTabs.find(t => t.count > 0);
            this.activeExcerptTab = firstWithContent ? firstWithContent.id : this.excerptTabs[0].id;
        }
    }
});
