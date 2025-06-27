import type { Page } from '@playwright/test'
import { LoadingSelectors } from '../../selectors'

// TODO: Should we decrease the timeout?
// TODO: Not sure if hard coding the timeout is a good idea but must be enough for now.
const DEFAULT_TIMEOUT = 10_000

export async function waitForSpinnerToVanish(page: Page) {
  await page.locator(LoadingSelectors.spinner).waitFor({
    state: 'hidden',
    timeout: DEFAULT_TIMEOUT
  })
}
