import { defineConfig } from 'vite';
import { cpSync, existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve } from 'path';

function pwaFixPlugin() {
  return {
    name: 'pwa-fix',
    closeBundle() {
      const dist = resolve('dist');
      const appDir = resolve('app');
      // 1) copy PWA assets unhashed to dist root
      try {
        cpSync(resolve(appDir, 'sw.js'), resolve(dist, 'sw.js'), { force: true });
        cpSync(resolve(appDir, 'manifest.json'), resolve(dist, 'manifest.json'), { force: true });
        cpSync(resolve(appDir, 'icons'), resolve(dist, 'icons'), { recursive: true, force: true });
        if (existsSync(resolve(appDir, 'data'))) {
          cpSync(resolve(appDir, 'data'), resolve(dist, 'data'), { recursive: true, force: true });
        }
        if (existsSync(resolve(appDir, '_headers'))) {
          cpSync(resolve(appDir, '_headers'), resolve(dist, '_headers'), { force: true });
          console.log('[pwa-fix] copied _headers');
        }
        console.log('[pwa-fix] copied sw.js, manifest.json, icons, data to dist/');
      } catch (e) {
        console.warn('[pwa-fix] copy failed', e);
      }
      // 2) fix dist/index.html: replace hashed manifest link with /manifest.json and ensure icons use /icons/
      try {
        const indexPath = resolve(dist, 'index.html');
        let html = readFileSync(indexPath, 'utf-8');
        const origLen = html.length;
        // Replace <link rel="manifest" href="/assets/manifest-*.json"> -> /manifest.json
        html = html.replace(/<link rel="manifest"[^>]*>/, '<link rel="manifest" href="/manifest.json">');
        // Ensure apple-touch-icon and favicon point to /icons/ (not /assets/...)
        html = html.replace(/href="\/assets\/icon-180[^"]*"/g, 'href="/icons/icon-180.png"');
        html = html.replace(/href="\/assets\/icon-192[^"]*"/g, 'href="/icons/icon-192.png"');
        html = html.replace(/href="\/assets\/icon-32[^"]*"/g, 'href="/icons/icon-32.png"');
        html = html.replace(/href="\/assets\/icon-512[^"]*"/g, 'href="/icons/icon-512.png"');
        // Remove hashed manifest asset leftover if needed (keep file but not referenced)
        writeFileSync(indexPath, html, 'utf-8');
        console.log(`[pwa-fix] fixed index.html manifest link (${origLen} -> ${html.length})`);
        // 3) cleanup hashed manifest in assets (optional keep)
        const assetsDir = resolve(dist, 'assets');
        if (existsSync(assetsDir)) {
          for (const f of readdirSync(assetsDir)) {
            if (f.startsWith('manifest-') && f.endsWith('.json')) {
              // keep for fallback but log
              console.log(`[pwa-fix] hashed manifest leftover: assets/${f} (now using /manifest.json)`);
            }
          }
        }
      } catch (e) {
        console.warn('[pwa-fix] index.html fix failed', e);
      }
    }
  };
}

export default defineConfig({
  root: 'app',
  publicDir: false,
  server: {
    fs: { allow: ['..'] }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'app/index.html'
    }
  },
  plugins: [pwaFixPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  }
});
