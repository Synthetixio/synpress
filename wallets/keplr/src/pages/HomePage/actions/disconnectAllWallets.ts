import type { Page } from '@playwright/test'

export const disconnectWalletFromDapps = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  const disconnectButton = await page.waitForSelector('text=Disconnect All')
  const isDisabled = await disconnectButton.isDisabled()
  if (isDisabled) return false
  await disconnectButton.click()
  return true
}
