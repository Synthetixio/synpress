import { testWithSynpress } from '@synthetixio/synpress'
import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/synpress/playwright'

// Set up the test environment with Synpress and Ethereum wallet mock fixtures
const test = testWithSynpress(ethereumWalletMockFixtures)

const { expect } = test

test('should mock MetaMask in the Test Dapp', async ({ page, ethereumWalletMock }) => {
  // Verify that there is only one account in the wallet
  expect(await ethereumWalletMock.getAllAccounts()).toHaveLength(1)

  // Click the connect button
  await page.locator('#connectButton').click()

  // Verify that the correct account address is displayed
  await expect(page.locator('#accounts')).toHaveText('0xd73b04b0e696b0945283defa3eee453814758f1a')
})

test('should add new account using MetaMask mock', async ({ page }) => {
  // Create a new instance of EthereumWalletMock
  const ethereumWalletMock = new EthereumWalletMock(page)

  // Import a wallet using a mnemonic phrase
  await ethereumWalletMock.importWallet('candy maple cake sugar pudding cream honey rich smooth crumble sweet treat')
  // Add a new account to the wallet
  await ethereumWalletMock.addNewAccount()

  // Click the connect button on the page
  await page.locator('#connectButton').click()

  // Verify that both account addresses are displayed correctly
  await expect(page.locator('#accounts')).toHaveText(
    '0x6503D95e3F20389EE9496b277ABfFDb8eCCD2cc5,0xd73b04b0e696b0945283defa3eee453814758f1a'
  )
})
