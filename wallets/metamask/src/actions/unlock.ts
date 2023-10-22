import type { Page } from '@playwright/test'
import { UnlockPageSelectors } from '../selectors'
import { waitForSpinnerToVanish } from '../utils/waitForSpinnerToVanish'

export async function unlock(page: Page, password: string) {
  await page.locator(UnlockPageSelectors.passwordInput).fill(password)
  await page.locator(UnlockPageSelectors.submitButton).click()

  await waitForSpinnerToVanish(page)
}
