import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/UnlockPage'

export async function unlock(page: Page, password: string) {
  await page.locator(Selectors.passwordInput).fill(password)
  await page.locator(Selectors.submitButton).click()
}
