import path from 'node:path'
import { glob } from 'glob'
import { build } from 'tsup'
import { ensureCacheDirExists } from '../ensureCacheDirExists'

const OUT_DIR_NAME = 'wallet-setup-dist'

const createGlobPattern = (walletSetupDir: string) => path.join(walletSetupDir, '**', '*.{js,ts}')

export async function compileWalletSetupFunctions(walletSetupDir: string) {
  const outDir = path.join(ensureCacheDirExists(), OUT_DIR_NAME)

  const globPattern = createGlobPattern(walletSetupDir)

  await build({
    name: 'cli-build',
    silent: true,
    entry: await glob(globPattern),
    clean: true,
    outDir,
    format: 'esm',
    splitting: false,
    sourcemap: false,
    config: false,
    esbuildOptions(options) {
      options.drop = ['console', 'debugger']
    }
  })

  return outDir
}
