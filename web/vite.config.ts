import { readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function preloaderFacts(): Plugin {
  const file = path.resolve(import.meta.dirname, '../content/facts.json')
  return {
    name: 'preloader-facts',
    transformIndexHtml(html) {
      const facts: { en: string; ru: string }[] = JSON.parse(readFileSync(file, 'utf8'))
      const inline = JSON.stringify(facts.map(({ en, ru }) => [en, ru])).replace(/</g, '\\u003c')
      return html.replace('__PRELOADER_FACTS__', inline)
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), preloaderFacts()],
  resolve: {
    alias: {
      '@content': path.resolve(import.meta.dirname, '../content'),
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    fs: { allow: ['..'] },
  },
})
