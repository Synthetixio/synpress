import { readFileSync } from 'fs'
import { type BrowserContext, type Page, chromium } from '@playwright/test'

import { EthereumWalletMock } from '../EthereumWalletMock'
import { SEED_PHRASE, mockEthereum, web3MockPath } from '../utils'
import { MISSING_INIT, NO_CONTEXT, NO_PAGE } from './errors'

let context: BrowserContext | undefined
let cypressPage: Page | undefined
let ethereumWalletMock: EthereumWalletMock | undefined

let ethereumObjectLoaded = false

const getCypressPage = async () => {
  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  cypressPage = context.pages()[0]

  return cypressPage
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

export async function initEthereumWalletMock(port: number) {
  await connectPlaywrightToChrome(port)

  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  await getCypressPage()

  if (!cypressPage) {
    console.error(NO_PAGE)
    return
  }

  await context.addInitScript({
    content: `${readFileSync(web3MockPath, 'utf-8')}\n(${mockEthereum.toString()})();`
  })

  // As we want to refresh the page after mocking the ethereum object
  if (!ethereumObjectLoaded) {
    await cypressPage.reload()
    ethereumObjectLoaded = true
  }

  ethereumWalletMock = new EthereumWalletMock(cypressPage, 'coinbase')
  await ethereumWalletMock.importWallet(SEED_PHRASE)
}

export function getEthereumWalletMock() {
  if (!context || !cypressPage || !ethereumWalletMock) {
    console.error(MISSING_INIT)
    return
  }

  if (ethereumWalletMock) return ethereumWalletMock

  return new EthereumWalletMock(cypressPage)
}
