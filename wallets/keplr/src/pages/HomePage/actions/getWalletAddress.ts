import type { Page } from '@playwright/test';
import { homePageElements } from '../selectors';

export const getWalletAddress = async (page: Page, wallet: string) => {
  await page.waitForLoadState('domcontentloaded');
  await page.getByText(homePageElements.copyAddress).click();
  const chain = await page.waitForSelector(homePageElements.walletSelectors(wallet));
  chain.click();
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  return clipboardText;
}