import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/OnboardingPage'

import { createPassword } from './helpers'

export async function importWallet(
  page: Page,
  seedPhrase: string,
  password: string,
) {
  await page.locator(Selectors.GetStartedPageSelectors.importWallet).click()
  await page.getByTestId("onboarding-import-with-srp-button").click()
  await page
    .getByTestId("srp-input-import__srp-note")
    .type(seedPhrase, { delay: 10 })
  await page.getByTestId("import-srp-confirm").click()
  await createPassword(page, password)
  await page.locator("#metametrics-opt-in").click() // This id might look confusing but we are opting out here.
  await page.locator(Selectors.AnalyticsPageSelectors.confirmOptOut).click()
}
