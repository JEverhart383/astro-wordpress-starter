import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.IS_GUTENBERG_PLUGIN': "false"
  }
})