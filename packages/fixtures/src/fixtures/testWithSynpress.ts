import path from 'node:path'
import type {
  Fixtures,
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions
} from '@playwright/test'
import { chromium, test as base } from '@playwright/test'
import { defineWalletSetup, waitForExtensionOnLoadPage } from 'core'
import { createTempContextDir, removeTempContextDir } from 'core'
import { CACHE_DIR_NAME, prepareExtension } from 'core'
import fs from 'fs-extra'
import { getExtensionId } from '../utils/getExtensionId'

type UnlockWalletFunction = (walletPage: Page, password: string) => Promise<void>

// Base types of the `test` fixture from Playwright.
type TestFixtures = PlaywrightTestArgs & PlaywrightTestOptions
type WorkerFixtures = PlaywrightWorkerArgs & PlaywrightWorkerOptions

type PrivateSynpressFixtures = {
  _contextPath: string
}

type PublicSynpressFixtures = {
  extensionId: string
  metamaskPage: Page
}

type SynpressFixtures = TestFixtures & PrivateSynpressFixtures & PublicSynpressFixtures

// TODO: Bad practice. Use a store!
let _extensionId: string
let _metamaskPage: Page

const synpressFixtures = (
  walletSetup: ReturnType<typeof defineWalletSetup>,
  unlockWallet: UnlockWalletFunction,
  slowMo = 0
): Fixtures<SynpressFixtures, WorkerFixtures> => ({
  _contextPath: async ({ browserName }, use, testInfo) => {
    const contextPath = await createTempContextDir(browserName, testInfo.testId)

    await use(contextPath)

    const error = await removeTempContextDir(contextPath)
    if (error) {
      console.error(error)
    }
  },
  context: async ({ context: _, _contextPath }, use) => {
    const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, walletSetup.hash)
    if (!(await fs.exists(cacheDirPath))) {
      throw new Error(`Cache for ${walletSetup.hash} does not exist. Create it first!`)
    }

    // Copying the cache to the temporary context directory.
    await fs.copy(cacheDirPath, _contextPath)

    const metamaskPath = await prepareExtension()

    // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
    const browserArgs = [`--disable-extensions-except=${metamaskPath}`]

    if (process.env.HEADLESS) {
      browserArgs.push('--headless=new')

      if (slowMo > 0) {
        console.warn('[WARNING] Slow motion makes no sense in headless mode. It will be ignored!')
      }
    }

    const context = await chromium.launchPersistentContext(_contextPath, {
      headless: false,
      args: browserArgs,
      slowMo: process.env.HEADLESS ? 0 : slowMo
    })

    _metamaskPage = await waitForExtensionOnLoadPage(context)

    await unlockWallet(_metamaskPage, walletSetup.walletPassword)

    await use(context)

    await context.close()
  },
  extensionId: async ({ context }, use) => {
    if (_extensionId) {
      await use(_extensionId)
    }

    _extensionId = await getExtensionId(context, 'MetaMask')

    await use(_extensionId)
  },
  metamaskPage: async ({ context: _ }, use) => {
    await use(_metamaskPage)
  }
})

export const testWithSynpress = (
  walletSetup: ReturnType<typeof defineWalletSetup>,
  unlockWallet: UnlockWalletFunction,
  slowMo?: number
) => {
  // biome-ignore lint/suspicious/noExplicitAny: satisfying TypeScript here - this type doesn't matter since we are overriding it
  return base.extend<PublicSynpressFixtures>(synpressFixtures(walletSetup, unlockWallet, slowMo) as any)
}
