import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default ({ mode }) => {
  // Charger les variables d'environnement au niveau de l'application dans les variables d'environnement au niveau de Node.
  const env = loadEnv(mode, process.cwd())
  process.env = { ...process.env, ...env }

  return defineConfig({
    plugins: [react(), VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Stramatel',
        short_name: 'Stramatel',
        description: 'Your app description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    })],
    server: {
      port: parseInt(process.env.FRONT_PORT, 10) || 3000,
    },
    define: {
      'process.env': process.env
    }
  })
}
