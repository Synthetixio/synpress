import { ANVIL_CHAIN_ID, ANVIL_URL_URL } from '../../../src/constants'
import test from '../../../src/playwright/synpress'

const { expect } = test

function createAnvilNetwork() {
  return {
    name: 'Anvil',
    rpcUrl: ANVIL_URL_URL,
    chainId: ANVIL_CHAIN_ID,
    blockExplorerUrl: 'https://etherscan.io/',
    nativeCurrency: {
      decimals: 18,
      name: 'Anvil',
      symbol: 'ETH'
    }
  }
}

test('should switch network', async ({ ethereumWalletMock, page }) => {
  const network = createAnvilNetwork()

  await ethereumWalletMock.addNetwork(network)

  await ethereumWalletMock.switchNetwork(network.name)

  const chainId = await page.evaluate(async () => {
    return await window.ethereum.request({ method: 'eth_chainId' })
  })

  expect(chainId).toBe('0xa')
})
