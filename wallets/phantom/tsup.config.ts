import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'phantom',
  entry: ['src/index.ts', 'src/playwright/index.ts', 'src/cypress/index.ts', 'src/cypress/support/index.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  treeshake: true,
  sourcemap: true,
  external: ['@playwright/test']
})
