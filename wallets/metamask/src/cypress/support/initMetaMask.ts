import { type BrowserContext, type Page, chromium } from '@playwright/test'

import { NO_CONTEXT, NO_PAGE } from '../constants/errors'
// import { getExtensionId, unlockForFixture } from '../../playwright';
import { prepareExtension } from '../../extensionSetup/prepareExtension';
import { unlockForCypress } from './unlockForCypress';
import basicSetup from '../../../test/playwright/wallet-setup/basic.setup';

let context: BrowserContext | undefined
let cypressPage: Page | undefined

const getCypressPage = async () => {
  if (!context) {
    console.error(NO_CONTEXT)
    return
  }

  cypressPage = context.pages()[0]

  return cypressPage
}
export async function initMetaMask(port: number) {
  // await connectPlaywrightToChrome(port)

  // if (!context) {
  //   console.error(NO_CONTEXT)
  //   return []
  // }
  //
  // await getCypressPage()
  //
  // if (!cypressPage) {
  //   console.error(NO_PAGE)
  //   return []
  // }

  const metamaskPath = await prepareExtension(false)

  const browserArgs = [
    `--disable-extensions-except=${metamaskPath}`,
    `--load-extension=${metamaskPath}`
  ]


  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  // await chromium.launchPersistentContext('', {
  //   headless: false,
  //   args: browserArgs
  // })

  // const extensionId = await getExtensionId(context, 'MetaMask')
  // cypressPage = context.pages()[0] as Page
  //
  // await cypressPage.goto(`chrome-extension://${extensionId}/home.html`)
  //
  await unlockForCypress(basicSetup.walletPassword)

  return browserArgs
  //
  // await context.close()
}
