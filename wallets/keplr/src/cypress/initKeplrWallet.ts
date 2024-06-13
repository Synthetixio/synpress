import { type BrowserContext, type Page, chromium } from '@playwright/test'

import { KeplrWallet } from '../KeplrWallet'
// import { SEED_PHRASE, PASSWORD } from '../utils'
import { MISSING_INIT, NO_CONTEXT, NO_PAGE } from './errors'

let context: BrowserContext | undefined
let cypressPage: Page | undefined
let keplrWallet: KeplrWallet | undefined

let keplrLoaded = false

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

export async function initKeplrWallet(port: number) {
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

  // await context.addInitScript({
  //   content: `${readFileSync(web3MockPath, 'utf-8')}\n(${mockEthereum.toString()})();`
  // })

  // As we want to refresh the page after mocking the ethereum object
  if (!keplrLoaded) {
    await cypressPage.reload()
    keplrLoaded = true
  }
  return {}
  // keplrWallet = new KeplrWallet(cypressPage)
  // await keplrWallet.setupWallet(null, { secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
}

export function getKeplrWallet() {
  if (!context || !cypressPage || !keplrWallet) {
    console.error(MISSING_INIT)
    return
  }

  if (keplrWallet) return keplrWallet
  return null
  // return new KeplrWallet(cypressPage)
}
