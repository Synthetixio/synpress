import type { Page } from "@playwright/test";
import { homePageElements } from "../selectors";

export const changeAccount = async (page: Page, accountIndex = 1) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(homePageElements.settingsMenu.settingsMenuButton);
  await page.click(homePageElements.accountMenu.accountButton(accountIndex))
}