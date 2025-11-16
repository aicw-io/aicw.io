---
layout: page
title: "How It Works - Track AI Traffic Without Cookie Consent"
description: "See visits from ChatGPT, Claude, Perplexity and 20+ AI models. No cookie consent needed. EU-hosted, GDPR-compliant analytics built for AI traffic."
permalink: /how-it-works/
hero: true
schema_type: Article
custom_css_file: /assets/css/how-it-works.css
---

## Analytics Built for AI Traffic

<section class="features">
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">🤖</div>
      <h3>Built for AI Traffic</h3>
      <p>Automatically detect visits from ChatGPT, Claude, Gemini, Perplexity, and 20+ AI chatbots. Track UTM parameters and AI citations with zero configuration.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <h3>No Consent Friction</h3>
      <p>Skip the annoying cookie popup. Because we don't use cookies, you don't need consent banners. Your visitors get a clean experience, you stay compliant.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🇪🇺</div>
      <h3>EU-Hosted & Compliant</h3>
      <p>All data lives on EU servers (Supabase in Frankfurt, Tinybird in Ireland). GDPR-compliant by design. 13-month automatic retention. No data transfer headaches.</p>
    </div>
  </div>
</section>

<section class="how-it-works-steps">
  <h2 style="text-align: center; margin-bottom: 3rem;">How It Works</h2>

  <div class="steps">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h3>User clicks AI-generated link</h3>
        <p>Someone reads about your brand in ChatGPT, Claude, or Perplexity and clicks through to your website.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h3>We detect the AI source</h3>
        <p>Our script automatically identifies which AI service sent them using referrer detection and UTM parameters. Works with ChatGPT, Claude, Gemini, Perplexity, and 20+ others.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h3>Anonymous session tracking</h3>
        <p>We count the visit without identifying individuals. IP addresses are anonymized (last 2 digits removed: 192.168.1.100 → 192.168.0.0). No cookies, no persistent IDs.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <h3>Stored securely in EU</h3>
        <p>Data is processed and stored on EU servers (Supabase in Frankfurt, Tinybird in Ireland). Session hashes reset every 24 hours—yesterday's visitors are already anonymous.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">5</div>
      <div class="step-content">
        <h3>You see your AI traffic</h3>
        <p>Dashboard shows exactly which AI chatbots are driving traffic, which pages they're visiting, and what UTM parameters they're using. Real insights, zero compliance headaches.</p>
      </div>
    </div>
  </div>
</section>

## Why You Don't Need Cookie Banners

We track sessions using rotating cryptographic hashes instead of cookies. This means no persistent identifiers, no cross-day tracking, and no consent popups blocking your users.

<div class="compliance-grid">
  <div class="compliance-item">
    <h4>No Cookies</h4>
    <p>Track sessions via rotating hashes, not persistent identifiers. Daily reset means yesterday's visitors are already anonymous.</p>
  </div>

  <div class="compliance-item">
    <h4>IP Anonymization</h4>
    <p>Last 2 digits removed before processing (192.168.1.100 → 192.168.0.0). We can't identify individuals even if we wanted to.</p>
  </div>

  <div class="compliance-item">
    <h4>EU Data Hosting</h4>
    <p>All data stored in EU regions (Supabase Frankfurt, Tinybird Ireland). GDPR Article 4(1): No personal data collected.</p>
  </div>

  <div class="compliance-item">
    <h4>13-Month Auto-Delete</h4>
    <p>Data automatically purged after 13 months. Users can request deletion anytime. No indefinite retention.</p>
  </div>
</div>

## What We Track (And What We Don't)

<div class="tracking-grid">
  <div class="track-list">
    <h3>✅ We Track</h3>
    <ul>
      <li>AI service name (ChatGPT, Claude, etc.)</li>
      <li>UTM parameters & campaigns</li>
      <li>Referrer domain</li>
      <li>Text fragments (AI citations)</li>
      <li>Page views & paths</li>
      <li>Country + region (not city)</li>
      <li>Browser name (no version)</li>
      <li>Device type (desktop/mobile)</li>
      <li>Anonymous session count (resets daily)</li>
    </ul>
  </div>

  <div class="no-track-list">
    <h3>❌ We DON'T Track</h3>
    <ul>
      <li>Cookies or local storage</li>
      <li>Full IP addresses</li>
      <li>Cross-day visitors (salt rotates)</li>
      <li>Cross-website tracking</li>
      <li>Precise geolocation (no city/GPS)</li>
      <li>Personal identifiers</li>
      <li>Browser fingerprinting</li>
      <li>User agent versions</li>
      <li>Individual user behavior</li>
    </ul>
  </div>
</div>

## Don't Trust Marketing Copy? Read the Code.

Every privacy claim we make is backed by open source code. See exactly how we anonymize IPs, rotate session hashes, and detect AI traffic.

- [📦 Main Repository](https://github.com/aichatwatch/aicw)
- [🔍 Analytics Function](https://github.com/aichatwatch/aicw/blob/main/aicw-app/supabase/functions/view/index.ts)
- [🔒 IP Anonymization](https://github.com/aichatwatch/aicw/blob/main/aicw-app/supabase/functions/_shared/ip-anonymization.ts)

---

<div style="text-align: center; padding: 3rem 0;">
  <h2>Ready to Track Your AI Traffic?</h2>
  <p style="font-size: 1.2rem; margin-bottom: 2rem;">Install the CLI in under 2 minutes. Free, open-source, and runs on your computer.</p>
  <a href="https://github.com/aichatwatch/aicw#quick-start" class="btn btn-primary" style="margin: 0 0.5rem;">Try the CLI</a>
  <a href="{{ '/demo/reports/' | relative_url }}" class="btn btn-secondary" style="margin: 0 0.5rem;">See Live Demo</a>
</div>
