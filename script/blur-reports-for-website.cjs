#!/usr/bin/env node
/**
 * Injects client-side blur script into ranking report HTML files.
 *
 * This script ONLY adds the blur JavaScript - it does not modify
 * any other content. Branding, tracking code, etc. should come
 * from the templates used by aicw-ee.
 *
 * Usage: node blur-reports-for-website.cjs [--dry-run]
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

  // Check if blur script already exists
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
  console.log('Injecting blur script into ranking reports...');
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
      console.log('\nBlur script injection complete!');
    }

  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
