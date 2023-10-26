import { chromium } from 'playwright-core'
import type { WalletSetupFunction } from '../defineWalletSetup'
import { waitForExtensionOnLoadPage } from './waitForExtensionOnLoadPage'

// Inlining the sleep function here cause this is the ONLY place in the entire codebase where sleep should be used!
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function createCacheForWalletSetupFunction(
  extensionPath: string,
  contextCacheDirPath: string,
  walletSetup: WalletSetupFunction
) {
  // TODO: Extract & Make a constant.
  const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  const context = await chromium.launchPersistentContext(contextCacheDirPath, {
    headless: false,
    args: browserArgs
  })

  const extensionPage = await waitForExtensionOnLoadPage(context)

  await walletSetup(context, extensionPage)

  // We sleep here to give the browser enough time to save the context to the disk.
  await sleep(3000) // TODO: Extract & Make this timeout configurable.

  await context.close()

  return
}
