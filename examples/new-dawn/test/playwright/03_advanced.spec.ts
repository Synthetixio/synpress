import { test as advancedFixtures } from './advancedFixtures'

import { testWithSynpress } from '@synthetixio/synpress'

const test = testWithSynpress(advancedFixtures)

const { expect, describe } = test

const tokenLocator = '.multichain-token-list-item'

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
    await metamask.approveTokenPermission()
  })

  test('should add token to the wallet', async ({ page, metamask, metamaskPage, connectToAnvil, deployToken }) => {
    await connectToAnvil()
    await deployToken()

    await page.locator('#watchAssets').click()

    await metamask.addNewToken()

    await expect(metamaskPage.locator(tokenLocator).nth(1)).toContainText('TST')
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
