import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'synpress',
  entry: ['src/index.ts', 'src/cli.ts', 'src/cypress/index.ts', 'src/cypress/support.ts', 'src/playwright/index.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  treeshake: true,
  sourcemap: false
})
