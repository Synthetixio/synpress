import type { Page } from '@playwright/test'
import { homePageElements } from '../selectors'

export const addNewTokensFound = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  const newTokensFound = await page.getByText(homePageElements.newTokensFound)
  const isNewTokens = (await newTokensFound.count()) > 0
  if (!isNewTokens) {
    return 'No new tokens found'
  }
  await page.click(homePageElements.newTokensFound)
  const newTokens = await page.$$(homePageElements.selectAllTokensCheckbox)
  for (const token of newTokens) {
    await token.click()
  }

  await page.click(homePageElements.addChainsButton)
  return 'New tokens added'
}
