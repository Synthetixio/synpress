import type { Page } from '@playwright/test'
import { waitForSpinnerToVanish } from '../../../utils/waitForSpinnerToVanish'
import Selectors from '../selectors'

export async function unlock(page: Page, password: string) {
  await page.locator(Selectors.passwordInput).fill(password)
  await page.locator(Selectors.submitButton).click()

  await waitForSpinnerToVanish(page)
}
