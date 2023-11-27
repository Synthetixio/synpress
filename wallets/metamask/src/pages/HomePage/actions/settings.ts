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

async function toggleDismissSecretRecoveryPhraseReminder(page: Page) {
  const toggleLocator = page.locator(Selectors.settings.advanced.dismissSecretRecoveryPhraseReminderToggle)
  await toggle(toggleLocator)
}

const advanced = {
  toggleDismissSecretRecoveryPhraseReminder
}

export const settings = {
  openSettings,
  openSidebarMenu,
  advanced
}
