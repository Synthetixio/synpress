import type { Page } from '@playwright/test'
import { errors as playwrightErrors } from '@playwright/test'
import { MetaMask } from '../metamask'
import { CrashPage, HomePage } from '../pages'
import { closePopover, closeRecoveryPhraseReminder } from '../pages/HomePage/actions'
import { waitForSpinnerToVanish } from '../utils/waitForSpinnerToVanish'

export async function unlockForFixture(page: Page, password: string) {
  const metamask = new MetaMask(page.context(), page, password)

  await metamask.unlock()

  await waitForSpinnerToVanish(page)

  await retryIfMetaMaskCrashAfterUnlock(page)

  await closePopover(page)
  await closeRecoveryPhraseReminder(page)
}

async function retryIfMetaMaskCrashAfterUnlock(page: Page) {
  const homePageLogoLocator = page.locator(HomePage.selectors.logo)

  const isHomePageLogoVisible = await homePageLogoLocator.isVisible()
  const isPopoverVisible = await page.locator(HomePage.selectors.popover.closeButton).isVisible()

  if (!isHomePageLogoVisible && !isPopoverVisible) {
    if (await page.locator(CrashPage.selectors.header).isVisible()) {
      const errors = await page.locator(CrashPage.selectors.errors).allTextContents()

      console.warn(['[RetryIfMetaMaskCrashAfterUnlock] MetaMask crashed due to:', ...errors].join('\n'))

      console.log('[RetryIfMetaMaskCrashAfterUnlock] Reloading page...')
      await page.reload()

      try {
        await homePageLogoLocator.waitFor({
          state: 'visible',
          timeout: 10_000 // TODO: Extract & Make this timeout configurable.
        })
        console.log('[RetryIfMetaMaskCrashAfterUnlock] Successfully restored MetaMask!')
      } catch (e) {
        if (e instanceof playwrightErrors.TimeoutError) {
          throw new Error(
            ['[RetryIfMetaMaskCrashAfterUnlock] Reload did not help. Throwing with the crash cause:', ...errors].join(
              '\n'
            )
          )
        }

        throw e
      }
    }
  }
}
