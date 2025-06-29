import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

// TODO - .getAccountAddress() to be updated for all networks
export default async function getAccountAddress(page: Page): Promise<string> {
  // Copy account address to clipboard

  await page.locator(Selectors.accountMenu.accountButton).click()
  const activeAccount = page.locator(Selectors.accountMenu.activeAccountName)
  const accountAddress = await activeAccount.locator(Selectors.accountMenu.activeAddress).textContent()

  return accountAddress ?? ''
}
