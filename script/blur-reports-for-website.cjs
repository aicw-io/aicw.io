#!/usr/bin/env node
/**
 * Post-processes ranking reports for public website:
 * - Injects/updates client-side blur script into all HTML files
 * - Updates footer branding from AIChatWatch.com to AICW.io
 * - Does NOT modify content or delete pages (SEO-friendly)
 * - Google sees full content, users see blurred content via JS
 *
 * Usage: node blur-reports-for-website.js [--dry-run]
 */

const fs = require('fs').promises;
const path = require('path');

// Paths relative to this script's location (aicw.io/script/)
const SCRIPT_DIR = __dirname;
const RANKING_PATH = path.join(SCRIPT_DIR, '../public/ranking');
const BLUR_SCRIPT_PATH = path.join(SCRIPT_DIR, 'ranking-blur.js');
const DRY_RUN = process.argv.includes('--dry-run');

let totalFiles = 0;
let updatedFiles = 0;

async function processHtmlFile(htmlPath, blurScript) {
  let html = await fs.readFile(htmlPath, 'utf-8');
  let modified = false;

  // 1. Update footer branding: AIChatWatch.com -> AICW.io with "AI Chat Watch" subtitle
  if (html.includes('AIChatWatch.com') || html.includes('aichatwatch.com')) {
    // Update main title in footer
    html = html.replace(
      /<h3 class="text-2xl font-bold text-gray-900 dark:text-white">AIChatWatch\.com<\/h3>/g,
      '<h3 class="text-2xl font-bold text-gray-900 dark:text-white">AICW.io</h3>'
    );

    // Update subtitle to "AI Chat Watch"
    html = html.replace(
      /<p class="text-sm text-gray-600 dark:text-gray-400">Know What AI Tells Your Customers<\/p>/g,
      '<p class="text-sm text-gray-600 dark:text-gray-400">AI Chat Watch</p>'
    );

    // Update copyright link text
    html = html.replace(
      />AIChatWatch\.com<\/a>\. All rights reserved\./g,
      '>AICW.io</a>. All rights reserved.'
    );

    // Update all aichatwatch.com URLs to aicw.io (except tracking script - handled separately)
    html = html.replace(/https:\/\/aichatwatch\.com(?!\/assets\/js\/aicw-view)/g, 'https://aicw.io');
    html = html.replace(/https:\/\/www\.aichatwatch\.com(?!\/assets\/js\/aicw-view)/g, 'https://aicw.io');

    // Update disclaimer text
    html = html.replace(/AIChatWatch\.com/g, 'AICW.io');

    modified = true;
  }

  // 2. Update tracking script URL: aichatwatch.com/assets/js/aicw-view.js -> cdn.aicw.io/aicw-view.min.js
  if (html.includes('aichatwatch.com/assets/js/aicw-view.js')) {
    html = html.replace(
      /src="https:\/\/aichatwatch\.com\/assets\/js\/aicw-view\.js"/g,
      'src="https://cdn.aicw.io/aicw-view.min.js"'
    );

    // Add data-domain attribute if not present (after data-key)
    if (!html.includes('data-domain="aicw.io')) {
      html = html.replace(
        /(data-key="[^"]+")(\\s*defer)/g,
        '$1\n  data-domain="aicw.io,www.aicw.io"$2'
      );
    }

    modified = true;
  }

  // 3. Inject or update blur script
  if (html.includes('aicw-blur-seed')) {
    // Script already exists - replace it with updated version
    const scriptRegex = /<script>\s*\/\*\*[\s\S]*?Client-side blur for ranking reports[\s\S]*?<\/script>/;
    if (scriptRegex.test(html)) {
      const newScriptTag = `<script>\n${blurScript}\n</script>`;
      html = html.replace(scriptRegex, newScriptTag);
      modified = true;
    }
  } else {
    // Inject script before </body>
    const scriptTag = `\n<script>\n${blurScript}\n</script>`;
    html = html.replace('</body>', scriptTag + '\n</body>');
    modified = true;
  }

  if (modified) {
    if (DRY_RUN) {
      console.log(`  [DRY-RUN] Would update: ${htmlPath}`);
    } else {
      await fs.writeFile(htmlPath, html);
    }
    updatedFiles++;
  }

  totalFiles++;
  return modified;
}

async function processDirectory(dirPath, blurScript, depth = 0) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath, blurScript, depth + 1);
    } else if (entry.name.endsWith('.html')) {
      await processHtmlFile(fullPath, blurScript);
    }
  }
}

async function main() {
  console.log('Processing ranking reports...');
  console.log('  - Updating footer branding (AIChatWatch.com -> AICW.io)');
  console.log('  - Updating tracking script (cdn.aicw.io)');
  console.log('  - Injecting/updating blur script');
  if (DRY_RUN) {
    console.log('\n[DRY-RUN MODE - No files will be modified]\n');
  }

  try {
    // Read the blur script
    const blurScript = await fs.readFile(BLUR_SCRIPT_PATH, 'utf-8');

    // Process all HTML files
    await processDirectory(RANKING_PATH, blurScript);

    console.log('\n========================================');
    console.log(`Total: ${totalFiles} HTML files scanned`);
    console.log(`Updated: ${updatedFiles} files`);
    console.log('========================================');

    if (DRY_RUN) {
      console.log('\n[DRY-RUN complete - no files were modified]');
    } else {
      console.log('\nProcessing complete!');
    }

  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
