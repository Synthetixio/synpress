import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/SettingsPage'

export default async function enableEthSign(page: Page) {
  // Settings
  await page.locator(Selectors.settings.advancedSettings).click()
  await page.locator(Selectors.settings.ethSignToggle).click()

  // Confirmation modal
  await page.locator(Selectors.confirmationModal.confirmationCheckbox).click()
  await page.locator(Selectors.confirmationModal.continueButton).click()
  await page.locator(Selectors.confirmationModal.manualConfirmationInput).focus()
  await page.locator(Selectors.confirmationModal.manualConfirmationInput).fill('I only sign what I understand')
  await page.locator(Selectors.confirmationModal.enableButton).click()

  // Wait for warning
  await page.locator(Selectors.settings.ethSignWarning).isVisible()
}
