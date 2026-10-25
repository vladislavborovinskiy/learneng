import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, '../content'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: { allow: ['..'] },
  },
})
