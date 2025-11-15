---
layout: post
title: "How to Track Your Brand Mentions Across 20+ AI Chatbots"
description: "Step-by-step guide to monitoring your brand across ChatGPT, Claude, Gemini, and other AI models. Track mentions, analyze trends, and optimize your AI visibility."
date: 2024-11-10 09:00:00 -0800
author: "AI Chat Watch Team"
tags: ["tutorial", "brand-monitoring", "competitive-intelligence"]
image: "/assets/images/screenshots/aicw-report-screenshot-top-influencers.png"
reading_time: 10
related_posts: true
---

Want to know what ChatGPT says about your brand? How about Claude, Gemini, or Perplexity? This guide will show you exactly how to track your brand mentions across 20+ AI models.

## Why Track AI Brand Mentions?

Before we dive into the how, let's talk about the why:

### The Opportunity Cost is Massive

Consider this scenario:

- **Daily ChatGPT users**: 100M+
- **Queries mentioning your category**: Let's say 0.01% = 10,000
- **Conversion rate if mentioned**: Even 1% = 100 potential customers
- **Monthly missed opportunities if not mentioned**: ~3,000

That's 3,000 potential customers monthly who might never discover you because AI didn't mention your brand.

### You Can't Optimize What You Don't Measure

Without tracking AI mentions, you're blind to:

- Whether AI knows your product exists
- How you rank vs. competitors
- What misinformation AI might be spreading
- Which use cases AI associates with your brand
- Trending topics in your space

## What We'll Cover

In this tutorial, you'll learn:

1. Setting up AI Chat Watch
2. Creating effective monitoring questions
3. Selecting the right AI models
4. Running your first analysis
5. Interpreting the results
6. Optimizing based on insights

## Step 1: Install AI Chat Watch

### Quick Start (No Installation)

For a one-time analysis:

```bash
npx @aichatwatch/aicw
```

### Recommended: Global Installation

For ongoing monitoring:

```bash
npm install -g @aichatwatch/aicw
```

Verify installation:

```bash
aicw --version
```

### Get Your API Key

You'll need an API key from one of these providers:

