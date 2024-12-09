import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/LockPage'
import { unlock } from './actions'

export class LockPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async unlock(password: string) {
    await unlock(this.page, password)
  }
}
