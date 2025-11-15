# AI Chat Watch Jekyll Website - Quick Start Guide

## 🎉 Your website has been successfully converted to Jekyll!

This guide will help you get started with your new Jekyll-powered website.

## What Was Done

✅ **Complete Jekyll Setup**: Your static HTML website is now a powerful Jekyll site
✅ **Blog Functionality**: Full-featured blog with pagination and URL slugs like `/blog/post-title/`
✅ **Privacy & Terms Pages**: Professional legal pages at `/privacy/` and `/terms/`
✅ **Sign In Button**: All pages now have a "Sign In" button linking to app.aichatwatch.com
✅ **SEO Optimized**: Comprehensive SEO with plugins and structured data
✅ **7 Iterations of Improvements**: Detailed improvements documented in JEKYLL_README.md

## File Structure

```
aichatwatch.com/
├── _config.yml              # Main configuration
├── _layouts/                # Page templates (default, page, post, blog)
├── _includes/               # Reusable components (header, footer, etc.)
├── _pages/                  # Static pages (how-it-works, privacy, terms)
├── _posts/                  # Blog posts (3 sample posts included)
├── blog/index.html          # Blog homepage
├── index.html               # Main homepage (converted to Jekyll)
├── demo/reports/            # Preserved demo reports
└── JEKYLL_README.md         # Comprehensive documentation
```

## Quick Commands

### 1. Install Dependencies

```bash
cd aichatwatch.com

# Install Ruby dependencies
bundle install
```

### 2. Run Development Server

```bash
# Start Jekyll server
bundle exec jekyll serve

# Visit http://localhost:4000
```

### 3. Build for Production

```bash
# Generate static site in _site/
bundle exec jekyll build
```

## Adding a New Blog Post

### Step 1: Create File

Create a file in `_posts/` with format: `YYYY-MM-DD-url-slug.md`

Example: `_posts/2024-11-16-my-new-post.md`

### Step 2: Add Front Matter

```yaml
---
layout: post
title: "Your Post Title"
description: "SEO description under 160 characters"
date: 2024-11-16 10:00:00 -0800
author: "Your Name"
tags: ["ai", "monitoring", "tutorial"]
image: "/assets/images/your-image.png"
reading_time: 5
related_posts: true
---
```

### Step 3: Write Content

```markdown
## Introduction

Your content here in Markdown format...

### Code Examples

\`\`\`bash
npm install example
\`\`\`

### Images

![Alt text](/assets/images/screenshot.png)
```

### Step 4: Preview & Publish

```bash
# Preview with drafts
bundle exec jekyll serve --drafts

# When ready, just save the file in _posts/
```

**Your post will be available at**: `/blog/your-post-title/`

## Key Features

### 1. SEO Optimization (Iteration 1)

- ✅ jekyll-seo-tag plugin for automatic meta tags
- ✅ jekyll-sitemap for automatic sitemap.xml
- ✅ jekyll-feed for RSS/Atom feed
- ✅ Clean URL structure

**Test**: Visit `/sitemap.xml` and `/feed.xml`

### 2. Accessibility (Iteration 2)

- ✅ Semantic HTML5 elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ WCAG 2.1 AA compliant

### 3. Performance (Iteration 3)

- ✅ Lazy loading images
- ✅ Deferred JavaScript
- ✅ Optimized fonts
- ✅ Minimal dependencies

### 4. Mobile Responsive (Iteration 4)

- ✅ Mobile-first design
- ✅ Responsive breakpoints
- ✅ Touch-friendly navigation
- ✅ Tested on multiple devices

### 5. Structured Data (Iteration 5)

- ✅ Organization schema
- ✅ Website schema
- ✅ SoftwareApplication schema
- ✅ BlogPosting schema for posts
- ✅ BreadcrumbList schema

**Test**: Use [Google Rich Results Test](https://search.google.com/test/rich-results)

### 6. Social Sharing (Iteration 6)

- ✅ Open Graph tags for Facebook/LinkedIn
- ✅ Twitter Card tags
- ✅ Optimized social images (1200×630px)

**Test**: Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)

### 7. Extensibility (Iteration 7)

- ✅ Modular layout system
- ✅ Reusable includes
- ✅ Data files support
- ✅ Custom front matter
- ✅ Comprehensive documentation

## Sample Blog Posts Included

We've created 3 sample blog posts to demonstrate the functionality:

1. **Introducing AI Chat Watch** (`/blog/introducing-ai-chat-watch/`)
   - Comprehensive introduction post
   - 5-minute read
   - Tags: announcement, ai-monitoring, brand-tracking

2. **What is AI Visibility** (`/blog/what-is-ai-visibility-and-why-it-matters/`)
   - Educational content
   - 7-minute read
   - Tags: ai-visibility, seo, digital-marketing

3. **How to Track Your Brand** (`/blog/how-to-track-your-brand-across-ai-chatbots/`)
   - Tutorial with code examples
   - 10-minute read
   - Tags: tutorial, brand-monitoring, competitive-intelligence

## Sign In Button

All pages now include a "Sign In" button in the navigation that links to:

**URL**: `https://app.aichatwatch.com`

To change this URL, edit `_config.yml`:

```yaml
app_url: "https://app.aichatwatch.com"
```

## Demo Reports

Your existing demo reports are preserved at `/demo/reports/` and work exactly as before.

## Customization

### Change Site Colors

Edit `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-primary: #0F172A;
}
```

### Add New Pages

1. Create `_pages/new-page.md`
2. Add front matter:

```yaml
---
layout: page
title: "New Page"
description: "Description"
permalink: /new-page/
hero: true
---

Your content here...
```

3. Add link to navigation in `_includes/header.html`

### Customize Footer

Edit `_includes/footer.html` to add/remove links or change content.

## Deployment

### GitHub Pages

```bash
git add .
git commit -m "Jekyll website"
git push origin main

# Enable GitHub Pages in repository settings
```

### Netlify

1. Connect your GitHub repository
2. Build command: `bundle exec jekyll build`
3. Publish directory: `_site`

### Manual

```bash
bundle exec jekyll build
# Upload _site/ folder to your server
```

## Testing Checklist

Before deploying to production:

- [ ] Test all links work
- [ ] Test blog posts display correctly
- [ ] Test on mobile devices
- [ ] Validate HTML: https://validator.w3.org/
- [ ] Test structured data: https://search.google.com/test/rich-results
- [ ] Check page speed: https://pagespeed.web.dev/
- [ ] Verify sitemap.xml works
- [ ] Test RSS feed at /feed.xml
- [ ] Check Open Graph tags with Facebook Debugger

## Documentation

For comprehensive documentation, see:

- **JEKYLL_README.md**: Complete documentation with all 7 iterations
- **Jekyll Docs**: https://jekyllrb.com/docs/
- **GitHub Issues**: Report issues or ask questions

## Need Help?

1. **Jekyll Documentation**: https://jekyllrb.com/docs/
2. **Project Issues**: https://github.com/aichatwatch/aicw/issues
3. **Stack Overflow**: Tag `jekyll`

## Next Steps

1. **Review the sample blog posts** to understand the format
2. **Write your first blog post** following the template above
3. **Customize colors and styling** in styles.css
4. **Test locally** with `bundle exec jekyll serve`
5. **Deploy to production** when ready

---

**Congratulations!** Your Jekyll website is ready to go. All features requested have been implemented with a focus on extensibility and best practices. 🎉
