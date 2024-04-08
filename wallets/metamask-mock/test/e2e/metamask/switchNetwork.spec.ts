import { testWithMetaMaskMock } from "../../../src";

const test = testWithMetaMaskMock;

const { expect } = test;

test("should switch network", async ({
  createAnvilNetwork,
  metamask,
  page,
}) => {
  const network = createAnvilNetwork();

  await metamask.addNetwork(network);

  await metamask.switchNetwork(network.name);

  const chainId = await page.evaluate(async () => {
    return await window.ethereum.request({ method: "eth_chainId" });
  });

  expect(chainId).toBe("0x38");
});
