import { type BrowserContext, type Page, chromium } from '@playwright/test'
import { MISSING_INIT, NO_CONTEXT, NO_METAMASK_PAGE } from './errors'
import { getExtensionId } from '../fixture-actions'
import { MetaMask } from '../MetaMask'
import { PASSWORD, SEED_PHRASE } from '../../test/wallet-setup/basic.setup'

let context: BrowserContext | undefined
let extensionId: string | undefined
let metamaskPage: Page | undefined
let metamask: MetaMask | undefined

export async function getMetaMaskExtensionId() {
  if (extensionId) return extensionId

  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  extensionId = await getExtensionId(context, 'MetaMask')
  return extensionId
}

const isMetaMaskPage = (page: Page) => page.url().includes(`chrome-extension://${extensionId}`)

const getMetaMaskPage = async () => {
  await getMetaMaskExtensionId()

  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  metamaskPage = context.pages().find(isMetaMaskPage)
  return metamaskPage
}

export async function connectPlaywrightToChrome(port: number) {
  const debuggerDetails = await fetch(`http://127.0.0.1:${port}/json/version`)

  const debuggerDetailsConfig = (await debuggerDetails.json()) as {
    webSocketDebuggerUrl: string
  }

  const browser = await chromium.connectOverCDP(debuggerDetailsConfig.webSocketDebuggerUrl)

  context = browser.contexts()[0]

  return browser.isConnected()
}

export async function initMetaMask(port: number) {
  await connectPlaywrightToChrome(port)

  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  await getMetaMaskPage()

  if (!metamaskPage) {
    console.error(NO_METAMASK_PAGE)
    return
  }

  metamask = new MetaMask(context, metamaskPage, PASSWORD)
  await metamask.importWallet(SEED_PHRASE)
}

export function getMetaMask() {
  if (!context || !metamaskPage || !metamask) {
    console.error(MISSING_INIT)
    return
  }

  if (metamask) return metamask

  return new MetaMask(context, metamaskPage, PASSWORD)
}
