import type { Page } from '@playwright/test';
import { LockPage } from '../pages/LockPage/page'

export default async function unlockForFixtures(page: Page, password: string) {
  const lockpage = new LockPage(page)
  const wallet = await lockpage.unlock(password)
  return wallet;
}