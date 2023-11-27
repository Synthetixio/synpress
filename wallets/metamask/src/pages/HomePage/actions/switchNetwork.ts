import type { Page } from '@playwright/test'
import { allTextContents } from '../../../utils/allTextContents'
import Selectors from '../selectors'
import { closeRecoveryPhraseReminder } from './popups'

export async function switchNetwork(page: Page, networkName: string) {
  await page.locator(Selectors.networkDropdown.dropdownButton).click()

  const networkLocators = await page.locator(Selectors.networkDropdown.networks).all()

  const networkNames = await allTextContents(networkLocators)

  const seekedNetworkNames = networkNames.filter((name) => name.toLocaleLowerCase() === networkName.toLocaleLowerCase())

  if (seekedNetworkNames.length === 0) {
    throw new Error(`[SwitchNetwork] Network with name ${networkName} not found`)
  }

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  const accountIndex = networkNames.indexOf(seekedNetworkNames[0]!) // TODO: handle the undefined here better

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  await networkLocators[accountIndex]!.click() // TODO: handle the undefined here better

  // TODO: This is not really needed if we do `metamask.toggleDismissSecretRecoveryPhraseReminder()` by default. Figure this out!
  await closeRecoveryPhraseReminder(page)
}
