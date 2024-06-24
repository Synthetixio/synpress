import type { BrowserContext, Page } from '@playwright/test'
import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { KeplrWallet } from '../../src'
import { getExtensionId } from '../../src/fixtureActions'

const PASSWORD = 'Test1234'

const createWalletKeplr = defineWalletSetup(PASSWORD, async (context: BrowserContext, keplrPage: Page) => {
  const extensionId = await getExtensionId(context, 'keplr')
  const keplr = new KeplrWallet(keplrPage, context, PASSWORD, extensionId)

  try {
    await keplr.createWallet(PASSWORD)
  } catch (e) {
    console.log('Error creating Keplr wallet:', e)
  }
})

export default createWalletKeplr
