import Selectors from '../../../src/pages/HomePage/selectors'
import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should add new token to MetaMask', async ({ page, metamask, metamaskPage, deployToken }) => {
  await deployToken()

  await page.locator('#watchAssets').click()

  await metamask.addNewToken()

  await expect(metamaskPage.locator(Selectors.portfolio.singleToken).nth(1)).toContainText('TST')
})
