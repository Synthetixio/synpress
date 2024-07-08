import type { BrowserContext, Page } from '@playwright/test'
import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { PhantomWallet } from '../../src'
import { getExtensionId } from '../../src/fixtureActions'

const PASSWORD = '12345678'
const SECRET_WORDS = 'miss lock clip bicycle once road marble stay stereo bar change home'

const importPhantomWallet = defineWalletSetup(PASSWORD, async (context: BrowserContext, phantomPage: Page) => {
  const extensionId = await getExtensionId(context, 'phantom')
  const phantom = new PhantomWallet(phantomPage, context, PASSWORD, extensionId)

  try {
    await phantom.importWallet({ secretWords: SECRET_WORDS, password: PASSWORD })
  } catch (e) {
    console.log('Error creating Keplr wallet:', e)
  }
})

export default importPhantomWallet
