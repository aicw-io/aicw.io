/**
 * PNG Image Optimization Script
 * Resizes oversized images and applies lossless PNG compression
 *
 * Usage:
 *   node script/optimize-images.cjs <folder> [options]
 *
 * Options:
 *   --dry-run       Preview changes without modifying files
 *   --max-width=N   Max width for content images (default: 1600)
 *   --cover-width=N Max width for cover images (default: 800)
 *
 * Examples:
 *   node script/optimize-images.cjs public/assets/book/ai-seo-guide/images --dry-run
 *   node script/optimize-images.cjs public/assets/book/ai-seo-guide/images
 *   node script/optimize-images.cjs public/some-folder --max-width=1200
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    folder: null,
    dryRun: false,
    maxWidth: 1600,
    coverWidth: 800,
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg.startsWith('--max-width=')) {
      options.maxWidth = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--cover-width=')) {
      options.coverWidth = parseInt(arg.split('=')[1], 10);
    } else if (!arg.startsWith('--')) {
      options.folder = arg;
    }
  }

  return options;
}

// Check if file is a cover image
function isCoverImage(filename) {
  const lower = filename.toLowerCase();
  return lower.includes('cover') || lower.startsWith('cover');
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// Optimize a single image
async function optimizeImage(filePath, options) {
  const filename = path.basename(filePath);
  const originalSize = fs.statSync(filePath).size;

  try {
    const metadata = await sharp(filePath).metadata();
    const maxWidth = isCoverImage(filename) ? options.coverWidth : options.maxWidth;
    // Only resize if significantly oversized (>10% over max)
    const needsResize = metadata.width > maxWidth * 1.1;

    if (options.dryRun) {
      // Dry run - create temp file to measure
      const tempPath = path.join('/tmp', 'opt-' + filename);

      let pipeline = sharp(filePath);
      if (needsResize) {
        pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
      }
      await pipeline.png({ compressionLevel: 9 }).toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;
      fs.unlinkSync(tempPath);

      // Only report as savings if actually smaller
      const actualSaved = newSize < originalSize ? originalSize - newSize : 0;
      const wouldApply = newSize < originalSize;

      return {
        filename,
        originalSize,
        newSize: wouldApply ? newSize : originalSize,
        originalWidth: metadata.width,
        newWidth: needsResize ? maxWidth : metadata.width,
        resized: needsResize && wouldApply,
        saved: actualSaved,
        skipped: !wouldApply,
      };
    } else {
      // Actual optimization
      const tempPath = filePath + '.tmp';

      let pipeline = sharp(filePath);
      if (needsResize) {
        pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
      }
      await pipeline.png({ compressionLevel: 9 }).toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;

      // Only replace if smaller
      if (newSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        return {
          filename,
          originalSize,
          newSize,
          originalWidth: metadata.width,
          newWidth: needsResize ? maxWidth : metadata.width,
          resized: needsResize,
          saved: originalSize - newSize,
          skipped: false,
        };
      } else {
        // Keep original
        fs.unlinkSync(tempPath);
        return {
          filename,
          originalSize,
          newSize: originalSize,
          originalWidth: metadata.width,
          newWidth: metadata.width,
          resized: false,
          saved: 0,
          skipped: true,
        };
      }
    }
  } catch (error) {
    console.error(`  Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  const options = parseArgs();

  if (!options.folder) {
    console.log('Usage: node script/optimize-images.cjs <folder> [--dry-run] [--max-width=N]');
    console.log('');
    console.log('Examples:');
    console.log('  node script/optimize-images.cjs public/assets/book/ai-seo-guide/images --dry-run');
    console.log('  node script/optimize-images.cjs public/assets/book/ai-seo-guide/images');
    process.exit(1);
  }

  const folder = path.resolve(options.folder);

  if (!fs.existsSync(folder)) {
    console.error(`Error: Folder not found: ${folder}`);
    process.exit(1);
  }

  // Find all PNG files
  const files = fs.readdirSync(folder)
    .filter(f => f.toLowerCase().endsWith('.png'))
    .map(f => path.join(folder, f));

  if (files.length === 0) {
    console.log('No PNG files found in', folder);
    process.exit(0);
  }

  console.log(options.dryRun ? 'DRY RUN - No files will be modified' : 'OPTIMIZING IMAGES');
  console.log('='.repeat(80));
  console.log(`Folder: ${folder}`);
  console.log(`Files: ${files.length} PNG images`);
  console.log(`Max width: ${options.maxWidth}px (cover: ${options.coverWidth}px)`);
  console.log('');

  let totalOriginal = 0;
  let totalNew = 0;
  let resizedCount = 0;
  let skippedCount = 0;

  const results = [];

  for (const file of files) {
    const result = await optimizeImage(file, options);
    if (result) {
      results.push(result);
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      if (result.resized) resizedCount++;
      if (result.skipped) skippedCount++;
    }
  }

  // Sort by savings (highest first)
  results.sort((a, b) => b.saved - a.saved);

  // Print results - only show files with changes
  console.log('Results (files with savings):');
  console.log('-'.repeat(80));

  for (const r of results) {
    if (r.saved <= 0) continue; // Skip files with no savings

    const savePct = ((r.saved / r.originalSize) * 100).toFixed(0);
    const resize = r.resized ? ` [${r.originalWidth}→${r.newWidth}px]` : '';

    console.log(
      r.filename.substring(0, 45).padEnd(47) +
      formatBytes(r.originalSize).padStart(8) + ' → ' +
      formatBytes(r.newSize).padStart(7) + '  ' +
      `(${formatBytes(r.saved)} saved, ${savePct}%)` + resize
    );
  }

  if (skippedCount > 0) {
    console.log('');
    console.log(`(${skippedCount} files skipped - optimization would increase size)`);
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY:');
  console.log(`  Files processed: ${results.length}`);
  console.log(`  Files optimized: ${results.length - skippedCount}`);
  console.log(`  Files skipped: ${skippedCount}`);
  console.log(`  Before: ${formatBytes(totalOriginal)}`);
  console.log(`  After:  ${formatBytes(totalNew)}`);
  console.log(`  Saved:  ${formatBytes(totalOriginal - totalNew)} (${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%)`);

  if (options.dryRun) {
    console.log('');
    console.log('This was a dry run. Run without --dry-run to apply changes.');
  }
}

main().catch(console.error);
