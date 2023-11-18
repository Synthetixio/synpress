import type { Page } from '@playwright/test'
import Selectors from '../selectors'
import type { SettingsSidebarMenus } from '../selectors/settings'

async function openSettings(page: Page) {
  await page.locator(Selectors.accountMenu.accountMenuButton).click()
  await page.locator(Selectors.accountMenu.settingsButton).click()
}

async function openSidebarMenu(page: Page, menu: SettingsSidebarMenus) {
  await page.locator(Selectors.settings.sidebarMenu(menu)).click()
}

async function toggleShowTestNetworks(page: Page) {
  // .nth(0) -> Show conversion on test networks
  // .nth(1) -> Show test networks
  await page.locator(Selectors.settings.advanced.showTestNetworksToggle).nth(1).click()
}

const advanced = {
  toggleShowTestNetworks
}

export const settings = {
  openSettings,
  openSidebarMenu,
  advanced
}
