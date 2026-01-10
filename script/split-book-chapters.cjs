#!/usr/bin/env node
/**
 * Split book markdown into chapter files with updated image references
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../public/books/AI Search Engine Optimization Guide.md');
const OUTPUT_DIR = path.join(__dirname, '../src/content/book-chapters/ai-seo-guide');
const MAPPING_FILE = path.join(__dirname, '../public/assets/book/ai-seo-guide/images/_image-mapping.json');

// Create output directory
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read files
const content = fs.readFileSync(INPUT_FILE, 'utf8');
const imageMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Chapter definitions based on TOC
const chapterDefs = [
  { num: 0, slug: 'introduction', title: 'Introduction: The Dawn of a New Search Era', pattern: /^#\s+\*?\*?Introduction[:\s]/im },
  { num: 1, slug: 'beyond-keywords', title: 'Beyond Keywords - Understanding the AI Search Revolution', pattern: /^#\s+\*?\*?Chapter\s+1[:\s]/im },
  { num: 2, slug: 'how-big-is-ai-search', title: 'How Big is AI Search Compared to Google?', pattern: /^#\s+\*?\*?Chapter\s+2[:\s]/im },
  { num: 3, slug: 'under-the-hood', title: 'Under the Hood: The AI Search Workflow', pattern: /^#\s+\*?\*?Chapter\s+3[:\s]/im },
  { num: 4, slug: 'llms-knowledge-base', title: 'The Brains of the Operation: LLMs and Their Knowledge Base', pattern: /^#\s+\*?\*?Chapter\s+4[:\s]/im },
  { num: 5, slug: 'knowledge-sources', title: 'Where Does the LLM\'s Knowledge Come From?', pattern: /^#\s+\*?\*?Chapter\s+5[:\s]/im },
  { num: 6, slug: 'optimizing-content', title: 'Optimizing Content for Easy Understanding By AI', pattern: /^#\s+\*?\*?Chapter\s+6[:\s]/im },
  { num: 7, slug: 'technical-seo', title: 'Technical SEO for the AI Era', pattern: /^#\s+\*?\*?Chapter\s+7[:\s]/im },
  { num: 8, slug: 'future-seo', title: 'Charting the Future: SEO in an AI-First World', pattern: /^#\s+\*?\*?Chapter\s+8[:\s]/im },
  { num: 9, slug: 'appendix', title: 'Appendix: Special Thanks, About the Author, Glossary', pattern: /^#\s+\*?\*?Special Thanks/im },
];

// Find chapter boundaries
const lines = content.split('\n');
const chapterBoundaries = [];

for (const def of chapterDefs) {
  for (let i = 0; i < lines.length; i++) {
    if (def.pattern.test(lines[i])) {
      chapterBoundaries.push({ ...def, startLine: i });
      break;
    }
  }
}

// Sort by start line
chapterBoundaries.sort((a, b) => a.startLine - b.startLine);

// Find end of each chapter (start of next chapter or end of file)
for (let i = 0; i < chapterBoundaries.length; i++) {
  if (i < chapterBoundaries.length - 1) {
    chapterBoundaries[i].endLine = chapterBoundaries[i + 1].startLine;
  } else {
    // Last chapter goes until the image definitions
    const imageDefStart = lines.findIndex(l => l.match(/^\[image\d+\]:\s*</));
    chapterBoundaries[i].endLine = imageDefStart > 0 ? imageDefStart : lines.length;
  }
}

// Function to replace image references
function replaceImageRefs(text) {
  // Replace ![text][imageN] with ![text](path)
  let result = text;
  for (const [ref, newPath] of Object.entries(imageMapping)) {
    // Match ![][imageN] or ![alt][imageN]
    const regex = new RegExp(`!\\[([^\\]]*)\\]\\[${ref}\\]`, 'g');
    result = result.replace(regex, `![$1](${newPath})`);
  }
  return result;
}

// Function to clean up markdown
function cleanMarkdown(text) {
  let result = text;

  // Remove anchor IDs like {#heading-name}
  result = result.replace(/\s*\{#[^}]+\}/g, '');

  // Clean up excessive ** markers
  result = result.replace(/\*{3,}/g, '**');

  // Remove empty bold markers
  result = result.replace(/\*\*\s*\*\*/g, '');

  // Clean up heading formatting
  result = result.replace(/^(#{1,6})\s+\*\*(.+?)\*\*\s*$/gm, '$1 $2');

  return result;
}

// Extract and save each chapter
console.log('Splitting chapters...\n');

for (const chapter of chapterBoundaries) {
  const chapterLines = lines.slice(chapter.startLine, chapter.endLine);
  let chapterContent = chapterLines.join('\n');

  // Replace image references
  chapterContent = replaceImageRefs(chapterContent);

  // Clean up markdown
  chapterContent = cleanMarkdown(chapterContent);

  // Remove leading/trailing whitespace
  chapterContent = chapterContent.trim();

  // Create frontmatter
  const frontmatter = `---
title: "${chapter.title.replace(/"/g, '\\"')}"
chapterNumber: ${chapter.num}
book: "ai-seo-guide"
---

`;

  const fullContent = frontmatter + chapterContent;

  // Save file
  const filename = `${String(chapter.num).padStart(2, '0')}-${chapter.slug}.md`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outputPath, fullContent);

  console.log(`Created ${filename} (lines ${chapter.startLine}-${chapter.endLine}, ${chapterLines.length} lines)`);
}

console.log(`\nCreated ${chapterBoundaries.length} chapter files in ${OUTPUT_DIR}`);
