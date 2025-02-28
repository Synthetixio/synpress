import { type Page, expect } from '@playwright/test'
import type { Phantom } from '../../../src/playwright'

export const aaveSetup = async (page: Page, phantom: Phantom) => {
  await page.goto('https://app.aave.com')

  await phantom.toggleTestnetMode()

  await page.locator('button#settings-button').click()
  await page.locator('li:has-text("Testnet mode")').click()
  await expect(page.getByRole('button', { name: 'TESTNET' })).toBeVisible()

  await page.getByRole('button', { name: 'Connect wallet' }).first().click()
  await page.getByRole('button', { name: 'Phantom' }).click()

  await phantom.connectToDapp()
  await phantom.page.waitForTimeout(1_000)
  await phantom.closeUnsupportedNetworkWarning()

  await expect(page.getByText('0xf3...2266'), '"0xf3...2266" should be visible').toBeVisible()

  await page.goto(
    'https://app.aave.com/reserve-overview/?underlyingAsset=0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357&marketName=proto_sepolia_v3'
  )

  await page.getByRole('button', { name: 'Supply' }).click()
  await page.locator('input[aria-label="amount input"]').fill('1')

  await expect(
    page.getByRole('button', {
      name: 'Supply DAI'
    })
  ).toBeDisabled()

  await page.locator('button:has-text("Approve DAI to continue")').click()
}
