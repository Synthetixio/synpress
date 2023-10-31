import { z } from 'zod'
import type { WalletSetupFunction } from '../defineWalletSetup'

// TODO: Add hash length validation.
const WalletSetupModule = z.object({
  default: z.object({
    hash: z.string(),
    fn: z.function().returns(z.promise(z.void()))
  })
})

export async function importWalletSetupFile(walletSetupFilePath: string) {
  const walletSetupModule = await import(walletSetupFilePath)

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
