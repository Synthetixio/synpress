import type { Page } from '@playwright/test'
// import { errors as playwrightErrors } from '@playwright/test'
import { KeplrWallet } from '..'
// import { LockPage } from '../pages/LockPage/page'
// import { NotificationPage } from '../pages/NotificationPage/page'

/**
 *  A more advanced version of the `MetaMask.unlock()` function that incorporates various workarounds for MetaMask issues, among other things.
 *  This function should be used instead of the `MetaMask.unlock()` when passing it to the `testWithSynpress` function.
 *
 * @param page - The MetaMask tab page.
 * @param password - The password of the MetaMask wallet.
 */
export async function unlockForFixture(page: Page, password: string) {
  const metamask = new KeplrWallet(page, page.context(), password, '')

  await unlockWalletButReloadIfSpinnerDoesNotVanish(metamask)

  await retryIfKeplrCrashAfterUnlock(page)

  // await closePopover(page)
  // await closeRecoveryPhraseReminder(page)
}

async function unlockWalletButReloadIfSpinnerDoesNotVanish(keplr: KeplrWallet) {
  console.log('Unlocking Keplr wallet...', keplr)
  // try {
  //   await metamask.unlock()
  // } catch (e) {
  //   if (e instanceof playwrightErrors.TimeoutError) {
  //     console.warn('[UnlockWalletButReloadIfSpinnerDoesNotVanish] Unlocking MetaMask timed out. Reloading page...')

  //     const page = metamask.page

  //     await page.reload()
  //     await waitForSpinnerToVanish(page)
  //   } else {
  //     throw e
  //   }
  // }
}

async function retryIfKeplrCrashAfterUnlock(page: Page) {
  console.log('Retrying if Keplr crashed after unlock...', page)
  // const homePageLogoLocator = page.locator(HomePage.selectors.logo)

  // const isHomePageLogoVisible = await homePageLogoLocator.isVisible()
  // const isPopoverVisible = await page.locator(HomePage.selectors.popover.closeButton).isVisible()

  // if (!isHomePageLogoVisible && !isPopoverVisible) {
  //   if (await page.locator(CrashPage.selectors.header).isVisible()) {
  //     const errors = await page.locator(CrashPage.selectors.errors).allTextContents()

  //     console.warn(['[RetryIfMetaMaskCrashAfterUnlock] MetaMask crashed due to:', ...errors].join('\n'))

  //     console.log('[RetryIfMetaMaskCrashAfterUnlock] Reloading page...')
  //     await page.reload()

  //     try {
  //       await homePageLogoLocator.waitFor({
  //         state: 'visible',
  //         timeout: 10_000 // TODO: Extract & Make this timeout configurable.
  //       })
  //       console.log('[RetryIfMetaMaskCrashAfterUnlock] Successfully restored MetaMask!')
  //     } catch (e) {
  //       if (e instanceof playwrightErrors.TimeoutError) {
  //         throw new Error(
  //           ['[RetryIfMetaMaskCrashAfterUnlock] Reload did not help. Throwing with the crash cause:', ...errors].join(
  //             '\n'
  //           )
  //         )
  //       }

  //       throw e
  //     }
  //   }
  // }
}
