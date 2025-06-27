import type { Page } from '@playwright/test'
import { errors, expect } from '@playwright/test'

import Selectors from '../../selectors/pages/UnlockPage'

let retries = 0

export const waitToBeHidden = async (selector: string, page: Page) => {
  // info: waits for 60 seconds
  const locator = page.locator(selector)
  for (const element of await locator.all()) {
    if ((await element.count()) > 0 && retries < 300) {
      retries++
      await page.waitForTimeout(200)
      await module.exports.waitToBeHidden(selector, page)
    } else if (retries >= 300) {
      retries = 0
      throw new Error(`[waitToBeHidden] Max amount of retries reached while waiting for ${selector} to disappear.`)
    }
    retries = 0
  }
}

export const waitUntilStable = async (page: Page) => {
  await page.waitForLoadState('load', { timeout: 10_000 })
  await page.waitForLoadState('domcontentloaded', { timeout: 10_000 })
}

export const waitUntilStableBeforeUnlock = async (page: Page) => {
  await page.waitForLoadState('load', { timeout: 10_000 })
  await page.waitForLoadState('domcontentloaded', { timeout: 10_000 })

  await expect(async () => {
    await expect(page.locator(Selectors.submitButton), '"Unlock" buttonshouldbe visible').toBeVisible()
  }).toPass({ timeout: 10_000 })
}

export const waitUntilStableNotificationPage = async (page: Page) => {
  await page.waitForLoadState('load', { timeout: 10_000 })
  await page.waitForLoadState('domcontentloaded', { timeout: 10_000 })
  await page.locator('[data-testid="home-header-account-name"]').waitFor({ timeout: 10_000 })
}

export const waitForSelector = async (selector: string, page: Page, timeout: number) => {
  await waitUntilStable(page)

  try {
    await page.waitForSelector(selector, { state: 'hidden', timeout })
  } catch (error) {
    if (error instanceof errors.TimeoutError) {
      console.log(`Loading indicator '${selector}' not found - continuing.`)
    } else {
      console.log(`Error while waiting for loading indicator '${selector}' to disappear`)
      throw error
    }
  }
}

// Inlining the sleep function here cause this is one of the few places in the entire codebase where sleep should be used!
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const timeouts = [0, 20, 50, 100, 100, 500] as const

// TODO: Box this function.
// This functions mimics the one found in Playwright with a few small differences.
// Custom implementation is needed because Playwright lists errors in the report even if they are caught.
export async function waitFor(action: () => Promise<boolean>, timeout: number, shouldThrow = true) {
  let timeoutsSum = 0
  let timeoutIndex = 0

  let reachedTimeout = false

  while (!reachedTimeout) {
    let nextTimeout = timeouts.at(Math.min(timeoutIndex++, timeouts.length - 1)) as number

    if (timeoutsSum + nextTimeout > timeout) {
      nextTimeout = timeout - timeoutsSum
      reachedTimeout = true
    } else {
      timeoutsSum += nextTimeout
    }

    await sleep(nextTimeout)

    const result = await action()
    if (result) {
      return result
    }
  }

  if (shouldThrow) {
    throw new Error(`Timeout ${timeout}ms exceeded.`)
  }

  return false
}
