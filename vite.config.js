import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [],
      manifest: {
        name: 'Election Voice Assistant',
        short_name: 'VoteSense',
        description: 'NLP based Election Assistant',
        theme_color: '#FF9933',
        background_color: '#FFFFFF'
      }
    })
  ],
})
