import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import Selectors from '../../../src/selectors/pages/HomePage'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should toggle the "Testnet Mode" option from Developer Settings menu', async ({ context, petraPage }) => {
  const phantom = new Petra(context, petraPage, basicSetup.walletPassword)

  await phantom.toggleTestnetMode()

  await petraPage.locator(Selectors.headerBackButton).click()
  await phantom.goBackToHomePage()

  await expect(petraPage.getByText('You are currently in Testnet Mode')).toBeVisible()
})
