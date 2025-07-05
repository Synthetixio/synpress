import type { Page } from '@playwright/test'

export default async function getAccountAddress(page: Page): Promise<string> {
  await page.getByRole('button', { name: /copy address/i }).click()

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText())

  const accountAddress = await handle.jsonValue()

  return accountAddress
}
