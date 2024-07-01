import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv(mode, process.cwd())
process.env = { ...process.env, ...env }

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PREVIEW_PORT || 2000,
  },
})
