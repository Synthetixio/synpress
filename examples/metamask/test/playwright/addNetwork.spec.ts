import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should add a custom network to MetaMask', async ({ metamask, page }) => {
  // Add the custom network
  await metamask.addNetwork({
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: 10,
    symbol: 'ETH'
  })

  await expect(page.locator('#chainId')).toHaveText('0xa')
})
