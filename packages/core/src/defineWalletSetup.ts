import type { BrowserContext, Page } from 'playwright-core'
import { getWalletSetupFuncHash } from './utils/getWalletSetupFuncHash'

export type WalletSetupFunction = (context: BrowserContext, walletPage: Page) => Promise<void>

// TODO: This runs at least twice. Should we cache it somehow?
export function defineWalletSetup(walletPassword: string, fn: WalletSetupFunction) {
  const hash = getWalletSetupFuncHash(fn)

  return {
    hash,
    fn,
    walletPassword
  }
}
