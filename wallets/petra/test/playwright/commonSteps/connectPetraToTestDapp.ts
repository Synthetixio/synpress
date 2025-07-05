import { type Page, expect } from '@playwright/test'
import type { Petra } from '../../../src/playwright'

export const connectPetraToTestDapp = async (page: Page, petra: Petra) => {
  await expect(async () => {
    await page.goto('/')

    // Delay to avoid random fails
    await page.locator('#connectButton').click({ delay: 2_000 })

    await petra.connectToDapp()
    const userAddress = await petra.getAccountAddress()

    expect(userAddress).toBe('0xbfef909638ef90885158fdab9f56e216fd811fe25b32ead0bc2a272d66522bb0')
  }).toPass()
}
