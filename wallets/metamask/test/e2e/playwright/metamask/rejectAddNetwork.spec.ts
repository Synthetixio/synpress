import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should reject new network request', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.rejectNewNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')
})
