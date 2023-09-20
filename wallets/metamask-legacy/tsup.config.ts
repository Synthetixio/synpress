import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'metamask-legacy',
  entry: ['src'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  sourcemap: true,
  shims: true
})
