import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { editorCvProject } from './scripts/lib/project-api.mjs'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    editorCvProject(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
