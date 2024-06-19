import path from 'node:path'
import { type Page, chromium } from '@playwright/test'

import { test as base } from '@playwright/test'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-utils'
import { prepareExtension } from '@synthetixio/synpress-utils'
import fs from 'fs-extra'
import { KeplrWallet } from '../KeplrWallet'
import { getExtensionId } from '../fixtureActions'
import { persistLocalStorage } from '../fixtureActions/persistLocalStorage'
import unlockForFixtures from '../fixtureActions/unlockForFixtures'
import { PASSWORD } from '../utils'

type KeplrFixtures = {
  _contextPath: string
  keplr: KeplrWallet
  keplrPage: Page
  extensionId: string
}

let _keplrPage: Page

export const keplrFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  console.log(walletSetup, 'ee')
  return base.extend<KeplrFixtures>({
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

      const keplrPath = await prepareExtension('Keplr')
      // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
      const browserArgs = [`--disable-extensions-except=${keplrPath}`, '--enable-features=SharedClipboardUI']
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

      const extensionId = await getExtensionId(context, 'Keplr')

      _keplrPage = context.pages()[0] as Page

      await _keplrPage.goto(`chrome-extension://${extensionId}/popup.html`)

      await unlockForFixtures(_keplrPage, PASSWORD)

      await use(context)
    },
    keplrPage: async ({ context: _ }, use) => {
      await use(_keplrPage)
    },
    extensionId: async ({ context }, use) => {
      const extensionId = await getExtensionId(context, 'Keplr')

      await use(extensionId)
    },
    keplr: async ({ context, extensionId }, use) => {
      const keplrWallet = new KeplrWallet(_keplrPage, context, PASSWORD, extensionId)

      await use(keplrWallet)
    },

    page: async ({ page }, use) => {
      await page.goto('https://wallet.keplr.app/')
      await use(page)
    }
  })
}
