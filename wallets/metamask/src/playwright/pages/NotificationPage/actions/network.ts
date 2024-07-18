import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

const approveNewNetwork = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.NetworkPage.addNetwork.approveButton).click()
}

const rejectNewNetwork = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.NetworkPage.addNetwork.cancelButton).click()
}

const approveSwitchNetwork = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.NetworkPage.switchNetwork.switchNetworkButton).click()
}

const rejectSwitchNetwork = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.NetworkPage.switchNetwork.cancelButton).click()
}

export const network = {
  approveNewNetwork,
  rejectNewNetwork,
  approveSwitchNetwork,
  rejectSwitchNetwork
}
