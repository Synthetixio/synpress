import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import type { Networks } from '../../../../type/Networks'

// TODO - .getAccountAddress() to be updated for all networks
export default async function getAccountAddress(network: Networks, page: Page): Promise<string> {
  // Copy account address to clipboard
  await page.locator(Selectors.accountMenu.accountName).hover()
  await page
    .locator(Selectors[`${network}WalletAddress`])
    .first()
    .click()

  // Get clipboard content
  const handle = await page.evaluateHandle(() => navigator.clipboard.readText())
  const account = await handle.jsonValue()

  return account
}
