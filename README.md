# aichatwatch.com Website

Astro-based website with a blog system using content collections.

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS v4 with Typography plugin
- **Content:** MDX support
- **SEO:** Sitemap, RSS, Open Graph, JSON-LD

## How to Add a New Blog Post

### Step 1: Create Markdown File

Create a new `.md` file in:
```
/src/content/blog/your-post-slug.md
```

The filename becomes the URL slug: `your-post-slug.md` → `/blog/your-post-slug/`

### Step 2: Add Required Frontmatter

```yaml
---
title: "Your Post Title"
description: "Short description for previews and SEO (150-160 chars ideal)"
pubDate: 2025-12-01
author: aicw-team
categories: ["announcements"]
tags: ["ai-visibility", "brand-monitoring"]
heroImage: "/assets/images/your-image.png"
heroImageAlt: "Description of the hero image"
featured: false
draft: false
---
```

### Step 3: Write Content

Write standard Markdown content below the frontmatter. Supports:
- Headers, lists, code blocks
- Images: `![alt](/assets/images/path.png)`
- Links, blockquotes, tables
- MDX components if needed

### Step 4: Add Images (if any)

Place images in: `/public/assets/images/`
- Hero images: 1200x630px recommended for social sharing
- Reference with path starting from `/assets/images/`

## Frontmatter Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `description` | Yes | Short SEO description |
| `pubDate` | Yes | Publication date (YYYY-MM-DD) |
| `author` | Yes | Must match author file (e.g., `aicw-team`) |
| `categories` | No | Array, defaults to `['general']` |
| `tags` | No | Array, defaults to `[]` |
| `heroImage` | No | Path to hero image |
| `heroImageAlt` | No | Alt text for hero image |
| `featured` | No | Boolean, highlights on listing |
| `draft` | No | Boolean, `true` hides post |
| `updatedDate` | No | Last update date |
| `og_title` | No | Override Open Graph title |
| `og_description` | No | Override OG description |

## Publication Control

- **Hide post**: Set `draft: true`
- **Schedule post**: Set `pubDate` to future date (won't show until then)
- **Feature post**: Set `featured: true`

## Adding New Authors

Create file in `/src/content/authors/author-slug.md`:

```yaml
---
name: "Author Name"
title: "Author Title/Role"
bio: "Short biography"
avatar: "/assets/images/authors/avatar.png"
twitter: "https://twitter.com/username"
github: "https://github.com/username"
---
```

## Key Files

| File | Purpose |
|------|---------|
| `/src/content/blog/*.md` | Blog post markdown files |
| `/src/content/authors/*.md` | Author profiles |
| `/src/content/config.ts` | Schema validation for frontmatter |
| `/src/layouts/BlogLayout.astro` | Blog post layout/styling |
| `/src/pages/blog/index.astro` | Blog listing page |
| `/src/pages/blog/[slug].astro` | Dynamic blog post routing |

## Example Complete Blog Post

```markdown
---
title: "How to Monitor Your Brand in AI Chatbots"
description: "Learn how to track and improve your brand's visibility across ChatGPT, Claude, and other AI assistants."
pubDate: 2025-12-01
author: aicw-team
categories: ["tutorials", "brand-monitoring"]
tags: ["ai-visibility", "chatgpt", "claude", "brand-monitoring"]
heroImage: "/assets/images/tutorials/brand-monitoring-guide.png"
heroImageAlt: "AI Chat Watch brand monitoring dashboard"
featured: true
draft: false
---

## Introduction

Your content goes here...

## Getting Started

More content...

![Screenshot](/assets/images/screenshots/example.png)

## Conclusion

Final thoughts...
```

## Development Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally before deploying |
