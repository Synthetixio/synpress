import synpress from '../synpress'

const test = synpress

const { expect } = synpress

test('should reject new network request', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.rejectNewNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')
})
