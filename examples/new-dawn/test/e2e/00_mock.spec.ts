import { EthereumWalletMock, ethereumWalletMockFixtures, testWithSynpress } from '@synthetixio/synpress'

const test = testWithSynpress(ethereumWalletMockFixtures)

const { expect } = test

test('should mock MetaMask in the Test Dapp', async ({ page, ethereumWalletMock }) => {
  expect(await ethereumWalletMock.getAllAccounts()).toHaveLength(1)

  await page.locator('#connectButton').click()

  await expect(page.locator('#accounts')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')
})

test('should add new account using MetaMask mock', async ({ page }) => {
  const ethereumWalletMock = new EthereumWalletMock(page)

  await ethereumWalletMock.importWallet('candy maple cake sugar pudding cream honey rich smooth crumble sweet treat')
  await ethereumWalletMock.addNewAccount()

  await page.locator('#connectButton').click()

  await expect(page.locator('#accounts')).toHaveText(
    '0x6503D95e3F20389EE9496b277ABfFDb8eCCD2cc5,0xd73b04b0e696b0945283defa3eee453814758f1a'
  )
})
