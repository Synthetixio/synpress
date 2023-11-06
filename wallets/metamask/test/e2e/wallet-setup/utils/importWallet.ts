import type { Page } from '@playwright/test'
import { OnboardingPage } from '../../../../src'

export async function importWallet(walletPage: Page, seedPhrase: string, password: string) {
  const onboardingPage = new OnboardingPage(walletPage)

  await onboardingPage.importWallet(seedPhrase, password)
}
