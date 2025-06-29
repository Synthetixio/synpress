import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

// Skipping since After Hooks fail in CI - Context closed
test.skip('reset the app', async ({ context, petraPage }) => {
  test.setTimeout(40_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toHaveText('Account 1')

  await petra.resetApp()

  await expect(async () => {
    const newPetraPage = context.pages()[1]

    if (newPetraPage) {
      const newPetraPageUrl = newPetraPage?.url()
      expect(newPetraPageUrl).toContain('onboarding')
    }
  }).toPass()
})
