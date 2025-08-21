import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Set base for GitHub Pages project site
  // https://yangkclab.github.io/social-media-ds-course/
  base: '/social-media-ds-course/',
  plugins: [vue()],
})
