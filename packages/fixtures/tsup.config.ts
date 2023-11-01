import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'fixtures',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  sourcemap: true,
  external: ['metamask']
})
