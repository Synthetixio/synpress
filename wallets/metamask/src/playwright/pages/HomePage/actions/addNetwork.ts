import type { Page } from '@playwright/test'
import { z } from 'zod'
import { waitFor } from '../../../utils/waitFor'
import Selectors from '../selectors'
import { closeNetworkAddedPopover, closeNewNetworkInfoPopover } from './popups'

const Network = z.object({
  name: z.string(),
  rpcUrl: z.string(),
  chainId: z.number(),
  symbol: z.string(),
  blockExplorerUrl: z.string().optional()
})

export type Network = z.infer<typeof Network>

export async function addNetwork(page: Page, network: Network) {
  const { name, rpcUrl, chainId, symbol, blockExplorerUrl } = Network.parse(network)

  await page.locator(Selectors.networkDropdown.dropdownButton).click()
  await page.locator(Selectors.networkDropdown.addNetworkButton).click()

  await page.locator(Selectors.settings.networks.addNetworkManuallyButton).click()

  await page.locator(Selectors.settings.networks.newNetworkForm.networkNameInput).fill(name)

  await page.locator(Selectors.settings.networks.newNetworkForm.rpcUrlInput).fill(rpcUrl)

  // We have to wait for the RPC URL error to appear.
  const rpcUrlErrorLocator = page.locator(Selectors.settings.networks.newNetworkForm.rpcUrlError)
  if (await waitFor(() => rpcUrlErrorLocator.isVisible(), 1_000, false)) {
    const rpcUrlErrorText = await rpcUrlErrorLocator.textContent({
      timeout: 1_000
    })
    throw new Error(`[AddNetwork] RPC URL error: ${rpcUrlErrorText}`)
  }

  await page.locator(Selectors.settings.networks.newNetworkForm.chainIdInput).fill(chainId.toString())

  // We have to wait for the Chain ID error to appear.
  const chainIdErrorLocator = page.locator(Selectors.settings.networks.newNetworkForm.chainIdError)
  if (await waitFor(() => chainIdErrorLocator.isVisible(), 1_000, false)) {
    const chainIdErrorText = await chainIdErrorLocator.textContent({
      timeout: 1_000
    })
    throw new Error(`[AddNetwork] Chain ID error: ${chainIdErrorText}`)
  }

  await page.locator(Selectors.settings.networks.newNetworkForm.symbolInput).fill(symbol)

  await waitFor(
    async () => page.locator(Selectors.settings.networks.newNetworkForm.symbolError).isVisible(),
    1_000,
    false
  )

  if (blockExplorerUrl) {
    await page.locator(Selectors.settings.networks.newNetworkForm.blockExplorerUrlInput).fill(blockExplorerUrl)
  }

  await page.locator(Selectors.settings.networks.newNetworkForm.saveButton).click()

  await closeNetworkAddedPopover(page)

  await closeNewNetworkInfoPopover(page)
}