**Option A: OpenRouter** (Recommended)
- Visit [openrouter.ai/keys](https://openrouter.ai/keys)
- Create a free account
- Generate an API key
- Add $5-10 credit (goes a long way)

**Option B: OpenAI**
- Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Create an API key
- Note: More expensive than OpenRouter for multi-model access

## Step 2: Create Your First Project

Launch AICW:

```bash
aicw
```

You'll see an interactive menu. Select **"Create new project"**.

### Name Your Project

Choose a descriptive name:
- ✅ "Acme CRM - Brand Monitoring"
- ✅ "Q4 2024 Competitive Analysis"
- ❌ "test"
- ❌ "project1"

### Configure API Settings

When prompted:
1. **Provider**: Select `OpenRouter` (or your preferred provider)
2. **API Key**: Paste your key
3. **Save**: Confirm the settings

## Step 3: Write Effective Questions

This is the most critical step. Your questions determine what insights you'll get.

### Question Framework

Use this framework for comprehensive brand monitoring:

#### 1. Direct Brand Queries

Ask AI directly about your brand:

```
- "What is [YourBrand]?"
- "Tell me about [YourProduct]"
- "What are the features of [YourTool]?"
```

**Why**: Establishes if AI knows you exist and has accurate information.

#### 2. Category Questions

Position yourself within your category:

```
- "What are the best [category] tools?"
- "Top [category] solutions for [use case]"
- "Compare [category] platforms"
```

**Example**:
- "What are the best project management tools for remote teams?"
- "Top CRMs for startups"

**Why**: See how you rank against competitors.

#### 3. Use Case Questions

Target specific problems:

```
- "How to [solve problem your product solves]?"
- "Best tools for [specific use case]?"
- "What should I use to [accomplish task]?"
```

**Example**:
- "How to manage customer support tickets efficiently?"
- "Best tools for team collaboration"

**Why**: Captures problem-aware users before they know specific solutions.

#### 4. Comparison Questions

Direct competitive intelligence:

```
- "Compare [YourBrand] vs [Competitor]"
- "[YourBrand] or [Competitor] - which is better?"
- "Differences between [YourBrand] and [Competitor]"
```

**Why**: Understand how AI positions you vs. competitors.

#### 5. Alternative Questions

See if you're suggested as an alternative:

```
- "Alternatives to [Competitor]"
- "Tools similar to [Competitor]"
- "[Competitor] competitors"
```

**Why**: Capture users already considering competitors.

### Question Templates by Industry

#### SaaS Products

```
1. "What are the top 10 [category] tools in 2024?"
2. "Best [category] software for [target audience]"
3. "Compare [YourTool] features and pricing"
4. "How does [YourTool] compare to competitors?"
5. "[YourTool] reviews and user opinions"
```

#### E-commerce

```
1. "Best places to buy [product type]"
2. "Top [product category] brands"
3. "[YourBrand] products and reviews"
4. "Where to buy [specific product]"
5. "Is [YourBrand] worth it?"
```

#### Services

```
1. "Best [service type] providers"
2. "How to choose a [service type]"
3. "[YourCompany] services and pricing"
4. "Reviews of [YourCompany]"
5. "[Service] in [location]"
```

### Pro Tips for Questions

✅ **Do**:
- Use natural language (how real users ask)
- Include your target audience (e.g., "for startups", "for enterprises")
- Ask variations of the same question
- Include misspellings of your brand (if common)

❌ **Don't**:
- Be too promotional ("Why is [YourBrand] the best?")
- Use internal jargon
- Make questions too long (>20 words)
- Ask yes/no questions

## Step 4: Select AI Models

AICW supports 20+ models. Here's how to choose:

### Tier 1: Must-Track (Core Models)

Always include these popular models:

- **ChatGPT 4** (gpt-4-turbo)
- **Claude 3 Opus** (claude-3-opus)
- **Gemini Pro** (gemini-pro)
- **Perplexity** (perplexity/sonar)

**Why**: Highest user bases, most influential

### Tier 2: Should-Track (Specialized)

Add for comprehensive coverage:

- **ChatGPT 3.5** (gpt-3.5-turbo) - Still widely used
- **Claude 3 Sonnet** (claude-3-sonnet) - Balance of cost/quality
- **Mixtral** (mixtral-8x7b) - Open source alternative
- **Command R+** (cohere/command-r-plus) - Good for citations

### Tier 3: Optional (Emerging)

Include if budget allows:

- **GPT-4 Vision** - If visual content matters
- **Llama 3** - Open source insights
- **Qwen** - International perspective

### Budget Optimization

**Tight Budget ($5-10)**:
- 3-4 core models
- 5 essential questions
- Monthly cadence

**Standard Budget ($20-50)**:
- 8-10 models
- 10-15 questions
- Bi-weekly cadence

**Comprehensive ($100+)**:
- 15-20 models
- 20+ questions
- Weekly cadence

## Step 5: Run Your Analysis

After configuring questions and models:

1. Select **"Run project"**
2. Choose which questions to run (or all)
3. Confirm model selection
4. **Wait** (this can take 2-10 minutes depending on scope)

### What's Happening Behind the Scenes

AICW is:

1. Sending your questions to each AI model
2. Collecting responses
3. Extracting entities (brands, products, links)
4. Analyzing mention frequency and order
5. Detecting trends
6. Generating comparison data
7. Creating interactive visualizations

### Cost Estimation

Rough costs per question across 10 models:

- **OpenRouter**: $0.05 - $0.15
- **OpenAI Direct**: $0.10 - $0.30

Example project:
- 10 questions × 10 models = 100 queries
- Estimated cost: $5-15 via OpenRouter

## Step 6: Analyze Your Results

AICW generates an interactive HTML report. Let's break down what to look for:

### 1. Mention Frequency

**What it shows**: How many models mentioned you out of total queries

**Good**: 60%+ mention rate
**Concerning**: <20% mention rate

**Example**:
```
Your Brand: 7/10 models (70%) ✅
Competitor A: 9/10 models (90%)
Competitor B: 3/10 models (30%)
```

**Action**: If low, focus on building authority and structured data.

### 2. Mention Position

**What it shows**: Where you appear in AI responses (1st, 2nd, 3rd, etc.)

**Metrics**:
- **Average position**: Lower is better
- **First mention %**: How often you're listed first
- **Top 3 %**: How often you're in top 3

**Example**:
```
Your Brand:
- Avg position: 3.2
- First mention: 14%
- Top 3: 71%
```

**Action**: Optimize for first-mention with better content and citations.

### 3. Share of Voice

**What it shows**: Your % of total mentions vs. competitors

**Formula**: (Your mentions / Total mentions) × 100

**Example**:
```
Market Share of Voice:
- Competitor A: 35%
- Your Brand: 25%
- Competitor B: 22%
- Competitor C: 18%
```

**Action**: Benchmark progress over time. Aim to grow share monthly.

### 4. Citation Sources

**What it shows**: Which websites AI models reference when discussing you

**Look for**:
- Your official site (good!)
- Review sites (G2, Capterra)
- News articles
- Competitor sites (concerning)
- Outdated sources (fixable)

**Action**: Get more high-quality backlinks and press mentions.

### 5. Trend Analysis

**What it shows**: Whether mentions are increasing/decreasing over time

**Requires**: Multiple runs over weeks/months

**Example**:
```
Mention trend (past 90 days):
- Month 1: 45% ➡️
- Month 2: 52% ⬆️
- Month 3: 58% ⬆️
```

**Action**: Track impact of optimization efforts.

### 6. Key Insights

AICW highlights:

- **Strengths**: What AI mentions positively
- **Weaknesses**: Gaps or negative associations
- **Opportunities**: Underutilized keywords
- **Threats**: Competitor advantages

## Step 7: Take Action

Based on your analysis, prioritize these actions:

### If Mention Rate is Low (<30%)

**Priority**: Build foundational visibility

Actions:
1. Add Schema.org structured data to website
2. Create/update Wikipedia page
3. Get listed on major review sites
4. Publish comprehensive documentation
5. Earn backlinks from authoritative sites

### If Mentioned but Ranked Low

**Priority**: Improve positioning and authority

Actions:
1. Publish comparison content (vs. competitors)
2. Create detailed use-case guides
3. Get more positive reviews
4. Update outdated information across the web
5. Build topical authority through content

### If Misinformation Exists

**Priority**: Correct inaccurate data

Actions:
1. Update your official sources
2. Contact sites with wrong info
3. Publish clarifying content
4. Add detailed FAQs
5. Consider Wikipedia edits

### If Missing for Specific Use Cases

**Priority**: Create targeted content

Actions:
1. Write guides for those use cases
2. Create comparison pages
3. Add use-case-specific landing pages
4. Publish case studies
5. Update product descriptions

## Step 8: Monitor and Iterate

Brand monitoring is ongoing. Here's your cadence:

### Weekly (High-Priority Projects)

- Quick check: Run 3-5 key questions
- Monitor: New mentions or drops
- Act: Respond to trending topics

### Bi-Weekly (Standard Monitoring)

- Full analysis: Run all questions
- Track: Mention trends
- Optimize: Based on insights

### Monthly (Comprehensive Review)

- Deep dive: Run expanded question set
- Benchmark: Compare to previous months
- Report: Share with stakeholders
- Plan: Next month's optimization priorities

## Advanced Techniques

### 1. Competitive Benchmarking

Create separate projects for each competitor to:

- Track their mention frequency
- Identify their strengths
- Find gaps you can exploit
- Monitor their trend changes

### 2. Industry Trend Tracking

Create a project for industry trends:

```
- "What are the emerging trends in [industry]?"
- "Future of [category]"
- "Innovations in [space]"
```

### 3. Sentiment Analysis

Ask AI for opinions:

```
- "Pros and cons of [YourBrand]"
- "User opinions about [YourProduct]"
- "Reviews of [YourService]"
```

### 4. Geographic Variations

Test regional differences:

```
- "Best [category] tools in [country/region]"
- "[Category] for [region] market"
```

## Troubleshooting Common Issues

### "AI has never heard of my brand"

**Likely causes**:
- New brand (<1 year)
- Limited web presence
- No structured data
- Training data cutoff

**Solutions**:
- Build authoritative backlinks
- Get press coverage
- Create Wikipedia page
- Publish more content
- Add structured data

### "AI mentions competitors but not me"

**Likely causes**:
- Lower domain authority
- Less review presence
- Weaker content
- Fewer backlinks

**Solutions**:
- Focus on review sites
- Create comparison content
- Build topic authority
- Improve SEO

### "Inconsistent results across models"

**Likely causes**:
- Different training data
- Model-specific biases
- Varying knowledge cutoffs

**Solutions**:
- Track trends not snapshots
- Average across multiple models
- Run analysis regularly

### "Results haven't improved after optimizations"

**Likely causes**:
- Too early (give it 2-3 months)
- Changes not indexed yet
- Optimizations not aligned with AI needs

**Solutions**:
- Be patient
- Verify changes are live
- Check what competitors are doing
- Analyze citation sources

## Real-World Success Story

### Case Study: SaaS Startup

**Before**:
- Mention rate: 23%
- Average position: #6
- Share of voice: 8%

**Actions Taken** (over 3 months):
1. Added Schema.org markup
2. Published 15 comparison guides
3. Got featured on 5 review sites
4. Created comprehensive docs
5. Earned 20+ high-quality backlinks

**After**:
- Mention rate: 68% ⬆️ 45%
- Average position: #2.3 ⬆️ 3.7
- Share of voice: 28% ⬆️ 20%

**Business Impact**:
- 40% increase in organic signups
- 15% mentioned "AI recommendation" in onboarding

## Next Steps

Ready to start tracking your brand across AI chatbots?

1. **Install AICW**: `npm install -g @aichatwatch/aicw`
2. **Set up your first project**: Create 5 key questions
3. **Run initial analysis**: Get your baseline metrics
4. **Create optimization plan**: Focus on top 3 priorities
5. **Schedule regular monitoring**: Set calendar reminders

---

**Questions?** Share your experience in the comments or join our [GitHub Discussions](https://github.com/aichatwatch/aicw/discussions).

**Found this helpful?** Star us on [GitHub](https://github.com/aichatwatch/aicw) and share with your network!
