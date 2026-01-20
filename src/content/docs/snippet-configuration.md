---
title: "Widget Configuration"
description: "Complete reference for AICW tracking script data attributes. Learn how to configure the summarize bar, share buttons, and URL filtering."
published_at: 2026-01-13
order: 1
keywords: "aicw, widget, configuration, tracking script, data attributes, summarize bar, share buttons"
---

The AICW widget is configured through `data-*` attributes on the script tag. This guide covers all available configuration options.

## Quick Start

Add the AICW tracking script to your website:

```html
<script
  src="https://t.aicw.io/aicw-view.min.js"
  data-key="your-tracking-id"
  data-domain="yoursite.com">
</script>
```

## Required Attributes

These attributes must be present for the widget to function.

### data-key

Your unique tracking ID in UUID format. Get this from your [AICW dashboard](https://app.aicw.io).

```html
data-key="550e8400-e29b-41d4-a716-446655440000"
```

### data-domain

Comma-separated list of domains where the widget is allowed to run. This is a security feature to prevent unauthorized usage.

```html
<!-- Single domain -->
data-domain="example.com"

<!-- Multiple domains -->
data-domain="example.com,www.example.com,blog.example.com"
```

## Summarize Bar Configuration

The summarize bar displays AI service buttons that let visitors summarize your page content.

### data-summarize-bar

Enable or disable the summarize bar feature.

| Value | Description |
|-------|-------------|
| `true` (default) | Summarize bar is enabled |
| `false` or `0` | Summarize bar is disabled |

```html
<!-- Disable summarize bar -->
data-summarize-bar="false"
```

### data-summarize-position

Position of the summarize bar on desktop.

| Value | Description |
|-------|-------------|
| `right` (default) | Right side of the screen |
| `left` | Left side of the screen |

```html
data-summarize-position="left"
```

### data-summarize-services

Comma-separated list of AI services to display. Order determines display order.

| Service Key | Service Name |
|-------------|--------------|
| `gemini` | Google Gemini |
| `chatgpt` | ChatGPT |
| `perplexity` | Perplexity |
| `claude` | Claude |
| `grok` | Grok |

**Default:** `gemini,chatgpt,perplexity,claude,grok`

```html
<!-- Show only ChatGPT and Claude -->
data-summarize-services="chatgpt,claude"

<!-- Custom order -->
data-summarize-services="claude,chatgpt,gemini"
```

### data-summarize-prompt

Custom prompt sent to AI services along with your page URL.

**Default:** `Summarize this page:`

```html
data-summarize-prompt="Explain this article in simple terms:"
```

### data-summarize-mobile-position

Position of the summarize bar on mobile devices.

| Value | Description |
|-------|-------------|
| `bottom` (default) | Bottom of the screen |
| `top` | Top of the screen |

```html
data-summarize-mobile-position="top"
```

**Note:** `data-summarize-mobile` is also supported for backward compatibility.

### data-summarize-bg-color

Custom background color for the widget. Accepts any valid CSS color value.

```html
<!-- Hex color -->
data-summarize-bg-color="#1a1a2e"

<!-- RGB -->
data-summarize-bg-color="rgb(26, 26, 46)"
```

### data-summarize-text-color

Custom text/icon color for the widget. Accepts any valid CSS color value.

```html
data-summarize-text-color="#ffffff"
```

## Share Bar Configuration

The share bar displays social sharing buttons alongside the summarize bar.

### data-share-bar

Enable or disable the share bar feature.

| Value | Description |
|-------|-------------|
| `true` (default) | Share bar is enabled |
| `false` or `0` | Share bar is disabled |

```html
<!-- Disable share bar -->
data-share-bar="false"
```

### data-share-services

Comma-separated list of share services to display.

| Service Key | Service Name |
|-------------|--------------|
| `whatsapp` | WhatsApp |
| `telegram` | Telegram |
| `x` | X (Twitter) |
| `gmail` | Gmail |
| `linkedin` | LinkedIn |

**Default:** `whatsapp,telegram,x,gmail,linkedin`

```html
<!-- Show only X and LinkedIn -->
data-share-services="x,linkedin"
```

## URL Pattern Filtering

Control which pages display the widget using regex patterns.

### data-url-include

Show the widget **only** on URLs matching the specified regex pattern. If not set, the widget shows on all pages.

```html
<!-- Show only on /blog/* pages -->
data-url-include="/blog/.+"

<!-- Show on specific paths -->
data-url-include="/docs/|/guides/"

<!-- Show on /public/* pages -->
data-url-include="/public/.+"
```

### data-url-exclude

Hide the widget on URLs matching the specified regex pattern. Use this to exclude specific pages.

```html
<!-- Hide on admin and checkout pages -->
data-url-exclude="/admin|/checkout|/cart"

<!-- Hide on login pages -->
data-url-exclude="/login|/signup|/auth"
```

### Combining Include and Exclude

You can use both attributes together. The include pattern is checked first, then exclude filters further.

```html
<!-- Show on /blog/* but hide on /blog/drafts/* -->
data-url-include="/blog/.+"
data-url-exclude="/blog/drafts"
```

**Pattern matching behavior:**
- Patterns are matched against `window.location.pathname`
- Patterns are anchored at the start with `^`
- Use `|` for multiple patterns
- Invalid regex patterns fail safely (widget shows with console warning)

## Complete Example

Here's a fully configured widget:

```html
<script
  src="https://t.aicw.io/aicw-view.min.js"
  data-key="your-tracking-id"
  data-domain="example.com,www.example.com"
  data-summarize-bar="true"
  data-summarize-position="right"
  data-summarize-services="chatgpt,claude,perplexity"
  data-summarize-prompt="Summarize this article:"
  data-summarize-mobile-position="bottom"
  data-share-bar="true"
  data-share-services="x,linkedin,whatsapp"
  data-url-exclude="/admin|/checkout">
</script>
```

## Troubleshooting

### Widget not appearing

1. Check that `data-domain` includes your current domain
2. Verify `data-key` is correct
3. Check browser console for errors
4. Ensure you're not on localhost (widget is disabled for local development)
5. Check if URL patterns are excluding the current page

### Widget appearing on wrong pages

Use `data-url-include` to limit where the widget appears, or `data-url-exclude` to hide it on specific pages.

### Invalid pattern warning

If you see `[AICW] Invalid include/exclude pattern:` in the console, check your regex syntax. The widget will still show as a failsafe.
