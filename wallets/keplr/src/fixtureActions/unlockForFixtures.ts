import type { Page } from '@playwright/test';
import { LockPage } from '../pages/LockPage/page'

export default async function unlockForFixtures(page: Page, seedPhrase: string, password: string) {
  const lockpage = new LockPage(page)
  const wallet = await lockpage.unlock(seedPhrase, password)
  return wallet;
}