import path from 'node:path'
import { type Page, chromium } from '@playwright/test'

import { test as base } from '@playwright/test'
import { KeplrWallet } from '../KeplrWallet'
import { SEED_PHRASE } from '../utils'
import {
  CACHE_DIR_NAME,
  createTempContextDir,
  defineWalletSetup,
  removeTempContextDir
} from '@synthetixio/synpress-cache'
import { type Anvil, type CreateAnvilOptions, createPool } from '@viem/anvil'
import fs from 'fs-extra'
import { persistLocalStorage } from '../fixtureActions/persistLocalStorage'

export const keplrFixtures = () => {
  return base.extend<{ keplrWallet: KeplrWallet }>({
    page: async ({ context }, use) => {
      const page = await context.newPage()

      await page.goto('/')

      await use(page)
    },
    keplrWallet: async ({ page }, use) => {
      const keplrWallet = new KeplrWallet(page)
      await keplrWallet.importWallet(SEED_PHRASE, 'password')
      await use(keplrWallet)
    },
  })
}