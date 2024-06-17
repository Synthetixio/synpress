import test from '../synpress'
//const { expect } = test
import { getExtensionId } from '../../src/fixtureActions'
import { PASSWORD, SEED_PHRASE } from '../../src'

test.only('should get address', async ({ context, keplr }) => {
  const extensionId = await getExtensionId(context, 'keplr')
  console.log('6')
  const page = await context.newPage()
  console.log('7')
  await keplr.setupWallet(page, { secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
  console.log('8')
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await keplr.getWalletAddress(page)

})