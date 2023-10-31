import path from 'node:path'
import * as tsImport from 'ts-import'
import { z } from 'zod'
import type { WalletSetupFunction } from '../defineWalletSetup'
import { ensureCacheDirExists } from '../ensureCacheDirExists'

// TODO: Add hash length validation.
const WalletSetupModule = z.object({
  default: z.object({
    hash: z.string(),
    fn: z.function().returns(z.promise(z.void()))
  })
})

const TS_IMPORT_CACHE_DIR = path.join(ensureCacheDirExists(), '.cache-ts-import')

export async function importWalletSetupFile(walletSetupFilePath: string) {
  // TODO: We should write our version of `ts-import` that utilizes the same logic as `getWalletSetupFuncHash`.
  // Note: This might not work correctly on Windows!
  const walletSetupModule = await tsImport.load(walletSetupFilePath, {
    useCache: false, // TODO: This option does not work :(
    transpileOptions: {
      cache: {
        dir: TS_IMPORT_CACHE_DIR
      }
    }
  })

  const result = WalletSetupModule.safeParse(walletSetupModule)
  if (!result.success) {
    throw new Error(
      [
        `[ImportWalletSetupFile] Invalid wallet setup function at ${walletSetupFilePath}`,
        'Remember that all wallet setup files must export the wallet setup function as a default export!'
      ].join('\n')
    )
  }

  const { hash, fn } = result.data.default

  // TODO: Can we somehow validate this function type with Zod?
  return {
    hash,
    fn: fn as WalletSetupFunction
  }
}
