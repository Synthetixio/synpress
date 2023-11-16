import type { Page } from '@playwright/test'
import { waitFor } from '../../utils/waitFor'
import { lock } from './actions'
import Selectors from './selectors'

export class HomePage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async lock() {
    await lock(this.page)
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await this.page.locator(Selectors.accountMenu.accountMenuButton).click()
    await this.page.locator(Selectors.accountMenu.importAccountButton).click()
    await this.page.locator(Selectors.importAccountScreen.privateKeyInput).fill(privateKey)

    const importButton = this.page.locator(Selectors.importAccountScreen.importButton)
    await importButton.click()

    // TODO: Extract & make configurable
    const isHidden = await waitFor(importButton, 'hidden', 1000, false)

    if (!isHidden) {
      const errorText = await this.page.locator(Selectors.importAccountScreen.error).textContent({
        timeout: 1000 // TODO: Extract & make configurable
      })

      throw new Error(`[ImportWalletFromPrivateKey] Importing failed due to error: ${errorText}`)
    }
  }
}
