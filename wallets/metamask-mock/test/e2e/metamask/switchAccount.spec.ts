import { testWithMetaMaskMock } from '../../../src'

const test = testWithMetaMaskMock

const { expect } = test

test('should switch account', async ({ page, metamask }) => {
  await metamask.switchAccount('0x4444797cA71d0EaE1be5a7EffD27Fd6C38126801')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0x4444797cA71d0EaE1be5a7EffD27Fd6C38126801')
})
