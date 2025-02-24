import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/NotificationPage'
import type { GasSettings } from '../../../type/GasSettings'
import { getNotificationPageAndWaitForLoad } from '../../utils/getNotificationPageAndWaitForLoad'
import {
  approvePermission,
  closeUnsupportedNetworkWarning,
  connectToDapp,
  signSimpleMessage,
  transaction
} from './actions'

export class NotificationPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string, account?: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await connectToDapp(notificationPage, account)
  }

  // TODO: Revisit this logic in the future to see if we can increase the performance by utilizing `Promise.race`.
  private async beforeMessageSignature(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    return {
      notificationPage
    }
  }

  async signMessage(extensionId: string) {
    const { notificationPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.sign(notificationPage)
  }

  async signMessageWithRisk(extensionId: string) {
    const { notificationPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.signWithRisk(notificationPage)
  }

  async rejectMessage(extensionId: string) {
    const { notificationPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.reject(notificationPage)
  }

  async confirmTransaction(extensionId: string, options?: { gasSetting?: GasSettings }) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.confirm(notificationPage, options?.gasSetting ?? 'Average')
  }

  async rejectTransaction(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.reject(notificationPage)
  }

  async approveTokenPermission(extensionId: string, options?: { gasSetting?: GasSettings }) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await approvePermission.approve(notificationPage, options?.gasSetting ?? 'Average')
  }

  async rejectTokenPermission(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await approvePermission.reject(notificationPage)
  }

  async closeUnsupportedNetworkWarning(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await closeUnsupportedNetworkWarning(notificationPage)
  }
}
