import type { Locator } from '@playwright/test'
import { waitFor } from './waitFor'

export async function toggle(toggleLocator: Locator) {
  // TODO: Extract timeout
  const classes = await toggleLocator.getAttribute('class', { timeout: 10_000 })

  if (!classes) {
    throw new Error('[ToggleShowTestNetworks] Toggle class returned null')
  }

  const isOn = classes.includes('toggle-button--on')

  await toggleLocator.click()

  const waitForAction = async () => {
    const classes = await toggleLocator.getAttribute('class')

    if (!classes) {
      throw new Error('[ToggleShowTestNetworks] Toggle class returned null inside waitFor')
    }

    if (isOn) {
      return classes.includes('toggle-button--off')
    }

    return classes.includes('toggle-button--on')
  }

  // TODO: Extract timeout
  await waitFor(waitForAction, 10_000, true)
}
