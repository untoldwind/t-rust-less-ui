import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: true })],
  root: "src",
  build: {
    emptyOutDir: false,
    outDir: "../app",
  },
  clearScreen: false,
  server: {
    host: host ?? false,
    port: 1420,
    strictPort: true,
    hmr: host
      ? {
        protocol: 'ws',
        host: host,
        port: 1430
      }
      : undefined,
    fs: {
      allow: ['.', '../node_modules']
    }
  }
})
