import { type Page, expect } from '@playwright/test'
import type { Petra } from '../../../src/playwright'

export const solanaSandboxSetup = async (page: Page, phantom: Petra) => {
  await phantom.page.waitForTimeout(1_000)
  await phantom.importWalletFromPrivateKey(
    'aptos',
    'XQaKFLLSKbzpVzmfJrj4yUjAyFy2Eu7JcNdbPdnLuod2Uw3yf3tjGd4ha1DBfFdjkZFX1PZg3knth2Tz2tvd8C4'
  )

  await phantom.toggleTestnetMode()

  await page.goto('https://r3byv.csb.app/')
  await page.locator('a:has-text("Yes, proceed to preview")').click()
  await page.getByRole('button', { name: 'Connect to Phantom' }).click()

  await phantom.connectToDapp()

  await page.getByRole('button', { name: 'Clear Logs' }).click()

  await expect(page.getByText('Click a button and watch magic happen...')).toBeVisible()
}
