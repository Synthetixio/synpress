import path from 'node:path'
import { type Page, chromium } from '@playwright/test'

import { test as base } from '@playwright/test'
import { KeplrWallet } from '../KeplrWallet'
import { PASSWORD, SEED_PHRASE } from '../utils'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import { type Anvil, type CreateAnvilOptions } from '@viem/anvil'
import fs from 'fs-extra'
import { persistLocalStorage } from '../fixtureActions/persistLocalStorage'
import { prepareExtension, getExtensionId, unlockForFixture } from '../fixtureActions'

type KeplrFixtures = {
  _contextPath: string
  keplr: KeplrWallet
  extensionId: string
  keplrPage: Page
  createAnvilNode: (options?: CreateAnvilOptions) => Promise<{ anvil: Anvil; rpcUrl: string; chainId: number }>
  connectToAnvil: () => Promise<void>
}

let _keplrPage: Page

export const keplrFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  return base.extend<KeplrFixtures>({
    _contextPath: async ({ browserName }, use, testInfo) => {
      const contextDir = await createTempContextDir(browserName, testInfo.testId)
      await use(contextDir)
      await removeTempContextDir(contextDir)
    },
    context: async ({ context: currentContext, _contextPath }, use) => {
      const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, walletSetup.hash)
      if (!(await fs.exists(cacheDirPath))) {
        throw new Error(`Cache for ${walletSetup.hash} does not exist. Create it first!`)
      }

      // Copying the cache to the temporary context directory.
      await fs.copy(cacheDirPath, _contextPath)

      const keplrPath = await prepareExtension()
      // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
      const browserArgs = [`--disable-extensions-except=${keplrPath}`]

      if (process.env.HEADLESS) {
        browserArgs.push('--headless=new')

        if (slowMo) {
          console.warn('[WARNING] Slow motion makes no sense in headless mode. It will be ignored!')
        }
      }

      const context = await chromium.launchPersistentContext(_contextPath, {
        headless: false,
        args: browserArgs,
        slowMo: process.env.HEADLESS ? 0 : slowMo
      })


      const { cookies, origins } = await currentContext.storageState()

      if (cookies) {
        await context.addCookies(cookies)
      }
      if (origins && origins.length > 0) {
        await persistLocalStorage(origins, context)
      }

      const extensionId = await getExtensionId(context, 'keplr')

      _keplrPage = await context.newPage() as Page

      await _keplrPage.goto('chrome-extension://' + extensionId + '/popup.html')

      await unlockForFixture(_keplrPage, PASSWORD)

      await use(context)

      await context.close()
    },
    page: async ({ context }, use) => {
      const page = await context.newPage()

      await page.goto('/')

      await use(page)
    },
    keplrPage: async ({ context: _ }, use) => {
      await use(_keplrPage)
    },
    keplr: async ({ context, extensionId }, use) => {
      const keplrWallet = new KeplrWallet(_keplrPage, context, extensionId, PASSWORD)
      await keplrWallet.importWallet(SEED_PHRASE, 'password')
      await use(keplrWallet)
    },
  })
}