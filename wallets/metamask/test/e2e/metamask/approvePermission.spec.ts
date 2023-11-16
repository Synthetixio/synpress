import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask.extend<{ switchChainAndDeployToken: () => Promise<void> }>({
  switchChainAndDeployToken: async ({ page, metamask }, use) => {
    await use(async () => {
      await page.locator('#addEthereumChain').click()

      await metamask.approveNewNetwork()
      await metamask.approveSwitchNetwork()

      await expect(page.locator('#tokenAddresses')).toBeEmpty()
      await page.locator('#createToken').click()

      await metamask.confirmTransaction()
    })
  }
})

const { expect } = test

test('should approve tokens with the default limit', async ({ page, metamask, switchChainAndDeployToken }) => {
  await switchChainAndDeployToken()

  await page.locator('#approveTokens').click()

  await metamask.approvePermission()
})

test('should approve tokens with the custom limit', async ({ page, metamask, switchChainAndDeployToken }) => {
  await switchChainAndDeployToken()

  await page.locator('#approveTokens').click()

  await metamask.approvePermission(420)
})
