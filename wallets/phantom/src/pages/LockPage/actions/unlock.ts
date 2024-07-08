import type { Page } from '@playwright/test'
import { lockPageElements } from "../selectors";

export const unlock = async (page: Page, password: string, close = false) => {
  console.log('close', close)
  await page.waitForLoadState('domcontentloaded')
  
  const inputField = await page.locator(lockPageElements.unlockPageElements.passwordInput)
  await inputField.fill(password)

  await page.click(lockPageElements.unlockPageElements.unlockButton);

  // if(close) {
  //   await module.exports.closePopupAndTooltips();
  // }
  
  return true;
}