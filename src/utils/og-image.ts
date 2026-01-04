import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { blogTemplate, guideTemplate, type OgImageOptions } from './og-templates';

// Cache the font to avoid reloading
let fontCache: ArrayBuffer | null = null;

function getFont(): ArrayBuffer {
  if (!fontCache) {
    // In Astro, process.cwd() is the project root during both dev and build
    // The public folder contents are available directly
    const fontPath = join(process.cwd(), 'public', 'fonts', 'Inter-Bold.ttf');
    const fontBuffer = readFileSync(fontPath);
    fontCache = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
  }
  return fontCache;
}

export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const font = getFont();

  // Select template based on content type
  const template = options.type === 'blog'
    ? blogTemplate(options)
    : guideTemplate(options);

  // Generate SVG using Satori
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // Convert SVG to PNG using resvg
  const resvg = new Resvg(svg, {
    background: 'rgba(0, 0, 0, 0)',
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

export type { OgImageOptions };
