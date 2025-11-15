# Automatic JSON-LD Schema Documentation

## Overview

The `seo-structured-data.html` include automatically generates JSON-LD structured data based on page type and YAML front matter. It's GitHub Pages compatible (uses only Liquid templating, no custom plugins).

## How It Works

### Automatic Schema Generation

1. **Organization Schema** - Generated on all pages
2. **WebSite Schema** - Homepage only (automatically detected)
3. **SoftwareApplication Schema** - Homepage only (automatically detected)
4. **BlogPosting Schema** - Blog posts only (when layout: post)
5. **BreadcrumbList Schema** - All pages except homepage

### Manual Schema Override

Add `schema_type` to your page's YAML front matter to generate specific schemas:

#### Article Schema

```yaml
---
layout: page
title: "How It Works"
description: "Learn how AICW works"
schema_type: Article
---
```

#### FAQPage Schema

```yaml
---
layout: page
title: "Frequently Asked Questions"
schema_type: FAQPage
faqs:
  - question: "What is AICW?"
    answer: "AICW is a tool for monitoring AI chatbot responses."
  - question: "Is it free?"
    answer: "Yes, it's free and open-source."
---
```

## GitHub Pages Compatibility

✓ Uses only standard Liquid templating
✓ No custom Jekyll plugins required
✓ Compatible with Jekyll 3.9+ and 4.x
✓ All data comes from _config.yml or page front matter

## Supported Schema Types

- **Organization** (automatic, all pages)
- **WebSite** (automatic, homepage)
- **SoftwareApplication** (automatic, homepage)
- **BlogPosting** (automatic, blog posts)
- **Article** (manual via `schema_type: Article`)
- **FAQPage** (manual via `schema_type: FAQPage` + `faqs` list)
- **BreadcrumbList** (automatic, non-homepage pages)

## Configuration

All schema data comes from `_config.yml`:

```yaml
organization:
  name: "Your Organization"
  url: "https://example.com"
  logo: "https://example.com/logo.png"
  sameAs:
    - "https://github.com/yourorg"
    - "https://twitter.com/yourorg"
  contactPoint:
    contactType: "Support"
    url: "https://example.com/support"
```

## Validation

Test your structured data:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
