import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
export default ({ mode }) => {
  // Charger les variables d'environnement au niveau de l'application dans les variables d'environnement au niveau de Node.
  const env = loadEnv(mode, process.cwd())
  process.env = { ...process.env, ...env }

return defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PREVIEW_PORT || 2000,
  },
  define: {
      'process.env': process.env
    }
})

}
