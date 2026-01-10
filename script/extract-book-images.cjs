#!/usr/bin/env node
/**
 * Extract base64 images from markdown and save with descriptive names
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../public/books/AI Search Engine Optimization Guide.md');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/book/ai-seo-guide/images');

// Read the markdown file
const content = fs.readFileSync(INPUT_FILE, 'utf8');

// Find all image reference definitions at the end of the file
// Format: [image1]: <data:image/png;base64,...>
const imageDefRegex = /^\[image(\d+)\]:\s*<data:image\/(png|jpeg|jpg|gif);base64,([^>]+)>/gm;

// Find all image usages and their context (surrounding headings)
const lines = content.split('\n');

// Track which chapter/section each image appears in
const imageContexts = new Map();
let currentChapter = 'cover';
let currentSection = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Track chapter headings
  if (line.match(/^#\s+\*?\*?Chapter\s+(\d+)/i)) {
    const match = line.match(/Chapter\s+(\d+)/i);
    currentChapter = `ch${match[1].padStart(2, '0')}`;
    // Extract section name from heading
    const sectionMatch = line.match(/Chapter\s+\d+[:\s-]+(.+?)[\s{*]*/i);
    currentSection = sectionMatch ? sectionMatch[1].trim() : '';
  } else if (line.match(/^#\s+\*?\*?Introduction/i)) {
    currentChapter = 'ch00';
    currentSection = 'introduction';
  } else if (line.match(/^#\s+\*?\*?(Glossary|About|Special Thanks)/i)) {
    currentChapter = 'ch09';
    currentSection = line.match(/^#\s+\*?\*?(\w+)/i)[1].toLowerCase();
  }

  // Track image references
  const imageRefMatch = line.match(/!\[\]\[image(\d+)\]/);
  if (imageRefMatch) {
    const imageNum = imageRefMatch[1];

    // Look for figure caption nearby (next few lines)
    let caption = '';
    for (let j = i; j < Math.min(i + 3, lines.length); j++) {
      const captionMatch = lines[j].match(/\*?Figure\s+[\d.]+[.:]\s*(.+?)\*?\s*$/i);
      if (captionMatch) {
        caption = captionMatch[1];
        break;
      }
    }

    // Look at previous heading for context if no caption
    if (!caption) {
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        const headingMatch = lines[j].match(/^#{1,4}\s+(.+?)[\s{]/);
        if (headingMatch) {
          caption = headingMatch[1].replace(/\*+/g, '').trim();
          break;
        }
      }
    }

    imageContexts.set(imageNum, {
      chapter: currentChapter,
      section: currentSection,
      caption: caption,
      line: i + 1
    });
  }
}

// Extract and save images
let extractedCount = 0;
const imageMapping = {};

let match;
while ((match = imageDefRegex.exec(content)) !== null) {
  const imageNum = match[1];
  const format = match[2] === 'jpeg' ? 'jpg' : match[2];
  const base64Data = match[3];

  // Get context for this image
  const context = imageContexts.get(imageNum) || { chapter: 'misc', caption: '' };

  // Generate descriptive filename
  let filename;
  if (imageNum === '1') {
    filename = `cover.${format}`;
  } else {
    // Create slug from caption or use generic name
    let slug = context.caption
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);

    if (!slug) {
      slug = `figure-${imageNum}`;
    }

    filename = `${context.chapter}-${slug}.${format}`;
  }

  // Decode and save
  const buffer = Buffer.from(base64Data, 'base64');
  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, buffer);

  imageMapping[`image${imageNum}`] = `/assets/book/ai-seo-guide/images/${filename}`;
  extractedCount++;

  console.log(`Extracted image${imageNum} -> ${filename} (${context.chapter}, line ${context.line || '?'})`);
}

// Save mapping file for reference
const mappingPath = path.join(OUTPUT_DIR, '_image-mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));

console.log(`\nExtracted ${extractedCount} images to ${OUTPUT_DIR}`);
console.log(`Mapping saved to ${mappingPath}`);
