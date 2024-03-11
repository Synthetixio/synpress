import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should close transaction details', async ({ page, metamask, metamaskPage, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendEIP1559Button').click()
  await metamask.confirmTransactionAndWaitForMining()

  await metamask.openTransactionDetails(0)

  await metamask.closeTransactionDetails()

  await expect(metamaskPage.locator(metamask.homePage.selectors.popover.closeButton)).toBeHidden()
})
