import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../utils/getNotificationPageAndWaitForLoad'
import { waitFor } from '../../utils/waitFor'
import {
  type GasSetting,
  approvePermission,
  connectToDapp,
  network,
  signSimpleMessage,
  signStructuredMessage,
  transaction
} from './actions'
import Selectors from './selectors'

export class NotificationPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string, accounts?: string[]) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await connectToDapp(notificationPage, accounts)
  }

  // TODO: Revisit this logic in the future to see if we can increase the performance by utilizing `Promise.race`.
  private async beforeMessageSignature(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    // TODO: Make this configurable.
    // Most of the time, this function will be used to sign structured messages, so we check for the scroll button first.
    const isScrollButtonVisible = await waitFor(
      () => notificationPage.locator(Selectors.SignaturePage.structuredMessage.scrollDownButton).isVisible(),
      1_500,
      false
    )

    return {
      notificationPage,
      isScrollButtonVisible
    }
  }

  async signMessage(extensionId: string) {
    const { notificationPage, isScrollButtonVisible } = await this.beforeMessageSignature(extensionId)

    if (isScrollButtonVisible) {
      await signStructuredMessage.sign(notificationPage)
    } else {
      await signSimpleMessage.sign(notificationPage)
    }
  }

  async rejectMessage(extensionId: string) {
    const { notificationPage, isScrollButtonVisible } = await this.beforeMessageSignature(extensionId)

    if (isScrollButtonVisible) {
      await signStructuredMessage.reject(notificationPage)
    } else {
      await signSimpleMessage.reject(notificationPage)
    }
  }

  async approveNewNetwork(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await network.approveNewNetwork(notificationPage)
  }

  async rejectNewNetwork(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await network.rejectNewNetwork(notificationPage)
  }

  async approveSwitchNetwork(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await network.approveSwitchNetwork(notificationPage)
  }

  async rejectSwitchNetwork(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await network.rejectSwitchNetwork(notificationPage)
  }

  async confirmTransaction(extensionId: string, options?: { gasSetting?: GasSetting }) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.confirm(notificationPage, options?.gasSetting ?? 'site')
  }

  async rejectTransaction(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.reject(notificationPage)
  }

  async confirmTransactionAndWaitForMining(extensionId: string, options?: { gasSetting?: GasSetting }) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.confirmAndWaitForMining(this.page, notificationPage, options?.gasSetting ?? 'site')
  }

  async approveTokenPermission(
    extensionId: string,
    options?: { spendLimit?: 'max' | number; gasSetting?: GasSetting }
  ) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    if (options?.spendLimit !== undefined) {
      await approvePermission.editTokenPermission(notificationPage, options.spendLimit)
    }

    await approvePermission.approve(notificationPage, options?.gasSetting ?? 'site')
  }

  async rejectTokenPermission(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await approvePermission.reject(notificationPage)
  }
}
