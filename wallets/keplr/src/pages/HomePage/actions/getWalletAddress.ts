import type { Page } from '@playwright/test';
import { homePageElements } from '../selectors';

export const getWalletAddress = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  console.log(3)
  const newTokensFoundSelector = await page.waitForSelector(homePageElements.newTokensFoundSelector);
  console.log('New tokens found', newTokensFoundSelector);
  if (newTokensFoundSelector) {
    await page.waitForSelector(homePageElements.newTokensFoundSelector);
  }
  await page.waitForSelector(homePageElements.copyAddress);
  const walletAddress = await page.click(homePageElements.copyAddress);
  console.log('Wallet address copied', walletAddress);
  return walletAddress;
}