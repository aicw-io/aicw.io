/**
 * Script to add watermark text directly to book images
 * Embeds watermark at bottom of each PNG so it persists when downloaded
 *
 * Usage:
 *   node script/watermark-images.cjs           # Apply watermarks
 *   node script/watermark-images.cjs --restore # Restore from backup (remove watermarks)
 *
 * Backup originals are stored in: _backup/book-images-original/
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/assets/book/ai-seo-guide/images');
const BACKUP_DIR = path.join(__dirname, '../_backup/book-images-original');
const WATERMARK_TEXT = "Illustration from 'AI Search Engine Optimization Guide' book. AI Chat Watch / www.AICW.io";

async function addWatermark(imagePath) {
  const filename = path.basename(imagePath);

  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    const { width, height } = metadata;

    // Skip very small images (likely icons or thumbnails)
    if (width < 200 || height < 100) {
      console.log(`  Skipping ${filename} (too small: ${width}x${height})`);
      return false;
    }

    // Calculate font size based on image width (responsive)
    const fontSize = Math.max(12, Math.min(18, Math.floor(width / 60)));
    const padding = 12;
    const barHeight = fontSize + padding * 2;

    // Create watermark bar SVG
    const watermarkSvg = `
      <svg width="${width}" height="${barHeight}">
        <rect x="0" y="0" width="${width}" height="${barHeight}" fill="rgba(0,0,0,0.6)"/>
        <text
          x="${width / 2}"
          y="${barHeight / 2 + fontSize / 3}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${fontSize}"
          fill="rgba(255,255,255,0.85)"
          text-anchor="middle"
        >${WATERMARK_TEXT}</text>
      </svg>
    `;

    // Create the watermark overlay
    const watermarkBuffer = Buffer.from(watermarkSvg);

    // Composite the watermark at the bottom of the image
    const outputBuffer = await sharp(imagePath)
      .composite([{
        input: watermarkBuffer,
        top: height - barHeight,
        left: 0
      }])
      .png()
      .toBuffer();

    // Write back to the same file
    fs.writeFileSync(imagePath, outputBuffer);
    console.log(`  Watermarked: ${filename} (${width}x${height})`);
    return true;

  } catch (error) {
    console.error(`  Error processing ${filename}:`, error.message);
    return false;
  }
}

function restoreFromBackup() {
  console.log('Restoring original images from backup...\n');
  console.log(`Backup dir: ${BACKUP_DIR}`);
  console.log(`Target dir: ${IMAGES_DIR}\n`);

  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('Error: Backup directory does not exist!');
    console.error('Run the watermark script first to create backups.');
    process.exit(1);
  }

  const backupFiles = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.toLowerCase().endsWith('.png'));

  console.log(`Found ${backupFiles.length} backup files:\n`);

  let restored = 0;
  for (const file of backupFiles) {
    const src = path.join(BACKUP_DIR, file);
    const dest = path.join(IMAGES_DIR, file);
    fs.copyFileSync(src, dest);
    console.log(`  Restored: ${file}`);
    restored++;
  }

  console.log(`\nDone! Restored ${restored} images.`);
}

async function createBackup() {
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`Created backup directory: ${BACKUP_DIR}\n`);
  }

  // Get all PNG files
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.toLowerCase().endsWith('.png'));

  console.log(`Backing up ${files.length} original images...\n`);

  for (const file of files) {
    const src = path.join(IMAGES_DIR, file);
    const dest = path.join(BACKUP_DIR, file);

    // Only backup if not already exists (don't overwrite backups)
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`  Backed up: ${file}`);
    } else {
      console.log(`  Skipped (exists): ${file}`);
    }
  }
}

async function applyWatermarks() {
  console.log('Adding watermarks to book images...\n');
  console.log(`Source: ${IMAGES_DIR}`);
  console.log(`Watermark: "${WATERMARK_TEXT}"\n`);

  // Get all PNG files
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.toLowerCase().endsWith('.png'))
    .map(f => path.join(IMAGES_DIR, f));

  console.log(`Found ${files.length} PNG files to process:\n`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const result = await addWatermark(file);
    if (result === true) processed++;
    else if (result === false) skipped++;
    else errors++;
  }

  console.log(`\nDone!`);
  console.log(`  Watermarked: ${processed} images`);
  console.log(`  Skipped: ${skipped} images`);
  if (errors > 0) console.log(`  Errors: ${errors} images`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--restore')) {
    restoreFromBackup();
  } else if (args.includes('--backup-only')) {
    await createBackup();
    console.log('\nBackup complete. Run without --backup-only to apply watermarks.');
  } else {
    // Normal flow: backup first (if needed), then apply watermarks
    if (!fs.existsSync(BACKUP_DIR) || fs.readdirSync(BACKUP_DIR).length === 0) {
      console.log('Creating backup of original images first...\n');
      await createBackup();
      console.log('\n---\n');
    }
    await applyWatermarks();
  }
}

main().catch(console.error);
