import { type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import type { Networks } from '../../../../type/Networks'
import { waitFor } from '../../../utils/waitFor'

export async function importWalletFromPrivateKey(
  page: Page,
  network: Networks,
  privateKey: string,
  walletName?: string
) {
  await expect(page.locator(Selectors.accountMenu.accountButton)).toBeVisible()
  await page.locator(Selectors.accountMenu.accountButton).click()

  await expect(page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton)).toBeVisible()
  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountPrivateKeyButton).click()

  // SELECT NETWORK
  if (network !== 'solana') {
    await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.networkOpenMenu).click()
    await page
      .locator(Selectors.accountMenu.addAccountMenu.importAccountMenu[`${network}Network`])
      .first()
      .click()
  }

  await page
    .locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.nameInput)
    .fill(walletName ?? 'ImportedWallet')

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.privateKeyInput).fill(privateKey)

  const importButton = page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.importButton)

  // TODO: Extract & make configurable
  const isImportButtonEnabled = await waitFor(() => importButton.isEnabled(), 1_000, false)

  if (!isImportButtonEnabled) {
    const errorText = await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.error).textContent({
      timeout: 1_000 // TODO: Extract & make configurable
    })

    throw new Error(`[ImportWalletFromPrivateKey] Importing failed due to error: ${errorText}`)
  }

  await importButton.click()

  await expect(page.locator('[data-testid*="fungible-token-row-"]').first()).toBeVisible({ timeout: 10_000 })
}
