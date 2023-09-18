import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'greetings',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  sourcemap: true,
})