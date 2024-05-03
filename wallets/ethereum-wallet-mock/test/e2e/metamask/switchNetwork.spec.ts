import { testWithEthereumWalletMock } from '../../../src'

const test = testWithEthereumWalletMock

const { expect } = test

test('should switch network', async ({ createAnvilNetwork, walletMock, page }) => {
  const network = createAnvilNetwork()

  await walletMock.addNetwork(network)

  await walletMock.switchNetwork(network.name)

  const chainId = await page.evaluate(async () => {
    return await window.ethereum.request({ method: 'eth_chainId' })
  })

  expect(chainId).toBe('0x38')
})
