import Selectors from '../../../src/selectors/pages/HomePage'

import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should add new token to MetaMask', async ({ page, metamask, metamaskPage, deployToken }) => {
  await deployToken()

  await page.locator('#watchAssets').click()

  await metamask.addNewToken()

  await expect(metamaskPage.locator(Selectors.portfolio.singleToken).nth(1)).toContainText('TST')
})

test('should add new token using EIP747', async ({ page, metamask, deployToken }) => {
  await deployToken()

  await page.locator('#eip747ContractAddress').fill('0x5FbDB2315678afecb367f032d93F642f64180aa3')
  await page.locator('#eip747Symbol').fill('TST')
  await page.locator('#eip747Decimals').fill('4')

  await page.locator('#eip747WatchButton').click()
  await metamask.addNewToken()

  await expect(page.locator('#eip747Status')).toHaveText('NFT added successfully')
})
