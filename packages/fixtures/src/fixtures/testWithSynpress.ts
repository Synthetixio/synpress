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
import { defineWalletSetup } from '@synthetixio/synpress-core'
import { createTempContextDir, removeTempContextDir } from '@synthetixio/synpress-core'
import { CACHE_DIR_NAME, prepareExtension } from '@synthetixio/synpress-core'
import { type Anvil, type CreateAnvilOptions, createPool } from '@viem/anvil'
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
  createAnvilNode: (options?: CreateAnvilOptions) => Promise<{ anvil: Anvil; rpcUrl: string; chainId: number }>
}

type SynpressFixtures = TestFixtures & PrivateSynpressFixtures & PublicSynpressFixtures

// TODO: Bad practice. Use a store!
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

    // TODO: This should be stored in a store to speed up the tests.
    const extensionId = await getExtensionId(context, 'MetaMask')

    // TODO: Not sure if this is the best approach. Time will tell.
    // We're utilizing the blank page here.
    _metamaskPage = context.pages()[0] as Page

    await _metamaskPage.goto(`chrome-extension://${extensionId}/home.html`)

    await _metamaskPage.reload()

    await unlockWallet(_metamaskPage, walletSetup.walletPassword)

    await use(context)

    await context.close()
  },
  extensionId: async ({ context }, use) => {
    const extensionId = await getExtensionId(context, 'MetaMask')

    await use(extensionId)
  },
  metamaskPage: async ({ context: _ }, use) => {
    await use(_metamaskPage)
  },
  // TODO: We should be able to use this in a wallet setup. This will be possible when we add a store.
  // TODO: ^ Thanks to this we won't have to rely on MetaMask RPC for initial connection, which will increase the speed of the tests.
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
  }
})

/**
 *  The factory function for the `test` fixture from Playwright extended with Synpress fixtures.
 *
 * @param walletSetup - An object returned from the `defineWalletSetup` function.
 * @param walletSetup.hash - Hash of the cached wallet setup function.
 * @param walletSetup.fn - The wallet setup function itself.
 * @param walletSetup.walletPassword - The password of the wallet.
 * @param unlockWallet - A function that unlocks the wallet.
 * @param slowMo - Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on. Defaults to `0`.
 *
 * @returns The `test` fixture from Playwright extended with Synpress fixtures. See: https://playwright.dev/docs/api/class-test#test-call.
 */
export const testWithSynpress = (
  walletSetup: ReturnType<typeof defineWalletSetup>,
  unlockWallet: UnlockWalletFunction,
  slowMo?: number
) => {
  // biome-ignore lint/suspicious/noExplicitAny: satisfying TypeScript here - this type doesn't matter since we are overriding it
  return base.extend<PublicSynpressFixtures>(synpressFixtures(walletSetup, unlockWallet, slowMo) as any)
}
