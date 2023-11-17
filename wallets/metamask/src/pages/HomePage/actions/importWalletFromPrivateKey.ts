import type { Page } from '@playwright/test'
import { waitFor } from '../../../utils/waitFor'
import Selectors from '../selectors'

export async function importWalletFromPrivateKey(page: Page, privateKey: string) {
  await page.locator(Selectors.accountMenu.accountMenuButton).click()
  await page.locator(Selectors.accountMenu.importAccountButton).click()
  await page.locator(Selectors.importAccountScreen.privateKeyInput).fill(privateKey)

  const importButton = page.locator(Selectors.importAccountScreen.importButton)
  await importButton.click()

  // TODO: Extract & make configurable
  const isHidden = await waitFor(importButton, 'hidden', 1000, false)

  if (!isHidden) {
    const errorText = await page.locator(Selectors.importAccountScreen.error).textContent({
      timeout: 1000 // TODO: Extract & make configurable
    })

    throw new Error(`[ImportWalletFromPrivateKey] Importing failed due to error: ${errorText}`)
  }
}
