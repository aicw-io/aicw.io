/**
 * Replace compressed base64-extracted images with original high-quality images
 *
 * Mapping:
 * - image1 (cover.png) ← .jpeg
 * - image2 (ch01-chapter.png) ← 002.png
 * - image3 (ch02-chapter.png) ← 003.png
 * - imageN ← 00N.png (for N >= 2)
 */

const fs = require('fs');
const path = require('path');

const ORIGINALS_DIR = path.join(__dirname, '../public/books/ai-seo-guide/pictures');
const TARGET_DIR = path.join(__dirname, '../public/assets/book/ai-seo-guide/images');
const MAPPING_FILE = path.join(TARGET_DIR, '_image-mapping.json');

// Read the mapping file to get target filenames
const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Get list of original files
const originalFiles = fs.readdirSync(ORIGINALS_DIR).sort();
console.log(`Found ${originalFiles.length} original files`);

// Find the cover jpeg (the large one, not .040.jpeg)
const coverJpeg = originalFiles.find(f => f.endsWith('.jpeg') && !f.includes('.040'));
console.log(`Cover jpeg: ${coverJpeg}`);

// Build mapping from imageN to original file
const imageMapping = {};

// image1 = cover.png ← large .jpeg
imageMapping['image1'] = coverJpeg;

// image2+ = 002.png, 003.png, etc.
for (let i = 2; i <= 37; i++) {
  const paddedNum = String(i).padStart(3, '0');
  const originalFile = originalFiles.find(f => f.includes(`.${paddedNum}.png`));
  if (originalFile) {
    imageMapping[`image${i}`] = originalFile;
  }
}

console.log('\nImage mapping:');
let copied = 0;
let errors = 0;

for (const [imageKey, targetPath] of Object.entries(mapping)) {
  const targetFilename = path.basename(targetPath);
  const originalFilename = imageMapping[imageKey];

  if (!originalFilename) {
    console.log(`  ❌ ${imageKey}: No original found for ${targetFilename}`);
    errors++;
    continue;
  }

  const sourcePath = path.join(ORIGINALS_DIR, originalFilename);
  const destPath = path.join(TARGET_DIR, targetFilename);

  // Handle jpeg to png conversion for cover
  if (originalFilename.endsWith('.jpeg') && targetFilename.endsWith('.png')) {
    // Just copy with new extension - browsers handle this fine
    console.log(`  📷 ${imageKey}: ${originalFilename} → ${targetFilename} (jpeg→png rename)`);
  } else {
    console.log(`  ✅ ${imageKey}: ${originalFilename} → ${targetFilename}`);
  }

  try {
    fs.copyFileSync(sourcePath, destPath);
    copied++;
  } catch (err) {
    console.log(`  ❌ Error copying ${originalFilename}: ${err.message}`);
    errors++;
  }
}

console.log(`\nDone! Copied ${copied} files, ${errors} errors`);

// Show file size comparison for a few files
console.log('\nFile size comparison (sample):');
const samples = ['cover.png', 'ch01-chapter.png', 'ch03-general-workflow-diagram-illustrating-th.png'];
for (const sample of samples) {
  const filePath = path.join(TARGET_DIR, sample);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ${sample}: ${(stats.size / 1024).toFixed(1)} KB`);
  }
}
