import { MetaMaskMock, testWithMetaMaskMock } from '@synthetixio/synpress'

const test = testWithMetaMaskMock

const { expect } = test

test('should mock MetaMask in the Test Dapp', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('#accounts')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')
})

test('should add new account using MetaMask mock', async ({ page }) => {
  const metamask = new MetaMaskMock(page)

  metamask.importWallet('candy maple cake sugar pudding cream honey rich smooth crumble sweet treat')
  await metamask.addNewAccount()

  await expect(page.locator('#accounts')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')
})
