import { describe, expect, test } from '../advancedFixture'

describe('Token', () => {
  test('should confirm tokens transfer', async ({ page, metamask, connectToAnvil, deployToken }) => {
    await connectToAnvil()
    await deployToken()

    await page.locator('#transferTokens').click()
    await metamask.confirmTransaction()
  })

  test('should approve tokens', async ({ page, metamask, connectToAnvil, deployToken }) => {
    await connectToAnvil()
    await deployToken()

    await page.locator('#approveTokens').click()
    await metamask.approvePermission()
  })
})

describe('Piggy Bank', () => {
  test('should deposit and then withdraw ETH from the contract', async ({
    page,
    metamask,
    connectToAnvil,
    deployPiggyBank
  }) => {
    await connectToAnvil()
    await deployPiggyBank()

    await page.locator('#depositButton').click()
    await metamask.confirmTransaction()

    await expect(page.locator('#contractStatus')).toHaveText('Deposit completed')

    await page.locator('#withdrawButton').click()
    await metamask.confirmTransaction()

    await expect(page.locator('#contractStatus')).toHaveText('Withdrawn')
  })
})
