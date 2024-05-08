import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should open transaction details', async ({ page, metamask, metamaskPage, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendEIP1559Button').click()
  await metamask.confirmTransactionAndWaitForMining()

  await metamask.openTransactionDetails(0)

  await expect(metamaskPage.locator(metamask.homePage.selectors.popover.closeButton)).toBeVisible()
})

test('should throw an error if the passed transaction index is out of bounds', async ({ metamask }) => {
  await expect(metamask.openTransactionDetails(0)).rejects.toThrowError(
    '[OpenTransactionDetails] Transaction with index 0 is not visible. There are only 0 transactions visible.'
  )
})
