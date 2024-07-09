import type { Page } from '@playwright/test'
import { lockPageElements } from '../selectors'

export const createAccount = async (page: Page, password: string) => {
  console.log(lockPageElements, page, password)
  // await page.click(lockPageElements.firstTimeFlowPageElements.importWalletButton)
  // await page.click(lockPageElements.firstTimeFlowPageElements.importRecoveryPhraseButton)

  // for (const [index, word] of secretWords.split(' ').entries()) {
  //   const inputField = await page.locator(lockPageElements.firstTimeFlowImportPageElements.secretWordsInput(index))
  //   await inputField.fill(word)
  // }
  // await page.click(lockPageElements.firstTimeFlowImportPageElements.confirmWordsButton)

  // await page.waitForLoadState('domcontentloaded')

  // await page.click(lockPageElements.firstTimeFlowImportPageElements.confirmWordsButton)

  // const walletInput = await page.locator(lockPageElements.firstTimeFlowImportPageElements.passwordInput)
  // await walletInput.fill(password)

  // const confirmWalletInput = await page.locator(lockPageElements.firstTimeFlowImportPageElements.confirmPasswordInput)
  // await confirmWalletInput.fill(password)

  // const checkbox = await page.locator(lockPageElements.firstTimeFlowImportPageElements.termsCheckbox)
  // await checkbox.click()

  // await page.click(lockPageElements.firstTimeFlowImportPageElements.continueAfterPasswordButton)

  // await page.click(lockPageElements.firstTimeFlowImportPageElements.getStartedButton);

  // return true;
}
