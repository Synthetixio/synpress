import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { waitFor } from '../../../utils/waitFor'

export async function importWalletFromPrivateKey(page: Page, privateKey: string) {
  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()
  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.privateKeyInput).fill(privateKey)

  const importButton = page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.importButton)
  await importButton.click()

  // TODO: Extract & make configurable
  const isImportButtonHidden = await waitFor(() => importButton.isHidden(), 1_000, false)

  if (!isImportButtonHidden) {
    const errorText = await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.error).textContent({
      timeout: 1_000 // TODO: Extract & make configurable
    })

    throw new Error(`[ImportWalletFromPrivateKey] Importing failed due to error: ${errorText}`)
  }
}
