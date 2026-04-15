import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  base: '/WeatherPWA/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.svg'],
      manifest: {
        name: 'Weather PWA',
        short_name: 'Weather',
        description: 'A beautiful weather application with dynamic backgrounds',
        theme_color: '#667eea',
        background_color: '#0f0c29',
        display: 'standalone',
        icons: [
          {
            src: 'icons/app/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/app/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})