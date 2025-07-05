import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/OnboardingPage'

const StepSelectors = Selectors.SecretRecoveryPhrasePageSelectors.recoveryStep

function generateAlphabets() {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))
}

export async function confirmSecretRecoveryPhrase(page: Page, seedPhrase: string) {
  const seedPhraseWords = seedPhrase.split(' ')

  for (const [index, word] of seedPhraseWords.entries()) {
    const alphabet = generateAlphabets()[index] ?? ''
    await page.locator(StepSelectors.secretRecoveryPhraseWord(alphabet)).fill(word)
  }
}
