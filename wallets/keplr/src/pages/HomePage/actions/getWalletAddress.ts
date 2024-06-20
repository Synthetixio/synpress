import type { Page } from '@playwright/test'
import clipboardy from 'clipboardy'
import { homePageElements } from '../selectors'

export const getWalletAddress = async (page: Page, wallet: string) => {
  await page.waitForLoadState('domcontentloaded')
  await page.getByText(homePageElements.copyAddress).click()
  const chain = await page.waitForSelector(homePageElements.walletSelectors(wallet))
  await chain.click()
  const address = clipboardy.readSync()
  return address;
}
