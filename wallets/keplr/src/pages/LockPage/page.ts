import type { Page } from '@playwright/test'
import { onboardingElements } from './selectors'

export class LockPage {
  static readonly selectors = onboardingElements
  readonly selectors = onboardingElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // async unlock(password: string) {
  //   await unlock(this.page, password)
  // }
}
