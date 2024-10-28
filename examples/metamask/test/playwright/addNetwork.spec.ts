import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should add a custom network to MetaMask', async ({ metamask, page }) => {
  // Define the custom network parameters
  const customNetwork = {
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: 10,
    symbol: 'ETH'
  }

  // Add the custom network to MetaMask
  await metamask.addNetwork(customNetwork)

  // Verify that the chain ID has been updated correctly
  // Note: '0xa' is the hexadecimal representation of 10
  await expect(page.locator('#chainId')).toHaveText('0xa')
})
