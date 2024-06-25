import type { Page } from '@playwright/test'
import { toggle } from '../../../utils/toggle'
import Selectors from '../selectors'
import type { SettingsSidebarMenus } from '../selectors/settings'

async function openSettings(page: Page) {
  await page.locator(Selectors.threeDotsMenu.threeDotsButton).click()
  await page.locator(Selectors.threeDotsMenu.settingsButton).click()
}

async function openSidebarMenu(page: Page, menu: SettingsSidebarMenus) {
  await page.locator(Selectors.settings.sidebarMenu(menu)).click()
}

async function resetAccount(page: Page) {
  const buttonSelector = `[data-testid="advanced-setting-reset-account"] button`
  const confirmButtonSelector = '.modal .modal-container__footer button.btn-danger-primary'

  await page.locator(buttonSelector).click()
  await page.locator(confirmButtonSelector).click()
}

async function toggleDismissSecretRecoveryPhraseReminder(page: Page) {
  const toggleLocator = page.locator(Selectors.settings.advanced.dismissSecretRecoveryPhraseReminderToggle)
  await toggle(toggleLocator)
}

const advanced = {
  resetAccount,
  toggleDismissSecretRecoveryPhraseReminder
}

export const settings = {
  openSettings,
  openSidebarMenu,
  advanced
}
