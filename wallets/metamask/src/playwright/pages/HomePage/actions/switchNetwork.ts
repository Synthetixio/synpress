import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { allTextContents } from '../../../utils/allTextContents'
import { closeRecoveryPhraseReminder } from './popups'

async function openTestnetSection(page: Page) {
  const toggleButtonLocator = page.locator(Selectors.networkDropdown.showTestNetworksToggle)
  const classes = await toggleButtonLocator.getAttribute('class')
  if (classes?.includes('toggle-button--off')) {
    await toggleButtonLocator.click()
    await page.locator(Selectors.networkDropdown.toggleOn).isChecked()
  }
}

export async function switchNetwork(page: Page, networkName: string, includeTestNetworks: boolean) {
  await page.locator(Selectors.networkDropdown.dropdownButton).click()

  if (includeTestNetworks) {
    await openTestnetSection(page)
  }

  const networkLocators = await page.locator(Selectors.networkDropdown.networks).all()
  const networkNames = await allTextContents(networkLocators)

  const seekedNetworkNameIndex = networkNames.findIndex(
    (name) => name.toLocaleLowerCase() === networkName.toLocaleLowerCase()
  )

  const seekedNetworkLocator = seekedNetworkNameIndex >= 0 && networkLocators[seekedNetworkNameIndex]

  if (!seekedNetworkLocator) {
    throw new Error(`[SwitchNetwork] Network with name ${networkName} not found`)
  }

  await seekedNetworkLocator.click()

  // TODO: This is not really needed if we do `metamask.toggleDismissSecretRecoveryPhraseReminder()` by default. Figure this out!
  await closeRecoveryPhraseReminder(page)
}
