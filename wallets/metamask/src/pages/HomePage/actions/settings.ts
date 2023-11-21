import type { Locator, Page } from '@playwright/test'
import { waitFor } from '../../../utils/waitFor'
import Selectors from '../selectors'
import type { SettingsSidebarMenus } from '../selectors/settings'

async function openSettings(page: Page) {
  await page.locator(Selectors.accountMenu.accountMenuButton).click()
  await page.locator(Selectors.accountMenu.settingsButton).click()
}

async function openSidebarMenu(page: Page, menu: SettingsSidebarMenus) {
  await page.locator(Selectors.settings.sidebarMenu(menu)).click()
}

async function toggle(toggleLocator: Locator) {
  // TODO: Extract timeout
  const classes = await toggleLocator.getAttribute('class', { timeout: 3_000 })

  if (!classes) {
    throw new Error('[ToggleShowTestNetworks] Toggle class returned null')
  }

  const isOn = classes.includes('toggle-button--on')

  await toggleLocator.click()

  const waitForAction = async () => {
    const classes = await toggleLocator.getAttribute('class')

    if (!classes) {
      throw new Error('[ToggleShowTestNetworks] Toggle class returned null inside waitFor')
    }

    if (isOn) {
      return classes.includes('toggle-button--off')
    }

    return classes.includes('toggle-button--on')
  }

  // TODO: Extract timeout
  await waitFor(waitForAction, 3_000, true)
}

async function toggleShowTestNetworks(page: Page) {
  // .nth(0) -> Show conversion on test networks
  // .nth(1) -> Show test networks
  const toggleLocator = page.locator(Selectors.settings.advanced.showTestNetworksToggle).nth(1)
  await toggle(toggleLocator)
}

async function toggleImprovedTokenAllowanceExperience(page: Page) {
  const toggleLocator = page.locator(Selectors.settings.experimental.toggleImprovedTokenAllowanceExperience)
  await toggle(toggleLocator)
}

const advanced = {
  toggleShowTestNetworks
}

const experimental = {
  toggleImprovedTokenAllowanceExperience
}

export const settings = {
  openSettings,
  openSidebarMenu,
  advanced,
  experimental
}
