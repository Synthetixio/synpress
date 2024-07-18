import type { Locator } from '@playwright/test'
import { waitFor } from './waitFor'

// TODO: Extract & make configurable
export async function clickLocatorIfCondition(locator: Locator, condition: () => Promise<boolean>, timeout = 3_000) {
  const shouldClick = await waitFor(condition, timeout, false)
  if (shouldClick) {
    await locator.click()
  }
}
