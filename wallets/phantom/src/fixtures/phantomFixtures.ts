import path from 'node:path'
import { type Page, chromium } from '@playwright/test'

import { test as base } from '@playwright/test'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import { prepareExtension } from '@synthetixio/synpress-cache'
import fs from 'fs-extra'
import { PhantomWallet } from '../PhantomWallet'
import { getExtensionId } from '../fixtureActions'
import { persistLocalStorage } from '../fixtureActions/persistLocalStorage'
// import unlockForFixtures from '../fixtureActions/unlockForFixtures'

const PASSWORD = '12345678'

type PhantomFixtures = {
  _contextPath: string
  phantom: PhantomWallet
  phantomPage: Page
  extensionId: string
}

let _phantomPage: Page

export const phantomFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  return base.extend<PhantomFixtures>({
    _contextPath: async ({ browserName }, use, testInfo) => {
      const contextDir = await createTempContextDir(browserName, testInfo.testId)

      await use(contextDir)

      const error = await removeTempContextDir(contextDir)
      if (error) {
        console.log('contextDir', error)
      }
    },
    context: async ({ context: currentContext, _contextPath }, use) => {
      // @todo: This is some weird behaviour, if there is only 1 setup file the hash function will always produce a different hash than cache.
      const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, walletSetup.hash)
      if (!(await fs.exists(cacheDirPath))) {
        throw new Error(`Cache for ${cacheDirPath} does not exist. Create it first!`)
      }

      // Copying the cache to the temporary context directory.
      await fs.copy(cacheDirPath, _contextPath)

      const phantomPath = await prepareExtension('Phantom')
      // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
      const browserArgs = [`--disable-extensions-except=${phantomPath}`, '--enable-features=SharedClipboardUI']
      if (process.env.HEADLESS) {
        browserArgs.push('--headless=new')

        if (slowMo) {
          console.warn('[WARNING] Slow motion makes no sense in headless mode. It will be ignored!')
        }
      }

      const context = await chromium.launchPersistentContext(_contextPath, {
        headless: false,
        args: browserArgs,
        slowMo: process.env.HEADLESS ? 0 : 2000
      })

      const { cookies, origins } = await currentContext.storageState()

      if (cookies) {
        await context.addCookies(cookies)
      }
      if (origins && origins.length > 0) {
        await persistLocalStorage(origins, context)
      }

      const extensionId = await getExtensionId(context, 'Phantom')

      _phantomPage = context.pages()[0] as Page

      await _phantomPage.goto(`chrome-extension://${extensionId}/popup.html`)

      // await unlockForFixtures(_phantomPage, PASSWORD)

      await use(context)
    },
    phantomPage: async ({ context: _ }, use) => {
      await use(_phantomPage)
    },
    extensionId: async ({ context }, use) => {
      const extensionId = await getExtensionId(context, 'Keplr')

      await use(extensionId)
    },
    phantom: async ({ context, extensionId }, use) => {
      const phantomWallet = new PhantomWallet(_phantomPage, context, PASSWORD, extensionId)

      await use(phantomWallet)
    },

    page: async ({ page }, use) => {
      await page.goto('')
      await use(page)
    }
  })
}
