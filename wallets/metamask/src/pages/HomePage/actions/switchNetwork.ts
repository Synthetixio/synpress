import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function switchNetwork(page: Page, networkName: string) {
  await page.locator(Selectors.networkDropdown.dropdownButton).click()

  const networkLocators = await page.locator(Selectors.networkDropdown.networks).all()

  const networkNames = await page.locator(Selectors.networkDropdown.networks).allTextContents()

  console.log({ networkNames })

  const seekedNetworkNames = networkNames.filter((name) => name.toLocaleLowerCase() === networkName.toLocaleLowerCase())

  if (seekedNetworkNames.length === 0) {
    throw new Error(`[SwitchNetwork] Network with name ${networkName} not found`)
  }

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  const accountIndex = networkNames.indexOf(seekedNetworkNames[0]!) // TODO: handle the undefined here better

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  await networkLocators[accountIndex]!.click() // TODO: handle the undefined here better
}
