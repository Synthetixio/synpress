import type { Page } from '@playwright/test'

export async function closeSuiAndMonadIfPresent(page: Page) {
  const suiIsVisible = await page.getByRole('button', { name: 'Enable Sui' }).isVisible()

  if (suiIsVisible) {
    await page.getByRole('button', { name: 'Not Now' }).click()
  }

  const monadIsVisible = await page.getByRole('button', { name: 'Enable Monad' }).isVisible()

  if (monadIsVisible) {
    await page.getByRole('button', { name: 'Not Now' }).click()
  }
}
