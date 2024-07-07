import { type BrowserContext, chromium, type Page } from '@playwright/test'
import { importWallet } from '../../playwright/pages/OnboardingPage/actions'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

export default async function setupMetaMaskWallet(port: number) {
  const debuggerDetails = await fetch(`http://127.0.0.1:${port}/json/version`)

  const debuggerDetailsConfig = (await debuggerDetails.json()) as {
    webSocketDebuggerUrl: string
  }

  const browser = await chromium.connectOverCDP(debuggerDetailsConfig.webSocketDebuggerUrl)

  const context = browser.contexts()[0] as BrowserContext

  // First page (index equal 0) is the cypress page, second one (index equal 1) is the extension page
  const extensionPage = context.pages()[1] as Page

  // await context.waitForEvent('page', { timeout: 5000 })
  console.log(context.pages().length)

  await importWallet(extensionPage, SEED_PHRASE, 'password')

  await extensionPage.close()
}
