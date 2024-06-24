import type { BrowserContext, Page } from '@playwright/test'
import { MetaMask, getExtensionId } from '@synthetixio/synpress'
import { defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = process.env.WALLET_PASSWORD

export default defineWalletSetup(PASSWORD, async (context: BrowserContext, walletPage: Page) => {
  // This is a workaround for the fact that the MetaMask extension ID changes.
  // This workaround won't be needed in the near future! 😁
  const extensionId = await getExtensionId(context, 'MetaMask')

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)

  const page = await context.newPage()

  // Go to a locally hosted MetaMask Test Dapp.
  await page.goto('http://localhost:9999')

  await page.locator('#connectButton').click()

  await metamask.connectToDapp(['Account 1'])
})
