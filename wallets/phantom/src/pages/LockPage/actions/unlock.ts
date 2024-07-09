import type { Page } from '@playwright/test'
import { closePopupAndTooltips } from '../../HomePage/actions/closePopupAndTooltips'
import { lockPageElements } from '../selectors'

export const unlock = async (page: Page, extensionId: string, password: string, close = false) => {
  await page.waitForLoadState('domcontentloaded')

  const inputField = await page.locator(lockPageElements.unlockPageElements.passwordInput)
  await inputField.fill(password)

  await page.click(lockPageElements.unlockPageElements.unlockButton)

  if (close) {
    await closePopupAndTooltips(page, extensionId)
  }

  return true
}
