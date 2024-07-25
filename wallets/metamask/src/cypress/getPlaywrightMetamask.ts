import type { BrowserContext, Page } from '@playwright/test'
import { MetaMask } from '../playwright'

let metamask: MetaMask | undefined

export default function getPlaywrightMetamask(
  context: BrowserContext,
  metamaskExtensionPage: Page,
  metamaskExtensionId: string
) {
  if (!metamask) {
    metamask = new MetaMask(context, metamaskExtensionPage, 'password', metamaskExtensionId)
  }
  return metamask
}
