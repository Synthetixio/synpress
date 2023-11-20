import { defineWalletSetup } from 'core'
import { MetaMask } from '../../../src'
import { waitFor } from '../../../src/utils/waitFor'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)

  const recoveryPhraseReminder = walletPage.locator(metamask.homePage.selectors.recoveryPhraseReminder.gotItButton)

  const isRecoveryPhraseReminderVisible = await waitFor(() => recoveryPhraseReminder.isVisible(), 3_000, false)
  if (isRecoveryPhraseReminderVisible) {
    await recoveryPhraseReminder.click()
  }
})
