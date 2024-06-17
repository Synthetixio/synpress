import path from 'node:path'
import { type Page, chromium } from '@playwright/test'

import { test as base } from '@playwright/test'
import { KeplrWallet } from '../KeplrWallet'
import { PASSWORD } from '../utils'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import fs from 'fs-extra'
import { persistLocalStorage } from '../fixtureActions/persistLocalStorage'
import { prepareExtension, getExtensionId } from '../fixtureActions'
//import unlockForFixtures from '../fixtureActions/unlockForFixtures'

type KeplrFixtures = {
  _contextPath: string
  keplr: KeplrWallet
  keplrPage: Page
  extensionId: string
}

let _keplrPage: Page

export const keplrFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  console.log('walletSetup', walletSetup)
  return base.extend<KeplrFixtures>({
    _contextPath: async ({ browserName }, use, testInfo) => {
      const contextDir = await createTempContextDir(browserName, testInfo.testId)
      await use(contextDir)
      await removeTempContextDir(contextDir)
    },
    context: async ({ context: currentContext, _contextPath }, use) => {
      const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, 'dbfc33f5185f468a2b25')
      if (!(await fs.exists(cacheDirPath))) {
        throw new Error(`Cache for ${cacheDirPath} does not exist. Create it first!`)
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
        slowMo: process.env.HEADLESS ? 0 : 100000,
      })

      console.log("Cookies before login:", await context.cookies());
      console.log('1')
      const { cookies, origins } = await currentContext.storageState()
      console.log('2')
      if (cookies) {
        await context.addCookies(cookies)
      }
      console.log('3', use)
      if (origins && origins.length > 0) {
        await persistLocalStorage(origins, context)
      }
      // console.log('4')
      // // console.log('context', context, origins, cookies, currentContext, walletSetup)
      // await use(context)
      // console.log('5')
      // await context.close()
      // console.log('6')
    },
    page: async ({ context }, use) => {
      const page = await context.newPage()
      await use(page)
    },
    keplrPage: async ({ context }, use) => {
      const keplrPage = await context.newPage();
      await use(keplrPage);
    },
    keplr: async ({ context }, use) => {
      const extensionId = await getExtensionId(context, 'keplr')
      const keplrWallet = new KeplrWallet(_keplrPage, context, extensionId, PASSWORD)
      await use(keplrWallet)
    },
  })
}