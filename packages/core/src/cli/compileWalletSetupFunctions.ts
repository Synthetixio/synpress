import path from 'node:path'
import { glob } from 'glob'
import { build } from 'tsup'
import { ensureCacheDirExists } from '../ensureCacheDirExists'
import { FIXES_BANNER } from './compilationFixes'

const OUT_DIR_NAME = 'wallet-setup-dist'

const createGlobPattern = (walletSetupDir: string) => path.join(walletSetupDir, '**', '*.{js,ts}')

export async function compileWalletSetupFunctions(walletSetupDir: string, debug: boolean) {
  const outDir = path.join(ensureCacheDirExists(), OUT_DIR_NAME)

  const globPattern = createGlobPattern(walletSetupDir)

  await build({
    name: 'cli-build',
    silent: true,
    entry: await glob(globPattern),
    clean: true,
    outDir,
    format: 'esm',
    splitting: true,
    sourcemap: false,
    config: false,
    external: ['@playwright/test'],
    banner: {
      js: FIXES_BANNER
    },
    esbuildOptions(options) {
      options.drop = debug ? [] : ['console', 'debugger']
    }
  })

  return outDir
}
