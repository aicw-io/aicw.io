# AI Chat Watch - Jekyll Website Documentation

This document provides comprehensive documentation for the Jekyll-powered aichatwatch.com website, including setup instructions, architecture overview, and the 7 iterations of improvements implemented.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Directory Structure](#directory-structure)
4. [SEO Optimizations (Iteration 1)](#iteration-1-seo-optimization)
5. [Accessibility Improvements (Iteration 2)](#iteration-2-accessibility-improvements)
6. [Performance Optimization (Iteration 3)](#iteration-3-performance-optimization)
7. [Mobile Responsiveness (Iteration 4)](#iteration-4-mobile-responsiveness)
8. [Structured Data & Schema (Iteration 5)](#iteration-5-structured-data--schema-markup)
9. [Social Sharing Optimization (Iteration 6)](#iteration-6-social-sharing-optimization)
10. [Extensibility & Documentation (Iteration 7)](#iteration-7-extensibility--documentation)
11. [Adding Blog Posts](#adding-blog-posts)
12. [Customization Guide](#customization-guide)
13. [Deployment](#deployment)

---

## Quick Start

### Prerequisites

- Ruby 2.7+ ([Install Ruby](https://www.ruby-lang.org/en/documentation/installation/))
- Bundler (`gem install bundler`)
- Node.js 18+ (for any future npm dependencies)

### Installation

```bash
# Navigate to the website directory
cd aichatwatch.com

# Install Jekyll and dependencies
bundle install

# Run local development server
bundle exec jekyll serve

# Visit http://localhost:4000
```

### Build for Production

```bash
bundle exec jekyll build

# Output will be in _site/ directory
```

---

## Architecture Overview

The website is built with Jekyll 4.3+ and follows modern static site best practices.

### Key Features

- ✅ **SEO-Optimized**: jekyll-seo-tag, custom structured data, optimized meta tags
- ✅ **Blog-Ready**: Full blogging functionality with pagination and tags
- ✅ **Extensible**: Modular layouts, includes, and templates
- ✅ **Accessible**: WCAG 2.1 AA compliant with semantic HTML
- ✅ **Fast**: Optimized images, lazy loading, minimal JavaScript
- ✅ **Mobile-First**: Responsive design tested across devices
- ✅ **Privacy-Focused**: No cookies, GDPR-compliant analytics

---

## Directory Structure

```
aichatwatch.com/
├── _config.yml              # Jekyll configuration
├── Gemfile                  # Ruby dependencies
├── _includes/               # Reusable components
│   ├── head.html           # <head> section with SEO
│   ├── header.html         # Site header with navigation
│   ├── footer.html         # Site footer
│   └── seo-structured-data.html  # Schema.org markup
├── _layouts/               # Page templates
│   ├── default.html        # Base layout
│   ├── page.html           # Standard pages
│   ├── post.html           # Blog posts
│   └── blog.html           # Blog index
├── _pages/                 # Static pages
│   ├── how-it-works.md
│   ├── privacy.md
│   └── terms.md
├── _posts/                 # Blog posts (YYYY-MM-DD-slug.md)
│   ├── 2024-11-15-introducing-ai-chat-watch.md
│   ├── 2024-11-14-what-is-ai-visibility-and-why-it-matters.md
│   └── 2024-11-10-how-to-track-your-brand-across-ai-chatbots.md
├── assets/                 # Static assets
│   ├── images/
│   └── js/
├── blog/                   # Blog index
│   └── index.html
├── demo/                   # Demo reports (preserved)
│   └── reports/
├── index.html              # Homepage
├── styles.css              # Main stylesheet
└── _site/                  # Generated site (ignored by Git)
```

---

## Iteration 1: SEO Optimization

### Implemented Features

#### 1. **jekyll-seo-tag Plugin**

Automatically generates:
- Title tags optimized for each page
- Meta descriptions
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data

**Configuration** (`_config.yml`):
```yaml
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed

title: "AI Chat Watch"
tagline: "Grade Your AI Visibility & Monitor What AI Says About Your Brand"
description: "Free open-source tool..."
url: "https://aichatwatch.com"
```

**Usage** (`_includes/head.html`):
```liquid
{% seo %}
```

#### 2. **Sitemap Generation**

Automatic XML sitemap generation for search engines.

**URL**: `https://aichatwatch.com/sitemap.xml`

**Features**:
- Automatically includes all pages and posts
- Respects front matter `sitemap: false` to exclude pages
- Updates automatically when content changes

#### 3. **RSS Feed**

Full-featured RSS/Atom feed for blog posts.

**URL**: `https://aichatwatch.com/feed.xml`

**Features**:
- Complete post content
- Proper categorization
- Author attribution

#### 4. **Optimized Permalinks**

Clean, SEO-friendly URLs for blog posts:

```yaml
permalink: /blog/:title/
```

**Examples**:
- ✅ `/blog/introducing-ai-chat-watch/`
- ❌ `/2024/11/15/introducing-ai-chat-watch.html`

#### 5. **Meta Tag Optimization**

Every page includes:
- **Title**: Unique, descriptive, under 60 characters
- **Description**: Compelling, under 160 characters
- **Keywords**: Relevant, not stuffed
- **Canonical**: Prevents duplicate content issues

---

## Iteration 2: Accessibility Improvements

### WCAG 2.1 AA Compliance

#### 1. **Semantic HTML**

All layouts use proper semantic elements:

```html
<header>       <!-- Site header -->
<nav>          <!-- Navigation -->
<main>         <!-- Main content -->
<article>      <!-- Blog posts -->
<aside>        <!-- Sidebars -->
<footer>       <!-- Site footer -->
```

#### 2. **ARIA Labels**

Interactive elements have proper labels:

```html
<button aria-label="Copy AI visibility command">...</button>
<nav role="navigation">...</nav>
<main role="main">...</main>
```

#### 3. **Keyboard Navigation**

All interactive elements are keyboard-accessible:
- Tab navigation works throughout
- Focus states are visible
- Skip links for screen readers

#### 4. **Color Contrast**

All text meets WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus indicators

#### 5. **Alt Text for Images**

All images include descriptive alt text:

```html
<img src="..." alt="AI Visibility Report showing technical analysis" />
```

#### 6. **Form Labels**

(For future forms) All inputs have associated labels:

```html
<label for="email">Email Address</label>
<input type="email" id="email" name="email">
```

---

## Iteration 3: Performance Optimization

### Page Load Optimization

#### 1. **Image Optimization**

**Lazy Loading**:
```html
<img src="..." loading="lazy" />
```

**Best Practices**:
- Use WebP where supported
- Serve responsive images with `srcset`
- Optimize PNG/JPG before upload
- Target < 200KB per image

#### 2. **CSS Optimization**

- **Inline Critical CSS**: Above-the-fold styles inlined
- **Async Non-Critical CSS**: Load after page render
- **Minimal External Dependencies**: Only Google Fonts

#### 3. **JavaScript Optimization**

- **Deferred Loading**: Non-critical JS loads after DOM
- **Minimal Dependencies**: Only essential scripts
- **No jQuery**: Vanilla JS for better performance

**Example**:
```html
<script src="/llm-network.js" defer></script>
<script async defer src="https://buttons.github.io/buttons.js"></script>
```

#### 4. **Font Loading**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### 5. **Asset Minification**

During build:
```bash
# CSS minification
bundle exec jekyll build --config _config.yml,_config_production.yml
```

### Performance Targets

- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1

---

## Iteration 4: Mobile Responsiveness

### Mobile-First Design

#### 1. **Responsive Breakpoints**

```css
/* Mobile first (default styles) */
@media (max-width: 480px) {
  /* Extra small devices */
}

@media (max-width: 768px) {
  /* Tablets and small laptops */
}

@media (min-width: 1024px) {
  /* Desktops */
}
```

#### 2. **Flexible Grid System**

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}
```

#### 3. **Mobile Navigation**

- Hamburger menu on mobile
- Touch-friendly tap targets (min 44x44px)
- Smooth transitions

#### 4. **Responsive Typography**

```css
h1 {
  font-size: clamp(2rem, 6vw, 5rem);
}
```

Automatically scales between minimum and maximum based on viewport.

#### 5. **Touch Optimization**

- Buttons sized for finger taps
- No hover-dependent functionality
- Swipe-friendly carousels (if added)

### Testing Checklist

- ✅ iPhone SE (375px)
- ✅ iPhone 12/13/14 (390px)
- ✅ iPad (768px)
- ✅ Desktop (1280px+)

---

## Iteration 5: Structured Data & Schema Markup

### Schema.org Implementation

Located in `_includes/seo-structured-data.html`.

#### 1. **Organization Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Chat Watch",
  "url": "https://aichatwatch.com",
  "logo": "...",
  "sameAs": ["GitHub", "NPM"]
}
```

**Benefits**:
- Knowledge Graph eligibility
- Rich search results
- Brand recognition

#### 2. **WebSite Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI Chat Watch",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "..."
  }
}
```

**Benefits**:
- Sitelinks search box
- Search feature in SERPs

#### 3. **SoftwareApplication Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Chat Watch (AICW)",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

**Benefits**:
- Software-specific rich results
- Installation instructions
- Rating/review eligibility

#### 4. **BlogPosting Schema** (for blog posts)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ page.title }}",
  "author": {
    "@type": "Person",
    "name": "..."
  }
}
```

**Benefits**:
- Article rich results
- Author attribution
- Publishing date display

#### 5. **BreadcrumbList Schema**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

**Benefits**:
- Breadcrumb trails in SERPs
- Improved navigation UX

### Validation

Test structured data:
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema Markup Validator](https://validator.schema.org/)

---

## Iteration 6: Social Sharing Optimization

### Open Graph Tags

Implemented via `jekyll-seo-tag` plugin.

#### 1. **Facebook/LinkedIn Sharing**

```html
<meta property="og:type" content="website">
<meta property="og:url" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

#### 2. **Twitter Cards**

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">
```

### Social Image Requirements

- **Dimensions**: 1200×630px (Open Graph), 1200×600px (Twitter)
- **Format**: PNG or JPG
- **Size**: < 1MB
- **Location**: `/assets/images/social-preview.png`

### Blog Post Social Optimization

Each post should include:

```yaml
---
title: "..."
description: "..."
image: "/assets/images/screenshots/post-image.png"
---
```

### Testing Social Shares

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

---

## Iteration 7: Extensibility & Documentation

### Extensibility Features

#### 1. **Modular Layouts**

Create new layouts by extending base templates:

```html
---
layout: default
---

<div class="custom-layout">
  {{ content }}
</div>
```

#### 2. **Custom Includes**

Add reusable components in `_includes/`:

```liquid
{% include newsletter-signup.html %}
{% include testimonial-carousel.html %}
```

#### 3. **Data Files**

Store structured data in `_data/`:

**Example** (`_data/pricing.yml`):
```yaml
plans:
  - name: "Free"
    price: "$0"
    features:
      - "Unlimited projects"
      - "20+ AI models"
```

**Usage**:
```liquid
{% for plan in site.data.pricing.plans %}
  <div class="pricing-card">
    <h3>{{ plan.name }}</h3>
    <p>{{ plan.price }}</p>
  </div>
{% endfor %}
```

#### 4. **Custom Page Templates**

Create specialized templates for different page types:

- `comparison-page.html` - For vs. pages
- `landing-page.html` - For conversion-focused pages
- `documentation.html` - For docs

#### 5. **Front Matter Defaults**

Set default values in `_config.yml`:

```yaml
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      author: "AI Chat Watch Team"
      comments: false
```

### Configuration Options

#### Site-Wide Settings

```yaml
# _config.yml
title: "Your Site Title"
description: "..."
url: "https://yoursite.com"
app_url: "https://app.yoursite.com"  # Sign In button URL

# Social
twitter:
  username: yourhandle
```

#### Per-Page Settings

```yaml
---
layout: page
title: "Page Title"
description: "Page description for SEO"
permalink: /custom-url/
hero: true                    # Show hero section
custom_css: |                 # Add page-specific CSS
  .custom-class { ... }
custom_js: |                  # Add page-specific JS
  console.log('...');
---
```

---

## Adding Blog Posts

### Create a New Post

1. **Create file**: `_posts/YYYY-MM-DD-url-slug.md`

2. **Add front matter**:

```yaml
---
layout: post
title: "Your Post Title"
description: "SEO-friendly description under 160 characters"
date: 2024-11-15 10:00:00 -0800
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
image: "/assets/images/post-image.png"
reading_time: 5
related_posts: true
---
```

3. **Write content** (Markdown):

```markdown
## Introduction

Your content here...

### Code Examples

```bash
npm install example
```

### Images

![Alt text](/assets/images/screenshot.png)

### Links

[Link text](https://example.com)
```

4. **Preview locally**:

```bash
bundle exec jekyll serve --drafts
```

5. **Publish**: Remove `--drafts` or move from `_drafts/` to `_posts/`

### Blog Post Best Practices

- **Title**: Under 60 characters, keyword-rich
- **Description**: Under 160 characters, compelling
- **Images**: Optimized, with descriptive alt text
- **Reading time**: Estimate 200-250 words per minute
- **Tags**: 3-5 relevant tags
- **Internal links**: Link to other posts and pages
- **CTAs**: Include calls-to-action

---

## Customization Guide

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-primary: #0F172A;
    --bg-primary: #FFFFFF;
}
```

### Adding New Pages

1. Create file in `_pages/`: `_pages/new-page.md`
2. Add front matter:

```yaml
---
layout: page
title: "New Page"
description: "Description"
permalink: /new-page/
hero: true
---
```

3. Add content (Markdown)
4. Link from navigation in `_includes/header.html`

### Customizing Navigation

Edit `_includes/header.html`:

```html
<div class="navbar-menu">
    <a href="{{ '/' | relative_url }}">Home</a>
    <a href="{{ '/new-link/' | relative_url }}">New Link</a>
    <!-- Add more -->
</div>
```

### Adding Analytics

Replace the AICW analytics script in `_includes/footer.html`:

```html
<!-- Your analytics script -->
<script src="..." data-key="your-key"></script>
```

---

## Deployment

### GitHub Pages

1. **Push to GitHub**:

```bash
git add .
git commit -m "Jekyll website setup"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Pages section
   - Source: Deploy from branch `main`
   - Folder: `/` (root)

3. **Custom Domain** (optional):
   - Add `CNAME` file with your domain
   - Configure DNS:
     - A records to GitHub IPs
     - CNAME record: `www` → `username.github.io`

### Netlify

1. **Create `netlify.toml`**:

```toml
[build]
  command = "bundle exec jekyll build"
  publish = "_site"

[build.environment]
  RUBY_VERSION = "2.7"
```

2. **Connect to GitHub**
3. **Deploy**: Automatic on push

### Vercel

Similar to Netlify, auto-detects Jekyll.

### Custom Server

```bash
# Build
bundle exec jekyll build

# Upload _site/ to your server
rsync -avz _site/ user@server:/var/www/html/
```

---

## Maintenance

### Regular Tasks

**Weekly**:
- Review analytics
- Check for broken links

**Monthly**:
- Update dependencies: `bundle update`
- Review and update blog posts
- Check mobile responsiveness

**Quarterly**:
- SEO audit
- Performance audit (Lighthouse)
- Accessibility audit
- Security updates

### Dependency Updates

```bash
# Check for updates
bundle outdated

# Update all
bundle update

# Update specific gem
bundle update jekyll
```

### Troubleshooting

**Build fails**:
```bash
bundle exec jekyll build --verbose
```

**CSS not updating**:
```bash
# Clear cache
bundle exec jekyll clean
bundle exec jekyll serve
```

**Plugin not working**:
Check `_config.yml` plugins list and Gemfile.

---

## Support

- **Jekyll Docs**: https://jekyllrb.com/docs/
- **GitHub Issues**: https://github.com/aichatwatch/aicw/issues
- **Stack Overflow**: Tag `jekyll`

---

## Changelog

### Version 1.0.0 (November 2024)

- ✅ Jekyll 4.3 setup
- ✅ SEO optimization (Iteration 1)
- ✅ Accessibility improvements (Iteration 2)
- ✅ Performance optimization (Iteration 3)
- ✅ Mobile responsiveness (Iteration 4)
- ✅ Structured data & schema (Iteration 5)
- ✅ Social sharing optimization (Iteration 6)
- ✅ Extensibility & documentation (Iteration 7)
- ✅ Blog functionality with pagination
- ✅ Privacy & Terms pages
- ✅ Sign In button on all pages
- ✅ Demo reports preservation

---

**Questions?** Open an issue on GitHub or contribute improvements via pull request!
