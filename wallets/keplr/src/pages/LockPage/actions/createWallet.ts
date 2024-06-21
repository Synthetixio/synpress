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

  const mnemonicPhraseArray = clipboardy.readSync().split(' ')

  const nextButton = await page.getByRole('button', { name: 'Next', exact: true })
  await nextButton.click()

  const elements = await page.getByText(/Word #\d+/, { exact: true }).all()
  const wordLabels = await Promise.all(elements.map((element) => element))

  await page.waitForSelector(onboardingElements.focusedInput)

  // match the requested phrase words with the copied mnemonic phrase
  for (const wordLabel of wordLabels) {
    const wordLabelText = await wordLabel.innerText()
    const wordNumber = Number(wordLabelText.split('Word #')[1]) - 1
    const wordInputElement = wordLabel.locator('..').locator('input').first()
    await wordInputElement.fill(mnemonicPhraseArray[wordNumber])
  }

  const walletInput = await page.locator(onboardingElements.walletInput)
  await walletInput.fill(onboardingElements.walletName)

  const passwordInput = await page.locator(onboardingElements.passwordInput)
  await passwordInput.fill(password)

  const confirmPasswordInput = await page.locator(onboardingElements.confirmPasswordInput)
  await confirmPasswordInput.fill(password)

  const submitWalletDataButton = await page.locator(onboardingElements.createNextButton)
  await submitWalletDataButton.click()

  const submitChainButton = await page.getByRole('button', { name: 'Save', exact: true })
  await submitChainButton.click()

  await page.close()
}
