import { defineWalletSetup } from 'core'
import { getExtensionId } from 'fixtures'
import { MetaMask } from '../../../src'
import { waitFor } from '../../../src/utils/waitFor'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)

  const recoveryPhraseReminder = walletPage.locator(metamask.homePage.selectors.recoveryPhraseReminder.gotItButton)

  const isRecoveryPhraseReminderVisible = await waitFor(recoveryPhraseReminder, 'visible', 3_000, false)
  if (isRecoveryPhraseReminderVisible) {
    await recoveryPhraseReminder.click()
  }

  const page = await context.newPage()

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#connectButton').click()

  await metamask.connectToDapp()

  await page.close()
})
