import { createHash } from 'node:crypto'

// Same length as the file part (first part before the `-`) of a Playwright Test ID.
export const WALLET_SETUP_FUNC_HASH_LENGTH = 10

export function getWalletSetupFuncHash(walletSetupString: string) {
  const hash = createHash('shake256', {
    outputLength: WALLET_SETUP_FUNC_HASH_LENGTH
  })

  return hash.update(walletSetupString).digest('hex')
}
