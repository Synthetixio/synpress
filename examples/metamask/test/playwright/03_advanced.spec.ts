import { test as advancedFixtures } from './advancedFixtures'

import { testWithSynpress } from '@synthetixio/synpress'

const test = testWithSynpress(advancedFixtures)

const { expect, describe } = test

const tokenLocator = '.multichain-token-list-item'

describe('Token', () => {
  test('should confirm tokens transfer', async ({ page, metamask, connectToAnvil, deployToken }) => {
    // Connect to Anvil network
    await connectToAnvil()
    // Deploy the token contract
    await deployToken()

    // Click the transfer tokens button
    await page.locator('#transferTokens').click()
    // Confirm the transaction in MetaMask
    await metamask.confirmTransaction()
  })

  test('should approve tokens', async ({ page, metamask, connectToAnvil, deployToken }) => {
    // Connect to Anvil network
    await connectToAnvil()
    // Deploy the token contract
    await deployToken()

    // Click the approve tokens button
    await page.locator('#approveTokens').click()
    // Approve the token permission in MetaMask
    await metamask.approveTokenPermission()
  })

  test('should add token to the wallet', async ({ page, metamask, metamaskPage, connectToAnvil, deployToken }) => {
    // Connect to Anvil network
    await connectToAnvil()
    // Deploy the token contract
    await deployToken()

    // Click the watch assets button
    await page.locator('#watchAssets').click()

    // Add the new token to MetaMask
    await metamask.addNewToken()

    // Verify that the token (TST) is added to the wallet
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
    // Connect to Anvil network
    await connectToAnvil()
    // Deploy the Piggy Bank contract
    await deployPiggyBank()

    // Click the deposit button
    await page.locator('#depositButton').click()
    // Confirm the deposit transaction in MetaMask
    await metamask.confirmTransaction()

    // Verify that the deposit was completed
    await expect(page.locator('#contractStatus')).toHaveText('Deposit completed')

    // Click the withdraw button
    await page.locator('#withdrawButton').click()
    // Confirm the withdrawal transaction in MetaMask
    await metamask.confirmTransaction()

    // Verify that the withdrawal was successful
    await expect(page.locator('#contractStatus')).toHaveText('Withdrawn')
  })
})
