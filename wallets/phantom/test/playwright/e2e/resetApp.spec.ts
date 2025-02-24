import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

// Skipping since After Hooks fail in CI - Context closed
test.skip('reset the app', async ({ context, phantomPage }) => {
  test.setTimeout(40_000)

  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toHaveText('Account 1')

  await phantom.resetApp()

  await expect(async () => {
    const newPhantomPage = context.pages()[1]

    if (newPhantomPage) {
      const newPhantomPageUrl = newPhantomPage?.url()
      expect(newPhantomPageUrl).toContain('onboarding')
    }
  }).toPass()
})
