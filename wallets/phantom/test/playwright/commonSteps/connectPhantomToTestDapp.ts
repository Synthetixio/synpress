import { type Page, expect } from '@playwright/test'
import type { Phantom } from '../../../src/playwright'

export const connectPhantomToTestDapp = async (page: Page, phantom: Phantom) => {
  await expect(async () => {
    await page.goto('/')

    // Delay to avoid random fails
    await page.locator('#connectButton').click({ delay: 2_000 })

    await phantom.connectToDapp()

    await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  }).toPass()
}
