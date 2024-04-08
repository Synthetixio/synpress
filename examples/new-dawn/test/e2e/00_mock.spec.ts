import { testWithMetaMaskMock, MetaMaskMock } from "@synthetixio/synpress";

const test = testWithMetaMaskMock;

const { expect } = test;

test("should work to the MetaMask Test Dapp", async ({ page }) => {
  const metamask = new MetaMaskMock(page);

  await page.goto("/");

  await expect(page.locator("#accounts")).toHaveText(
    "0xd73b04b0e696b0945283defa3eee453814758f1a"
  );

  await page.locator("#getAccounts").click();
  await expect(page.locator("#getAccountsResult")).toHaveText(
    "0xd73b04b0e696b0945283defa3eee453814758f1a"
  );
});
