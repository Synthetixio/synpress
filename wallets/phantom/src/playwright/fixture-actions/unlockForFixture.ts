import type { Page } from '@playwright/test'
import { errors as playwrightErrors } from '@playwright/test'
import { Phantom } from '..'
import { CrashPage, HomePage } from '../pages'
import { waitForSpinnerToVanish } from '../utils/waitForSpinnerToVanish'

/**
 *  A more advanced version of the `Phantom.unlock()` function that incorporates various workarounds for Phantom issues, among other things.
 *  This function should be used instead of the `Phantom.unlock()` when passing it to the `testWithSynpress` function.
 *
 * @param page - The Phantom tab page.
 * @param password - The password of the Phantom wallet.
 */
export async function unlockForFixture(page: Page, password: string) {
  const phantom = new Phantom(page.context(), page, password)

  await unlockWalletButReloadIfSpinnerDoesNotVanish(phantom)

  await retryIfPhantomCrashAfterUnlock(page)
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

async function retryIfPhantomCrashAfterUnlock(page: Page) {
  const homePageLogoLocator = page.locator(HomePage.selectors.logo)

  const isHomePageLogoVisible = await homePageLogoLocator.isVisible()
  const isPopoverVisible = await page.locator(HomePage.selectors.popover.closeButton).isVisible()

  if (!isHomePageLogoVisible && !isPopoverVisible) {
    if (await page.locator(CrashPage.selectors.header).isVisible()) {
      const errors = await page.locator(CrashPage.selectors.errors).allTextContents()

      console.warn(['[RetryIfPhantomCrashAfterUnlock] Phantom crashed due to:', ...errors].join('\n'))

      console.log('[RetryIfPhantomCrashAfterUnlock] Reloading page...')
      await page.reload()

      try {
        await homePageLogoLocator.waitFor({
          state: 'visible',
          timeout: 10_000 // TODO: Extract & Make this timeout configurable.
        })
        console.log('[RetryIfPhantomCrashAfterUnlock] Successfully restored Phantom!')
      } catch (e) {
        if (e instanceof playwrightErrors.TimeoutError) {
          throw new Error(
            ['[RetryIfPhantomCrashAfterUnlock] Reload did not help. Throwing with the crash cause:', ...errors].join(
              '\n'
            )
          )
        }

        throw e
      }
    }
  }
}
