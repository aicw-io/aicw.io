// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Safe redirects loader - won't break build if file is missing/invalid
function loadRedirects() {
  const redirectsPath = './redirects.json';
  try {
    if (!existsSync(redirectsPath)) {
      console.warn('⚠️  redirects.json not found, skipping redirects');
      return {};
    }
    const content = readFileSync(redirectsPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Validate it's an object
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.warn('⚠️  redirects.json must be an object, skipping redirects');
      return {};
    }

    console.log(`✓ Loaded ${Object.keys(parsed).length} redirect(s)`);
    return parsed;
  } catch (error) {
    console.warn(`⚠️  Error loading redirects.json: ${error.message}`);
    return {};
  }
}

const redirects = loadRedirects();

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// Vite plugin to serve index.html for directories in public/
function servePublicDirectoryIndex() {
  return {
    name: 'serve-public-directory-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        // Check if URL ends with / and might be a directory in public/
        if (url.endsWith('/') && url !== '/') {
          // Decode URL-encoded characters (e.g., %20 -> space)
          const decodedUrl = decodeURIComponent(url);
          const publicPath = join(process.cwd(), 'public', decodedUrl, 'index.html');
          if (existsSync(publicPath)) {
            req.url = url + 'index.html';
          }
        }
        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://aicw.io',
  trailingSlash: 'always',
  redirects,
  vite: {
    plugins: [tailwindcss(), servePublicDirectoryIndex()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    ssr: { external: ['@resvg/resvg-js'] },
    build: { rollupOptions: { external: ['@resvg/resvg-js'] } },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] }
  },

  integrations: [sitemap(), mdx(), react()]
});