import test from '../synpress'
const { expect } = test

test('add account', async ({ page, keplrWallet }) => {
  await page.click('text="Add Account"')
  await page.click('text="Keplr"')
  await page.click('text="Create Account"')
})