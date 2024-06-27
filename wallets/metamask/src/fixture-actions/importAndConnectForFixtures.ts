import type { Page } from '@playwright/test'
import { MetaMask } from '..'
import { retryIfMetaMaskCrashAfterUnlock } from '..'
import { closePopover } from '../pages/HomePage/actions'

export async function importAndConnectForFixtures(
  page: Page,
  seedPhrase: string,
  password: string,
  extensionId: string
) {
  const metamask = new MetaMask(page.context(), page, password, extensionId)

  await metamask.importWallet(seedPhrase)

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus

  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleDismissSecretRecoveryPhraseReminder()

  await page.goto(`chrome-extension://${extensionId}/home.html`)

  await retryIfMetaMaskCrashAfterUnlock(page)

  await closePopover(page)

  const newPage = await page.context().newPage()

  await newPage.goto('http://localhost:9999')

  await newPage.locator('#connectButton').click()

  await metamask.connectToDapp()

  await newPage.close()
}
