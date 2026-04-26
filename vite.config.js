import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg'],

    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'quran-api-cache',
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 60 * 60 * 24 * 7
    //           }
    //         }
    //       }
    //     ]
    //   },

    //   manifest: {
    //     name: 'Quran App',
    //     short_name: 'Quran',
    //     description: 'Digital Quran for daily life',
    //     theme_color: '#07090d',
    //     background_color: '#07090d',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     start_url: '/',
    //     icons: [
    //       {
    //         src: '/splash-quran.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/splash-quran.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
    
  ],
  base: './', // ✅ yaha hona chahiye
  // base: './', // 👈 IMPORTANT
})