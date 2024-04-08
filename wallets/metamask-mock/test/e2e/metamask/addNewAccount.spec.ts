import { testWithMetaMaskMock } from "../../../src";

const test = testWithMetaMaskMock;

const { expect } = test;

test("should add a new account with specified name", async ({ metamask }) => {
  expect(await metamask.getAllAccounts()).toHaveLength(1);

  await metamask.addNewAccount();

  expect(await metamask.getAllAccounts()).toHaveLength(2);

  await metamask.addNewAccount();
  await metamask.addNewAccount();

  expect(await metamask.getAllAccounts()).toHaveLength(4);
});
