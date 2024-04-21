import { EthereumWalletMock, testWithEthereumWalletMock } from '@synthetixio/synpress'

const test = testWithEthereumWalletMock

const { expect } = test

test('should mock MetaMask in the Test Dapp', async ({ page, walletMock }) => {
  expect(await walletMock.getAllAccounts()).toHaveLength(1)

  await page.locator('#connectButton').click()

  await expect(page.locator('#accounts')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')
})

test('should add new account using MetaMask mock', async ({ page }) => {
  const walletMock = new EthereumWalletMock(page)

  await walletMock.importWallet('candy maple cake sugar pudding cream honey rich smooth crumble sweet treat')
  await walletMock.addNewAccount()

  await page.locator('#connectButton').click()

  await expect(page.locator('#accounts')).toHaveText(
    '0x6503D95e3F20389EE9496b277ABfFDb8eCCD2cc5,0xd73b04b0e696b0945283defa3eee453814758f1a'
  )
})
