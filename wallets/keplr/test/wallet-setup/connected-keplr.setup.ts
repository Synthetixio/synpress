import { defineWalletSetup } from "@synthetixio/synpress-cache";
import { KeplrWallet } from "../../src";
import { getExtensionId, prepareExtension } from "../../src/fixtureActions";

const SEED_PHRASE = 'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology'
const PASSWORD = 'Test1234'

export default defineWalletSetup(PASSWORD, async (context, lockPage) => {
  await prepareExtension()
  console.log('Extension', context)
  const extensionId = await getExtensionId(context, 'keplr')
  const keplr = new KeplrWallet(lockPage, context, PASSWORD, extensionId)
  console.log('SEEDP', SEED_PHRASE, PASSWORD)
  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/home.html`)
  const wallet = await keplr.setupWallet(page, { secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD})
  console.log('in here2', wallet)
  // const page = await context.newPage()
  // await page.close()
})