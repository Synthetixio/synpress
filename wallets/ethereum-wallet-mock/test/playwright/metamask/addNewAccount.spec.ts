import test from '../../../src/playwright/synpress'

const { expect } = test

test('should add a new account with specified name', async ({ ethereumWalletMock }) => {
  // Imported wallet includes 1 account
  expect(await ethereumWalletMock.getAllAccounts()).toHaveLength(1)

  await ethereumWalletMock.addNewAccount()

  expect(await ethereumWalletMock.getAllAccounts()).toHaveLength(2)

  await ethereumWalletMock.addNewAccount()
  await ethereumWalletMock.addNewAccount()

  expect(await ethereumWalletMock.getAllAccounts()).toHaveLength(4)
})
