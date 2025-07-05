import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/PromptPage'
import { getPromptPageAndWaitForLoad } from '../../utils/getPromptPageAndWaitForLoad'
import { connectToDapp, signSimpleMessage, transaction } from './actions'

export class PromptPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string, account?: string) {
    const promptPage = await getPromptPageAndWaitForLoad(this.page.context(), extensionId)

    await connectToDapp(promptPage, account)
  }

  // TODO: Revisit this logic in the future to see if we can increase the performance by utilizing `Promise.race`.
  private async beforeMessageSignature(extensionId: string) {
    const promptPage = await getPromptPageAndWaitForLoad(this.page.context(), extensionId)

    return {
      promptPage
    }
  }

  async signMessage(extensionId: string) {
    const { promptPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.sign(promptPage)
  }

  async rejectMessage(extensionId: string) {
    const { promptPage } = await this.beforeMessageSignature(extensionId)

    await signSimpleMessage.reject(promptPage)
  }

  async confirmTransaction(extensionId: string) {
    const promptPage = await getPromptPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.confirm(promptPage)
  }

  async rejectTransaction(extensionId: string) {
    const promptPage = await getPromptPageAndWaitForLoad(this.page.context(), extensionId)

    await transaction.reject(promptPage)
  }

  getPromptPage(extensionId: string): Promise<Page> {
    return getPromptPageAndWaitForLoad(this.page.context(), extensionId)
  }
}
