import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },

      includeAssets: [
        'favicon.ico',
        'icons/icon-192.png',
        'icons/icon-512.png'
      ],

      manifest: {
        name: 'CGPA Calculator',
        short_name: 'CGPA Calc',
        description: 'CGPA Calculator Progressive Web App',
        theme_color: 'white',
        background_color: 'white',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: "/"
});
