import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/OnboardingPage'

const StepSelectors = Selectors.SecretRecoveryPhrasePageSelectors.recoveryStep

export async function confirmSecretRecoveryPhrase(page: Page, seedPhrase: string) {
  const seedPhraseWords = seedPhrase.split(' ')
  const seedPhraseLength = seedPhraseWords.length

  // TODO: This should be validated!
  await page
    .locator(StepSelectors.selectNumberOfWordsDropdown)
    .selectOption(StepSelectors.selectNumberOfWordsOption(seedPhraseLength))

  for (const [index, word] of seedPhraseWords.entries()) {
    await page.locator(StepSelectors.secretRecoveryPhraseWord(index)).fill(word)
  }

  const confirmSRPButton = page.locator(StepSelectors.confirmSecretRecoveryPhraseButton)

  if (await confirmSRPButton.isDisabled()) {
    const errorText = await page.locator(StepSelectors.error).textContent({
      timeout: 1000
    })

    throw new Error(`[ConfirmSecretRecoveryPhrase] Invalid seed phrase. Error from MetaMask: ${errorText}`)
  }

  await confirmSRPButton.click()
}
