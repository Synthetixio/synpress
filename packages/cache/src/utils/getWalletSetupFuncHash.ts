import { createHash } from 'node:crypto'
import esbuild from 'esbuild'

// Same length as the file part (first part before the `-`) of a Playwright Test ID.
export const WALLET_SETUP_FUNC_HASH_LENGTH = 10

// biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
type AnyFunction = (...args: any) => Promise<any>

export function getWalletSetupFuncHash(walletSetupFunc: AnyFunction) {
  // This transformation is necessary because a user could end up using a different execution engine than Playwright.
  // Different execution engines -> different codes -> different hashes.
  const { code } = esbuild.transformSync(walletSetupFunc.toString(), {
    format: 'esm',
    minifyWhitespace: true,
    drop: ['console', 'debugger'],
    loader: 'ts',
    logLevel: 'silent'
  })

  const hash = createHash('shake256', {
    outputLength: WALLET_SETUP_FUNC_HASH_LENGTH
  })

  return hash.update(code).digest('hex')
}
