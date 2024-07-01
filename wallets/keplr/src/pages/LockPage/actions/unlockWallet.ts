import type { Page } from '@playwright/test'
import { onboardingElements } from '../selectors'

export async function unlockWallet(page: Page, password: string) {
  await page.waitForLoadState('domcontentloaded')
  const passwordField = page.locator(onboardingElements.unlockPasswordInput)
  await passwordField.fill(password)
  const button = await page.$(onboardingElements.unlockConfirmPasswordInput)
  button?.click()
  return true
}
