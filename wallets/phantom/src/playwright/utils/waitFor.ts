import type { Page } from '@playwright/test'
import { errors } from '@playwright/test'
import { LoadingSelectors } from '../../selectors'
import { ErrorSelectors } from '../../selectors'

const DEFAULT_TIMEOUT = 2000

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
  await page.waitForLoadState('networkidle', { timeout: 10_000 })
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

export const waitForPhantomLoad = async (page: Page) => {
  await Promise.all(
    LoadingSelectors.loadingIndicators.map(async (selector) => {
      await waitForSelector(selector, page, DEFAULT_TIMEOUT)
    })
  )
    .then(() => {
      return true
    })
    .catch((error) => {
      console.error('Error: ', error)
    })

  return page
}

export const waitForPhantomWindowToBeStable = async (page: Page) => {
  await waitForPhantomLoad(page)
  if ((await page.locator(ErrorSelectors.loadingOverlayErrorButtons).count()) > 0) {
    const retryButton = await page.locator(ErrorSelectors.loadingOverlayErrorButtonsRetryButton)
    await retryButton.click()
    await waitForSelector(LoadingSelectors.loadingOverlay, page, DEFAULT_TIMEOUT)
  }
  await fixCriticalError(page)
}

export const fixCriticalError = async (page: Page) => {
  for (let times = 0; times < 5; times++) {
    if ((await page.locator(ErrorSelectors.criticalError).count()) > 0) {
      console.log('[fixCriticalError] Phantom crashed with critical error, refreshing..')
      if (times <= 3) {
        await page.reload()
        await waitForPhantomWindowToBeStable(page)
      } else if (times === 4) {
        const restartButton = await page.locator(ErrorSelectors.criticalErrorRestartButton)
        await restartButton.click()
        await waitForPhantomWindowToBeStable(page)
      } else {
        throw new Error('[fixCriticalError] Max amount of retries to fix critical phantom error has been reached.')
      }
    } else if ((await page.locator(ErrorSelectors.errorPage).count()) > 0) {
      console.log('[fixCriticalError] Phantom crashed with error, refreshing..')
      if (times <= 4) {
        await page.reload()
        await waitForPhantomWindowToBeStable(page)
      } else {
        throw new Error('[fixCriticalError] Max amount of retries to fix critical phantom error has been reached.')
      }
    } else {
      break
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
