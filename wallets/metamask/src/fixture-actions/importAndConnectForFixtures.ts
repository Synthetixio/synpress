import type { Page } from '@playwright/test'
import { MetaMask } from '..'

export async function importAndConnectForFixtures(page: Page, seedPhrase: string, password: string, extensionId: string) {
  const metamask = new MetaMask(page.context(), page, password, extensionId)

  await metamask.importWallet(seedPhrase)
  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleDismissSecretRecoveryPhraseReminder()

  const newPage = await page.context().newPage()

  await newPage.goto('http://localhost:9999')

  await newPage.locator('#connectButton').click()

  await metamask.connectToDapp()

  await newPage.close()
}
