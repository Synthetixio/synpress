import path from 'node:path'
import { type Page, chromium } from '@playwright/test'
import { test as base } from '@playwright/test'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import { type Anvil, type CreateAnvilOptions, createPool } from '@viem/anvil'
import fs from 'fs-extra'
import { prepareExtension } from '../../prepareExtension'
import { MetaMask } from '../MetaMask'
import { getExtensionId, unlockForFixture } from '../fixture-actions'
import { persistLocalStorage } from '../fixture-actions/persistLocalStorage'
import { waitForMetaMaskWindowToBeStable } from '../utils/waitFor'

type MetaMaskFixtures = {
  _contextPath: string
  metamask: MetaMask
  extensionId: string
  metamaskPage: Page
  createAnvilNode: (options?: CreateAnvilOptions) => Promise<{ anvil: Anvil; rpcUrl: string; chainId: number }>
  connectToAnvil: () => Promise<void>
  deployToken: () => Promise<void>
  deployAndMintERC1155: () => Promise<void>
}

// If setup metamaskPage in a fixture, browser does not handle it properly (even if ethereum.isConnected() is true, it's not reflected on the page).
let _metamaskPage: Page

export const metaMaskFixtures = (walletSetup: ReturnType<typeof defineWalletSetup>, slowMo = 0) => {
  return base.extend<MetaMaskFixtures>({
    _contextPath: async ({ browserName }, use, testInfo) => {
      const contextPath = await createTempContextDir(browserName, testInfo.testId)

      await use(contextPath)

      const error = await removeTempContextDir(contextPath)
      if (error) {
        console.error(error)
      }
    },
    context: async ({ context: currentContext, _contextPath }, use) => {
      const { walletPassword, hash } = walletSetup

      const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME, hash)
      if (!(await fs.exists(cacheDirPath))) {
        throw new Error(`Cache for ${hash} does not exist. Create it first!`)
      }

      // Copying the cache to the temporary context directory.ž
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

      const { cookies, origins } = await currentContext.storageState()

      if (cookies) {
        await context.addCookies(cookies)
      }
      if (origins && origins.length > 0) {
        await persistLocalStorage(origins, context)
      }

      // TODO: This should be stored in a store to speed up the tests.
      const extensionId = await getExtensionId(context, 'MetaMask')

      // TODO: Not sure if this is the best approach. Time will tell.
      // We're utilizing the blank page here.
      _metamaskPage = context.pages()[0] as Page

      await _metamaskPage.goto(`chrome-extension://${extensionId}/home.html`)
      await waitForMetaMaskWindowToBeStable(_metamaskPage)
      await unlockForFixture(_metamaskPage, walletPassword)

      await use(context)

      await context.close()
    },
    metamaskPage: async ({ context: _ }, use) => {
      await use(_metamaskPage)
    },
    extensionId: async ({ context }, use) => {
      const extensionId = await getExtensionId(context, 'MetaMask')

      await use(extensionId)
    },
    metamask: async ({ context, extensionId }, use) => {
      const { walletPassword } = walletSetup

      const metamask = new MetaMask(context, _metamaskPage, walletPassword, extensionId)

      await use(metamask)
    },
    page: async ({ page }, use) => {
      await page.goto('/')

      await use(page)
    },
    createAnvilNode: async ({ context: _ }, use) => {
      const pool = createPool()

      await use(async (options?: CreateAnvilOptions) => {
        const nodeId = Array.from(pool.instances()).length
        const anvil = await pool.start(nodeId, options)

        const rpcUrl = `http://${anvil.host}:${anvil.port}`

        const DEFAULT_ANVIL_CHAIN_ID = 31337
        const chainId = options?.chainId ?? DEFAULT_ANVIL_CHAIN_ID

        return { anvil, rpcUrl, chainId }
      })

      await pool.empty()
    },
    connectToAnvil: async ({ metamask, createAnvilNode }, use) => {
      await use(async () => {
        const { rpcUrl, chainId } = await createAnvilNode({
          chainId: 1338
        })

        await metamask.addNetwork({
          name: 'Anvil',
          rpcUrl,
          chainId,
          symbol: 'ETH',
          blockExplorerUrl: 'https://etherscan.io/'
        })
      })
    },
    deployToken: async ({ page, metamask, connectToAnvil }, use) => {
      await use(async () => {
        await connectToAnvil()

        await page.locator('#createToken').click()

        await metamask.confirmTransaction()
      })
    },
    deployAndMintERC1155: async ({ page, metamask, connectToAnvil }, use) => {
      await use(async () => {
        await connectToAnvil()

        await page.locator('#deployERC1155Button').click()
        await metamask.confirmTransaction()

        await page.locator('#batchMintButton').click()
        await metamask.confirmTransactionAndWaitForMining()
      })
    }
  })
}
