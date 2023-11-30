import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask.extend<{
  deployToken: () => Promise<void>
}>({
  deployToken: async ({ page, metamask, connectToAnvil }, use) => {
    await use(async () => {
      await connectToAnvil()

      await expect(page.locator('#tokenAddresses')).toBeEmpty()
      await page.locator('#createToken').click()

      await metamask.confirmTransaction()
    })
  }
})

const { expect } = test

test('should approve tokens with the default limit by default', async ({ page, metamask, deployToken }) => {
  await deployToken()

  await page.locator('#approveTokens').click()

  await metamask.approvePermission()
})

test('should approve tokens with the max limit', async ({ page, metamask, deployToken }) => {
  await deployToken()

  await page.locator('#approveTokens').click()

  await metamask.approvePermission('max')
})

test('should approve tokens with the custom limit', async ({ page, metamask, deployToken }) => {
  await deployToken()

  await page.locator('#approveTokens').click()

  await metamask.approvePermission(420)
})
