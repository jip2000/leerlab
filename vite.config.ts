/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // './' zodat de site ook werkt in een submap, zoals GitHub Pages (/leerlab/).
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // Offline werken: een service worker bewaart de hele site in de browser.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // we gebruiken public/manifest.webmanifest
      includeAssets: ['favicon.svg', 'icons/*.png', 'manifest.webmanifest'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Tekstherkenning: programma en taalpakketten na de eerste keer ook offline.
            urlPattern: ({ url }) => url.hostname === 'cdn.jsdelivr.net',
            handler: 'CacheFirst',
            options: { cacheName: 'tekstherkenning', expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 180 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'i.ytimg.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'video-plaatjes', expiration: { maxEntries: 100 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    environment: 'node',
  },
});
