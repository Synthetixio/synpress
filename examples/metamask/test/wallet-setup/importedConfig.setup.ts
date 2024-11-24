import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { MetaMask, getExtensionId } from '@synthetixio/synpress/playwright'
import 'dotenv/config'
import config from '../config'

const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = process.env.WALLET_PASSWORD

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)

  const page = await context.newPage()

  await page.goto(config.baseUrl)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: 'MetaMask' }).click()

  await metamask.connectToDapp()

  await page.waitForTimeout(2000)
  await metamask.confirmSignature()
  await page.waitForTimeout(2000)
})
