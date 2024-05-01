import test from "../synpress";

const { expect } = test;

test("should add a new account with specified name", async ({ walletMock }) => {
  // Imported wallet includes 1 account
  expect(await walletMock.getAllAccounts()).toHaveLength(1);

  await walletMock.addNewAccount();

  expect(await walletMock.getAllAccounts()).toHaveLength(2);

  await walletMock.addNewAccount();
  await walletMock.addNewAccount();

  expect(await walletMock.getAllAccounts()).toHaveLength(4);
});
