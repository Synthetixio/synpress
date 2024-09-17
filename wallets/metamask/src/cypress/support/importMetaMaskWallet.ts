import { type BrowserContext, type Page, chromium } from '@playwright/test'
import { getExtensionId } from '../../playwright'
import getPlaywrightMetamask from '../getPlaywrightMetamask'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

export default async function importMetaMaskWallet(port: number, importDefaultWallet = true) {
  const debuggerDetails = await fetch(`http://127.0.0.1:${port}/json/version`)

  const debuggerDetailsConfig = (await debuggerDetails.json()) as {
    webSocketDebuggerUrl: string
  }

  const browser = await chromium.connectOverCDP(debuggerDetailsConfig.webSocketDebuggerUrl)

  const context = browser.contexts()[0] as BrowserContext

  await context.waitForEvent('response')

  let metamaskExtensionId: string | undefined
  let extensionPage: Page | undefined
  let cypressPage: Page | undefined

  const extensionPageIndex = context.pages().findIndex((page) => page.url().includes('chrome-extension://'))
  if (extensionPageIndex !== -1) {
    extensionPage = context.pages()[extensionPageIndex] as Page
    metamaskExtensionId = await getExtensionId(context, 'MetaMask')

    const metamask = getPlaywrightMetamask(context, extensionPage, metamaskExtensionId)

    if (importDefaultWallet) await metamask.importWallet(SEED_PHRASE)

    cypressPage = context.pages()[extensionPageIndex === 1 ? 0 : 1] as Page
    await cypressPage.bringToFront()
  }

  return {
    context,
    extensionPage,
    cypressPage,
    metamaskExtensionId
  }
}
