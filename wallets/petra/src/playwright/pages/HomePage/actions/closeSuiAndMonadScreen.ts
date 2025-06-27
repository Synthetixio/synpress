import { type Page, expect } from '@playwright/test'

export async function closeSuiAndMonadIfPresent(page: Page) {
  // Wait for Phantom page to fully load
  const walletValueUsdRegExp = new RegExp('\\$.*[0-9].[0-9]{1,2}.*[0-9]{1,2}\\%')
  await expect(page.getByText(walletValueUsdRegExp), 'Wallet value should be visible').toBeVisible({ timeout: 15_000 })

  // Reload page to trigger Sui and/or Monad screens
  await page.reload()

  // Wait for Phantom page to fully load
  await expect(page.getByText(walletValueUsdRegExp), 'Wallet value should be visible').toBeVisible({ timeout: 15_000 })

  // Wait for Sui / Monad screen to load (if it does)
  await page.waitForTimeout(2_000)

  const suiIsVisible = await page.getByRole('button', { name: 'Enable Sui' }).isVisible()

  if (suiIsVisible) {
    await page.getByRole('button', { name: 'Not Now' }).click()
    // Wait for Nomad page to load (if it does)
    await page.waitForTimeout(1_000)
  }

  const monadIsVisible = await page.getByRole('button', { name: 'Enable Monad' }).isVisible()

  if (monadIsVisible) {
    await page.getByRole('button', { name: 'Not Now' }).click()
  }
}
