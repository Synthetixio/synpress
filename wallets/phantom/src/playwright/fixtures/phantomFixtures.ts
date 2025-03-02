import path from 'node:path'
import { type Page, chromium } from '@playwright/test'
import { test as base } from '@playwright/test'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import fs from 'fs-extra'
import { prepareExtensionPhantom } from '../../prepareExtensionPhantom'
import { Phantom } from '../Phantom'
import { getExtensionIdPhantom } from '../fixture-actions'
import { persistLocalStorage } from '../fixture-actions/persistLocalStorage'
import { closeSuiAndMonadIfPresent } from '../pages/HomePage/actions/closeSuiAndMonadScreen'
import { unlock } from '../pages/UnlockPage/actions'
import { loadAndWaitForPopupPage } from '../utils/loadAndWaitForPopupPage'

type PhantomFixtures = {
  _contextPath: string
  phantom: Phantom
  extensionId: string
  phantomPage: Page
}

// If setup phantomPage in a fixture, browser does not handle it properly (even if ethereum.isConnected() is true, it's not reflected on the page).
let _phantomPage: Page

export const phantomFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  return base.extend<PhantomFixtures>({
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

      const phantomPath = await prepareExtensionPhantom()

      // We don't need the `--load-extension` arg since the extension is already loaded in the cache.
      const browserArgs = [`--disable-extensions-except=${phantomPath}`]

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

      const extensionId = await getExtensionIdPhantom(context, 'Phantom')

      _phantomPage = await loadAndWaitForPopupPage(context, extensionId)

      await unlock(_phantomPage, walletSetup.walletPassword)

      await use(context)

      await context.close()
    },
    phantomPage: async ({ context: _ }, use) => {
      await closeSuiAndMonadIfPresent(_phantomPage)

      await use(_phantomPage)
    },
    extensionId: async ({ context }, use) => {
      const extensionId = await getExtensionIdPhantom(context, 'Phantom')

      await use(extensionId)
    },
    phantom: async ({ context, extensionId }, use) => {
      const phantom = new Phantom(context, _phantomPage, walletSetup.walletPassword, extensionId)

      await use(phantom)
    },
    page: async ({ page }, use) => {
      await page.goto('/')

      await use(page)
    }
  })
}
