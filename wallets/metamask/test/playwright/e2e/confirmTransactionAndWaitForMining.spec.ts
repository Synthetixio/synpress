import synpress from '../synpress'

const test = synpress

const { expect } = test

// ⚠️ Note: These tests are skipped because they are extremely slow.

test.skip('should confirm contract deployment and wait for mining', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.confirmTransactionAndWaitForMining()

  await expect(page.locator('#tokenAddresses')).toContainText(/^0x/)
})

test.skip('should confirm legacy transaction and wait for mining', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendButton').click()

  await metamask.confirmTransactionAndWaitForMining()
})

test.skip('should confirm EIP-1559 transaction and wait for mining', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendEIP1559Button').click()

  await metamask.confirmTransactionAndWaitForMining()
})

test.skip('should work correctly when calling sequentially', async ({ page, metamask, connectToAnvil }) => {
  // This test takes a looooooooong time, so we need to increase the test timeout.
  test.setTimeout(120_000)

  await connectToAnvil()

  await page.locator('#sendEIP1559Button').click()
  await metamask.confirmTransactionAndWaitForMining()

  await page.locator('#sendEIP1559Button').click()
  await metamask.confirmTransactionAndWaitForMining()

  await page.locator('#sendEIP1559Button').click()
  await metamask.confirmTransactionAndWaitForMining()
})
