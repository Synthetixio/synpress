import type { BrowserContext, Page } from '@playwright/test'
import { defineWalletSetup } from '@synthetixio/synpress-utils'
import { KeplrWallet } from '../../src'
import { getExtensionId } from '../../src/fixtureActions'

const SEED_PHRASE =
  'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology'
const PASSWORD = 'Test1234'

const importKeplrSetup = defineWalletSetup(PASSWORD, async (context: BrowserContext, keplrPage: Page) => {
  const extensionId = await getExtensionId(context, 'keplr')

  const keplr = new KeplrWallet(keplrPage, context, PASSWORD, extensionId)
  await keplr.setupWallet({ secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
})

export default importKeplrSetup
