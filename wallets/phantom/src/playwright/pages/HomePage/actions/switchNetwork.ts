import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export async function openTestnetSection(page: Page) {
  const toggleButtonLocator = page.locator(Selectors.networkDropdown.showTestNetworksToggle)
  const classes = await toggleButtonLocator.getAttribute('class')
  if (classes?.includes('toggle-button--off')) {
    await toggleButtonLocator.click()
    await page.locator(Selectors.networkDropdown.toggleOn).isChecked()
  }
}
