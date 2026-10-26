/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { siteBasePath } from './site.config'

export default defineConfig(({ mode }) => ({
  plugins: [solid({ hot: mode !== 'test' })],
  base: siteBasePath,
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
}))
