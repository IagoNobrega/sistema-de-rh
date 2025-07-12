import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url' // Add this import

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Use import.meta.url and fileURLToPath to get the directory name
      "@": path.resolve(fileURLToPath(import.meta.url), "../src"), // Corrected path
    },
  },
})