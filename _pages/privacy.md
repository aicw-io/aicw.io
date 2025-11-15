---
layout: page
title: "Privacy Policy"
description: "Privacy policy for AI Chat Watch - Learn how we protect your data and respect your privacy."
permalink: /privacy/
hero: true
---

**Last Updated: {{ "now" | date: "%B %d, %Y" }}**

## Introduction

AI Chat Watch ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you use our open-source AI monitoring tool.

## Information We Collect

### CLI Tool (Desktop Application)

When you use the AI Chat Watch CLI tool:

- **Local Data Only**: All data is stored locally on your computer in `~/Library/Application Support/aicw/` (macOS) or equivalent directories on other operating systems
- **No Telemetry**: We do not collect any usage statistics, analytics, or telemetry data from the CLI tool
- **API Keys**: Your API keys for AI providers (OpenAI, OpenRouter, etc.) are stored locally and encrypted
- **Project Data**: Your questions, AI responses, and generated reports are stored locally on your machine

### Website Analytics

On our website (aichatwatch.com):

- **AI Traffic Detection**: We detect which AI chatbot referred visitors to our site
- **Anonymous Analytics**: We use cookie-free, privacy-first analytics
- **No Personal Data**: We do not collect personally identifiable information
- **IP Anonymization**: IP addresses are anonymized (last 2 octets removed)
- **No Cross-Site Tracking**: We do not track users across different websites

## How We Use Information

We use the limited information we collect to:

- Understand which AI chatbots are driving traffic to our website
- Improve our documentation and user experience
- Monitor the performance and reliability of our services

## Data Storage and Security

### CLI Tool Data

- **Local Storage**: All data remains on your computer
- **Your Control**: You have complete control over your data
- **No Cloud Sync**: We do not sync or backup your data to our servers

### Website Data

- **EU Hosting**: Analytics data is hosted on EU servers (Frankfurt, Germany and Dublin, Ireland)
- **GDPR Compliant**: We comply with EU General Data Protection Regulation
- **Automatic Deletion**: Analytics data is automatically deleted after 13 months
- **No Cookies**: We don't use cookies for analytics

## Third-Party Services

### AI Providers

When you use the CLI tool, you send queries to third-party AI providers (OpenAI, Anthropic, Google, etc.). Please review their privacy policies:

- [OpenAI Privacy Policy](https://openai.com/privacy)
- [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- [Google Privacy Policy](https://policies.google.com/privacy)
- [OpenRouter Privacy Policy](https://openrouter.ai/privacy)

### Analytics Infrastructure

Our website analytics use:

- [Supabase](https://supabase.com/privacy) - Database hosting (EU region)
- [Tinybird](https://www.tinybird.co/privacy-policy) - Analytics processing (EU region)

## Your Rights

Under GDPR and other privacy laws, you have the right to:

- **Access**: Request a copy of data we hold about you
- **Rectification**: Request correction of inaccurate data
- **Erasure**: Request deletion of your data
- **Portability**: Request your data in a machine-readable format
- **Object**: Object to processing of your data

To exercise these rights, please contact us at [privacy@aichatwatch.com](mailto:privacy@aichatwatch.com).

## Children's Privacy

Our service is not directed to children under 13. We do not knowingly collect information from children under 13.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

## Data Retention

- **Website Analytics**: 13 months, then automatically deleted
- **CLI Tool Data**: Retained locally until you delete it

## International Data Transfers

Our website analytics data is processed and stored exclusively within the European Union to ensure GDPR compliance.

## Contact Us

If you have questions about this Privacy Policy, please contact us:

- **Email**: [privacy@aichatwatch.com](mailto:privacy@aichatwatch.com)
- **GitHub**: [github.com/aichatwatch/aicw/issues](https://github.com/aichatwatch/aicw/issues)

## Open Source Transparency

AI Chat Watch is open source. You can review our code to verify our privacy practices:

- [Main Repository](https://github.com/aichatwatch/aicw)
- [Analytics Implementation](https://github.com/aichatwatch/aicw/tree/main/aicw-app)
- [IP Anonymization Code](https://github.com/aichatwatch/aicw/blob/main/aicw-app/supabase/functions/_shared/ip-anonymization.ts)
