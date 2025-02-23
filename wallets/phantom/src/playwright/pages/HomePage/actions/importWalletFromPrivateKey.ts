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
  const extensionUrl = page.url()

  await page.goto(extensionUrl.replace('onboarding', 'popup'))

  await expect(page.getByRole('button', { name: 'Enable Sui' })).toBeVisible()
  await page.getByRole('button', { name: 'Not Now' }).click()

  await expect(page.getByRole('button', { name: 'Enable Monad' })).toBeVisible()
  await page.getByRole('button', { name: 'Not Now' }).click()

  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountPrivateKeyButton).click()

  // SELECT NETWORK
  if (network !== 'solana') {
    await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.networkOpenMenu).click()
    await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu[`${network}Network`]).click()
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
}
