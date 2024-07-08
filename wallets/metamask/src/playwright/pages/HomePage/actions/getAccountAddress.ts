import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export default async function getAccountAddress(page: Page): Promise<string> {
  await page.locator(Selectors.threeDotsMenu.threeDotsButton).click()
  await page.locator(Selectors.threeDotsMenu.accountDetailsButton).click()

  const account = await page.locator(Selectors.copyAccountAddressButton).last().innerText()

  await page.locator(Selectors.threeDotsMenu.accountDetailsCloseButton).click()

  return account
}
