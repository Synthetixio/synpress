import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

// These tests rely on the same account, which means they must be run in serial.
test.describe.configure({ mode: 'serial' })

// ⚠️ Note: These tests are skipped because they are all extremely slow and flaky.

test.skip('should confirm contract deployment and wait for mining', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.experimental.confirmTransactionAndWaitForMining()

  await expect(page.locator('#tokenAddresses')).toContainText(/^0x/)
})

test.skip('should confirm legacy transaction and wait for mining', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await page.locator('#sendButton').click()

  await metamask.experimental.confirmTransactionAndWaitForMining()
})

test.skip('should confirm EIP 1559 transaction and wait for mining', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await page.locator('#sendEIP1559Button').click()

  await metamask.experimental.confirmTransactionAndWaitForMining()
})

test.skip('should work correctly when calling sequentially', async ({ page, metamask }) => {
  test.setTimeout(120_000)

  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await page.locator('#sendEIP1559Button').click()
  await metamask.experimental.confirmTransactionAndWaitForMining()

  await page.locator('#sendEIP1559Button').click()
  await metamask.experimental.confirmTransactionAndWaitForMining()

  await page.locator('#sendEIP1559Button').click()
  await metamask.experimental.confirmTransactionAndWaitForMining()
})
