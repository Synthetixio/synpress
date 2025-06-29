import path from 'node:path'
import { type Page, chromium } from '@playwright/test'
import { test as base } from '@playwright/test'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  type defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import fs from 'fs-extra'
import { prepareExtensionPetra } from '../../prepareExtensionPetra'
import { Petra } from '../Petra'
import { getExtensionIdPetra } from '../fixture-actions'
import { persistLocalStorage } from '../fixture-actions/persistLocalStorage'
import { unlock } from '../pages/UnlockPage/actions'
import { loadAndWaitForPopupPage } from '../utils/loadAndWaitForPopupPage'

type PetraFixtures = {
  _contextPath: string
  petra: Petra
  extensionId: string
  petraPage: Page
}

// If setup petraPage in a fixture, browser does not handle it properly (even if ethereum.isConnected() is true, it's not reflected on the page).
let _petra: Page

export const petraFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  return base.extend<PetraFixtures>({
    _contextPath: async ({ browserName }, use, testInfo) => {
      const contextPath = await createTempContextDir(browserName, testInfo.testId)

      await use(contextPath)

      const error = await removeTempContextDir(contextPath)
      if (error) {
        console.error(error)
      }
    },
    context: async ({ context: currentContext, _contextPath }, use) => {
      const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, walletSetup.hash)
      if (!(await fs.exists(cacheDirPath))) {
        throw new Error(`Cache for ${walletSetup.hash} does not exist. Create it first!`)
      }

      // Copying the cache to the temporary context directory.
      await fs.copy(cacheDirPath, _contextPath)

      const petraPath = await prepareExtensionPetra()

      // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
      const browserArgs = [`--disable-extensions-except=${petraPath}`]

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

      const { cookies, origins } = await currentContext.storageState()

      if (cookies) {
        await context.addCookies(cookies)
      }
      if (origins && origins.length > 0) {
        await persistLocalStorage(origins, context)
      }

      const extensionId = await getExtensionIdPetra(context, 'Petra Aptos Wallet')

      _petra = await loadAndWaitForPopupPage(context, extensionId)

      await unlock(_petra, walletSetup.walletPassword)

      await use(context)

      await context.close()
    },
    petraPage: async ({ context: _ }, use) => {
      await use(_petra)
    },
    extensionId: async ({ context }, use) => {
      const extensionId = await getExtensionIdPetra(context, 'Petra Aptos Wallet')

      await use(extensionId)
    },
    petra: async ({ context, extensionId }, use) => {
      const petra = new Petra(context, _petra, walletSetup.walletPassword, extensionId)

      await use(petra)
    },
    page: async ({ page }, use) => {
      await page.goto(`/`)

      await use(page)
    }
  })
}
