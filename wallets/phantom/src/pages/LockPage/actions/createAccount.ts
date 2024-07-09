import type { Page } from '@playwright/test'
import { lockPageElements } from '../selectors'

export const createAccount = async (page: Page, password: string) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(lockPageElements.firstTimeFlowPageElements.createWalletButton)

  const walletInput = await page.locator(lockPageElements.firstTimeFlowImportPageElements.passwordInput)
  await walletInput.fill(password)

  const confirmWalletInput = await page.locator(lockPageElements.firstTimeFlowImportPageElements.confirmPasswordInput)
  await confirmWalletInput.fill(password)

  const checkbox = await page.locator(lockPageElements.firstTimeFlowImportPageElements.termsCheckbox)
  await checkbox.click()

  await page.click(lockPageElements.firstTimeFlowImportPageElements.confirmWordsButton)

  await page.click(lockPageElements.firstTimeFlowImportPageElements.savedWordsCheckbox)

  await page.click(lockPageElements.firstTimeFlowImportPageElements.confirmWordsButton)

  await page.click(lockPageElements.firstTimeFlowImportPageElements.confirmWordsButton)
}
