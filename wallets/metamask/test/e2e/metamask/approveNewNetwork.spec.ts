import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should add a new network', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x53a')
})
