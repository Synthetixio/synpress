import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'synpress',
  entry: ['src/index.ts', 'src/cli.ts'],
  outDir: 'dist',
  format: 'esm',
  splitting: false,
  sourcemap: false
})
