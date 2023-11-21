import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import { z } from 'zod'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

const network = {
  name: 'OP Mainnet',
  rpcUrl: 'https://mainnet.optimism.io',
  chainId: 10,
  symbol: 'ETH',
  blockExplorerUrl: 'https://optimistic.etherscan.io'
}

test('should add network', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.addNetwork(network)

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText(network.name)
})

test('should add network without block explorer', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.addNetwork({
    ...network,
    blockExplorerUrl: undefined
  })

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText(network.name)
})

test('should validate the network object with Zod', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  // @ts-ignore
  await expect(metamask.addNetwork({})).rejects.toThrowError(z.ZodError)
})

test('should throw if there is an issue with rpc url', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const promise = metamask.addNetwork({
    ...network,
    rpcUrl: 'hps://mainnet.optimism.io' // Incorrect.
  })

  await expect(promise).rejects.toThrowError(
    '[AddNetwork] RPC URL error: URLs require the appropriate HTTP/HTTPS prefix.'
  )
})

test('should throw if there is an issue with chain id', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const promise = metamask.addNetwork({
    ...network,
    chainId: 0x42069 // Incorrect.
  })

  await expect(promise).rejects.toThrowError(
    '[AddNetwork] Chain ID error: The RPC URL you have entered returned a different chain ID (10). Please update the Chain ID to match the RPC URL of the network you are trying to add.'
  )
})
