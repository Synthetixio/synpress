import type { Page } from '@playwright/test'
import { MetaMask } from '..'

export async function importForFixtures(page: Page, seedPhrase: string, password: string, extensionId: string) {
  const metamask = new MetaMask(page.context(), page, password, extensionId)

  await metamask.importWallet(seedPhrase)
}
