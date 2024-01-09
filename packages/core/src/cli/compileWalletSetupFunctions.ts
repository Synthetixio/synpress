import path from 'node:path'
import { glob } from 'glob'
import { build } from 'tsup'
import { ensureCacheDirExists } from '../ensureCacheDirExists'
import { FIXES_BANNER } from './compilationFixes'

const OUT_DIR_NAME = 'wallet-setup-dist'

const createGlobPattern = (walletSetupDir: string) => path.join(walletSetupDir, '**', '*.setup.{js,ts}')

export async function compileWalletSetupFunctions(walletSetupDir: string, debug: boolean) {
  const outDir = path.join(ensureCacheDirExists(), OUT_DIR_NAME)

  const globPattern = createGlobPattern(walletSetupDir)
  const fileList = await glob(globPattern)

  if (debug) {
    console.log('[DEBUG] Found the following wallet setup files:')
    console.log(fileList, '\n')
  }

  // TODO: This error message is copied over from another function. Refactor this.
  if (!fileList.length) {
    throw new Error(
      [
        `No wallet setup files found at ${walletSetupDir}`,
        'Remember that all wallet setup files must end with `.setup.{js,ts}` extension!'
      ].join('\n')
    )
  }

  // TODO: In this step, modify `console.log` so it prints from which file the log is coming from.
  await build({
    name: 'cli-build',
    silent: true,
    entry: fileList,
    clean: true,
    outDir,
    format: 'esm',
    splitting: true,
    sourcemap: false,
    config: false,
    // TODO: Make this list configurable.
    external: ['@synthetixio/synpress', '@playwright/test', 'playwright-core', 'esbuild', 'tsup'],
    banner: {
      js: FIXES_BANNER
    }
  })

  return outDir
}
