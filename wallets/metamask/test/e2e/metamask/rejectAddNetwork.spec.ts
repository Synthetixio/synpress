import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import connectedSetup from '../wallet-setup/connected.setup'

const test = testWithSynpress(connectedSetup, unlockForFixture)

const { expect } = test

test('should reject new network request', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#addEthereumChain').click()

  await metamask.rejectNewNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')
})
