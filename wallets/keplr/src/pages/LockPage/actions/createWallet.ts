import type { Page } from '@playwright/test'
import clipboardy from 'clipboardy'
import { onboardingElements } from '../selectors'

export async function createWallet(page: Page, password: string) {
  await page.waitForLoadState('domcontentloaded')
  const createButton = await page.getByText(onboardingElements.createWalletButton)
  await createButton.click()

  const createNewRecoveryPhraseButton = await page.getByText(onboardingElements.createNewRecoveryPhraseButton)
  await createNewRecoveryPhraseButton.click()

  const showMyPhraseButton = await page.getByText(onboardingElements.showMyPhraseButton)
  await showMyPhraseButton.click()

  const copyToClipboardButton = await page.getByText(onboardingElements.copyToClipboardButton)
  await copyToClipboardButton.click()

  const mnemonicPhraseArray = clipboardy.readSync().split(' ');

  const nextButton = await page.getByText(onboardingElements.createNextButton)
  await nextButton.click()

  const inputFields = page.locator(onboardingElements.phraseInput)
  const inputCount = await inputFields.count()

  for (let i = 0; i < inputCount; i++) {
    const inputField = inputFields.nth(i)
    if (mnemonicPhraseArray[i]) {
      await inputField.fill(mnemonicPhraseArray[i] || '')
    }
  }

  // @todo: There is a security feature with Keplr that requires you to input numbers from your mnemonic phrase.
  const walletInput = await page.locator(onboardingElements.walletInput)
  await walletInput.fill(onboardingElements.walletName)

  const confirmCopyNext = await page.getByRole('button', { name: 'Next', exact: true })
  await confirmCopyNext.click()
  await page.close()
  const passwordInput = await page.locator(onboardingElements.passwordInput)
  await passwordInput.fill(password)

  const confirmPasswordInput = await page.locator(onboardingElements.confirmPasswordInput)
  await confirmPasswordInput.fill(password)

  const submitWalletDataButton = await page.getByRole('button', { name: 'Next', exact: true })
  await submitWalletDataButton.click()
  const submitChainButton = await page.getByRole('button', { name: 'Save', exact: true })
  await submitChainButton.click()

  await page.close()
}
