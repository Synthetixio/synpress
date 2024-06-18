import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../utils/getNotificationPageAndWaitForLoad'
import {
  type GasSetting,
  approvePermission,
  connectToDapp,
  decryptMessage,
  network,
  providePublicEncryptionKey,
  signSimpleMessage,
  signStructuredMessage,
  token,
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

  private async beforeMessageSignature(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)
    const scrollDownButton = notificationPage.locator(Selectors.SignaturePage.structuredMessage.scrollDownButton)

    let isScrollButtonVisible = false

    const scrollButtonPromise = scrollDownButton
      .waitFor({ state: 'visible' })
      .then(async () => {
        isScrollButtonVisible = true
        await scrollDownButton.click()
        return true
      })
      .catch(() => false)

    await Promise.race([notificationPage.waitForLoadState('load').then(() => false), scrollButtonPromise])

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

  async signMessageWithRisk(extensionId: string) {
    const { notificationPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.signWithRisk(notificationPage)
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

  async addNewToken(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await token.addNew(notificationPage)
  }

  async providePublicEncryptionKey(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await providePublicEncryptionKey(notificationPage)
  }

  async decryptMessage(extensionId: string) {
    const notificationPage = await getNotificationPageAndWaitForLoad(this.page.context(), extensionId)

    await decryptMessage(notificationPage)
  }
}
