import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'metamask-legacy',
  entry: ['src/index.js'],
  outDir: 'dist',
  format: 'cjs',
  cjsInterop: true,
  splitting: false,
  sourcemap: true
})
