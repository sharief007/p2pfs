import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/p2pfs/",
  plugins: [
    vue(),
    VitePWA({ 
      includeAssets: ['favicon.ico', 'icon.png'],
      manifest: {
        name: 'Peer to Peer File Sharing',
        short_name: 'p2pfs',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '360x360',
            type: 'image/png'
          }
        ]
      } 
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
