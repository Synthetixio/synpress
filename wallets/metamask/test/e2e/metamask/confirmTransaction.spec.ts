import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect } = test

test('should confirm contract deployment', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.confirmTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText(/^0x/)
})

test('should confirm legacy transaction', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await page.locator('#sendButton').click()

  await metamask.confirmTransaction()
})

test('should confirm EIP 1559 transaction', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await page.locator('#sendEIP1559Button').click()

  await metamask.confirmTransaction()
})
