import { type Page, expect } from '@playwright/test'

export async function closeSuiAndMonadIfPresent(page: Page) {
  // Wait for Phantom page to fully load
  const walletValueUsdRegExp = new RegExp('\\$[0-9].[0-9]{3,4}.*[0-9]{1,2}\\%')
  await expect(page.getByText(walletValueUsdRegExp), 'Wallet value should be visible').toBeVisible({ timeout: 10_000 })

  // Reload page to trigger Sui and/or Monad screens
  await page.reload()

  // Loop until Sui/Monad screens have been closed and Phantompage is ready for testing
  //   => 'ready for testing' = top 'fungible token' row is clickable
  await expect(async () => {
    const suiIsVisible = await page.getByRole('button', { name: 'Enable Sui' }).isVisible()

    if (suiIsVisible) {
      await page.getByRole('button', { name: 'Not Now' }).click()
    }

    const monadIsVisible = await page.getByRole('button', { name: 'Enable Monad' }).isVisible()

    if (monadIsVisible) {
      await page.getByRole('button', { name: 'Not Now' }).click()
    }

    await page.locator('[data-testid*="fungible-token-row-"]').first().click({ timeout: 3_000 })
  }).toPass()
}
