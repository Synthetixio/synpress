import type { Page } from '@playwright/test'
import { errors as playwrightErrors } from '@playwright/test'
import { MetaMask } from '../metamask'
import { CrashPage, HomePage } from '../pages'
import { LoadingSelectors } from '../selectors'

export async function unlockForFixture(page: Page, password: string) {
  const metamask = new MetaMask(page.context(), page, password)

  await metamask.unlock()

  await page.locator(LoadingSelectors.spinner).waitFor({
    state: 'hidden',
    timeout: 3000 // TODO: Extract & Make this timeout configurable.
  })

  await retryIfMetaMaskCrashAfterUnlock(page)
}

async function retryIfMetaMaskCrashAfterUnlock(page: Page) {
  const isHomePageVisible = await page.locator(HomePage.selectors.logo).isVisible()

  if (!isHomePageVisible) {
    if (await page.locator(CrashPage.selectors.header).isVisible()) {
      const errors = await page.locator(CrashPage.selectors.errors).allTextContents()

      console.warn(['[RetryIfMetaMaskCrashAfterUnlock] MetaMask crashed due to:', ...errors].join('\n'))

      console.log('[RetryIfMetaMaskCrashAfterUnlock] Reloading page...')
      await page.reload()

      try {
        await page.locator(HomePage.selectors.logo).waitFor({
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
