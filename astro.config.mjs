// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync } from 'fs';
import { join } from 'path';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

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
  site: 'https://www.aichatwatch.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss(), servePublicDirectoryIndex()],
    ssr: { external: ['@resvg/resvg-js'] },
    build: { rollupOptions: { external: ['@resvg/resvg-js'] } },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] }
  },

  integrations: [sitemap(), mdx()]
});