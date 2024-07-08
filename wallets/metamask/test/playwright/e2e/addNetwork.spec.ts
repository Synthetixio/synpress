import { z } from 'zod'
import { waitFor } from '../../../src/playwright/utils/waitFor'

import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should add network and close network added popup', async ({ metamaskPage, createAnvilNode, metamask }) => {
  const { rpcUrl, chainId } = await createAnvilNode()

  const network = {
    name: 'Anvil',
    rpcUrl,
    chainId,
    symbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/'
  }

  await metamask.addNetwork(network)

  const isNetworkAddedPopupVisible = await waitFor(
    () => metamaskPage.locator(metamask.homePage.selectors.networkAddedPopover.switchToNetworkButton).isVisible(),
    3_000,
    false
  )
  expect(isNetworkAddedPopupVisible).toBe(false)

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText(network.name)
})

test('should add network without block explorer', async ({ metamaskPage, createAnvilNode, metamask }) => {
  const { rpcUrl, chainId } = await createAnvilNode()

  const network = {
    name: 'Anvil',
    rpcUrl,
    chainId,
    symbol: 'ETH',
    blockExplorerUrl: undefined
  }

  await metamask.addNetwork(network)

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText(network.name)
})

test('should validate the network object with Zod', async ({ metamask }) => {
  // @ts-ignore
  await expect(metamask.addNetwork({})).rejects.toThrowError(z.ZodError)
})

test('should throw if there is an issue with rpc url', async ({ metamask }) => {
  const optimismMainnet = {
    name: 'OP Mainnet',
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: 10,
    symbol: 'ETH',
    blockExplorerUrl: 'https://optimistic.etherscan.io'
  }

  const promise = metamask.addNetwork({
    ...optimismMainnet,
    rpcUrl: 'hps://mainnet.optimism.io' // Incorrect.
  })

  await expect(promise).rejects.toThrowError(
    '[AddNetwork] RPC URL error: URLs require the appropriate HTTP/HTTPS prefix.'
  )
})

test('should throw if there is an issue with chain id', async ({ metamask, createAnvilNode }) => {
  const { rpcUrl, chainId } = await createAnvilNode()

  const network = {
    name: 'Anvil',
    rpcUrl,
    chainId,
    symbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/'
  }

  const promise = metamask.addNetwork({
    ...network,
    chainId: 0x42069 // Incorrect.
  })

  await expect(promise).rejects.toThrowError(
    '[AddNetwork] Chain ID error: The RPC URL you have entered returned a different chain ID (31337). Please update the Chain ID to match the RPC URL of the network you are trying to add.'
  )
})
