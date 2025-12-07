import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cpSync, existsSync, rmSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  // Set base for GitHub Pages project site
  // https://yangkclab.github.io/social-media-ds-course/
  base: '/social-media-ds-course/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  plugins: [
    vue(),
    {
      name: 'copy-versions',
      closeBundle() {
        // Copy versions directory to dist during build
        // (symlink in public/ is for dev mode only)
        const versionsSource = resolve(__dirname, '../versions')
        const versionsTarget = resolve(__dirname, 'dist/versions')

        // Remove symlink if it exists in dist
        try {
          rmSync(versionsTarget, { recursive: true, force: true })
        } catch (e) {
          // Ignore errors
        }

        if (existsSync(versionsSource)) {
          console.log('Copying versions directory to dist...')
          cpSync(versionsSource, versionsTarget, { recursive: true })
          console.log('✓ Versions copied successfully')
        } else {
          console.warn('Warning: versions directory not found')
        }
      }
    }
  ],
})
