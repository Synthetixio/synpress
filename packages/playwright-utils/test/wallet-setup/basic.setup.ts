import { defineWalletSetup } from 'core'
import { OnboardingPage } from 'metamask'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (_, walletPage) => {
  const onboardingPage = new OnboardingPage(walletPage)

  await onboardingPage.importWallet(SEED_PHRASE, PASSWORD)

  await walletPage.getByTestId('selected-account-click').click()
})
