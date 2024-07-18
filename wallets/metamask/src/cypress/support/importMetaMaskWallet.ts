import { type BrowserContext, type Page, chromium } from '@playwright/test'
import { importWallet } from '../../playwright/pages/OnboardingPage/actions'
import { onboardingPage } from '../../selectors'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

export default async function importMetaMaskWallet(port: number) {
  const debuggerDetails = await fetch(`http://127.0.0.1:${port}/json/version`)

  const debuggerDetailsConfig = (await debuggerDetails.json()) as {
    webSocketDebuggerUrl: string
  }

  const browser = await chromium.connectOverCDP(debuggerDetailsConfig.webSocketDebuggerUrl)

  const context = browser.contexts()[0] as BrowserContext

  await context.waitForEvent('response')

  // First page (index equal 0) is the cypress page, second one (index equal 1) is the extension page
  const extensionPage = context.pages()[1] as Page

  await extensionPage.waitForSelector(onboardingPage.GetStartedPageSelectors.termsOfServiceCheckbox)

  await importWallet(extensionPage, SEED_PHRASE, 'password')

  await extensionPage.close()
}
