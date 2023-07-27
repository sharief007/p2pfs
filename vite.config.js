import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const vuePlugin = vue()
const pwaPlugin = VitePWA({
  registerType: 'autoUpdate'
})

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vuePlugin, pwaPlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
