import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

const approveNewEthereumRPC = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.EthereumRpcPage.approveNewRpc).click()
}

const rejectNewEthereumRPC = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.EthereumRpcPage.rejectNewRpc).click()
}

export const ethereumRpc = {
  approveNewEthereumRPC,
  rejectNewEthereumRPC
}
