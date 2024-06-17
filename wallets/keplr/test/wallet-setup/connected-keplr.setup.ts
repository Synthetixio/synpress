import { defineWalletSetup } from "@synthetixio/synpress-cache";
import { KeplrWallet } from "../../src";
import { getExtensionId } from "../../src/fixtureActions";

const SEED_PHRASE = 'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology'
const PASSWORD = 'Test1234'

export default defineWalletSetup(PASSWORD, async (context, lockPage) => {
  const extensionId = await getExtensionId(context, 'keplr')

  const page = await context.newPage()
  await page.goto(`chrome-extension://${extensionId}/register.html`)
  const keplr = new KeplrWallet(page, context, PASSWORD, extensionId)
  await keplr.setupWallet(page, { secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD})
})