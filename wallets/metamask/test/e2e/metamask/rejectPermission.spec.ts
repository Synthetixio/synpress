import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should reject approve request', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.confirmTransaction()

  await page.locator('#approveTokens').click()

  await metamask.rejectPermission()
})
