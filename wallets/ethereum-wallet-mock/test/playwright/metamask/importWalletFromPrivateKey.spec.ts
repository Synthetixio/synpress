import test from '../../../src/playwright/synpress'

const { expect } = test

test('should import account using private key', async ({ page, ethereumWalletMock }) => {
  await ethereumWalletMock.importWalletFromPrivateKey(
    '0xea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'
  )

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xa2ce797cA71d0EaE1be5a7EffD27Fd6C38126801')
})
