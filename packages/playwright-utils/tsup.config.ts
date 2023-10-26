import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'playwright-utils',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  sourcemap: true
})
