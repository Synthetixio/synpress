import type { Locator } from '@playwright/test'

// Inlining the sleep function here cause this is one of the few places in the entire codebase where sleep should be used!
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const timeouts = [0, 20, 50, 100, 100, 500] as const

type State = 'visible' | 'hidden'

// TODO: Box this function.
// This functions mimics the one found in Playwright with a few small differences.
// Custom implementation is needed because Playwright lists errors in the report even if they are caught.
export async function waitFor(locator: Locator, state: State, timeout: number, shouldThrow = true) {
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

    const result = await action(locator, state)
    if (result) {
      return result
    }
  }

  if (shouldThrow) {
    throw new Error(`Timeout ${timeout}ms exceeded.`)
  }

  return false
}

async function action(locator: Locator, state: State) {
  if (state === 'hidden') {
    return locator.isHidden()
  }

  return locator.isVisible()
}
