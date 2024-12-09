import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import Selectors from '../../../src/selectors/pages/HomePage'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should toggle the "Testnet Mode" option from Developer Settings menu', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await phantom.toggleTestnetMode()

  await phantomPage.locator(Selectors.headerBackButton).click()
  await phantom.goBackToHomePage()

  await expect(phantomPage.getByText('You are currently in Testnet Mode')).toBeVisible()
})
