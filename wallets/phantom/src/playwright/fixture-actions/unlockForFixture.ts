import type { Page } from '@playwright/test'
import { errors as playwrightErrors } from '@playwright/test'
import { Phantom } from '..'
import { waitForSpinnerToVanish } from '../utils/waitForSpinnerToVanish'

/**
 *  A more advanced version of the `Phantom.unlock()` function that incorporates various workarounds for Phantom issues, among other things.
 *  This function should be used instead of the `Phantom.unlock()` when passing it to the `testWithSynpress` function.
 *
 * @param page - The Phantom tab page.
 * @param password - The password of the Phantom wallet.
 */
export async function unlockForFixturePhantom(page: Page, password: string) {
  const phantom = new Phantom(page.context(), page, password)

  await unlockWalletButReloadIfSpinnerDoesNotVanish(phantom)
}

async function unlockWalletButReloadIfSpinnerDoesNotVanish(phantom: Phantom) {
  try {
    await phantom.unlock()
  } catch (e) {
    if (e instanceof playwrightErrors.TimeoutError) {
      console.warn('[UnlockWalletButReloadIfSpinnerDoesNotVanish] Unlocking Phantom timed out. Reloading page...')

      const page = phantom.page

      await page.reload()
      await waitForSpinnerToVanish(page)
    } else {
      throw e
    }
  }
}
