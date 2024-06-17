import test from '../../../src/playwright/synpress'

const { expect } = test

test('should be able to access ethereum API', async ({ page }) => {
  const ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum).toBeTruthy()
})

test('should be connected to metamask by default', async ({ page }) => {
  const ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum.isMetaMask).toBe(true)
})

test('should connect to ethereum', async ({ page }) => {
  const currentChainId = await page.evaluate(() =>
    window.ethereum.request({
      method: 'eth_chainId'
    })
  )

  expect(currentChainId).toEqual('0x1')
})

test('should be able to connect to every supported ethereum wallet', async ({ page, ethereumWalletMock }) => {
  // Metamask
  let ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum.isMetaMask).toBe(true)
  expect(ethereum.isCoinbaseWallet).toBe(undefined)

  // Coinbase wallet
  await ethereumWalletMock.connectToDapp('coinbase')
  ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum.isCoinbaseWallet).toBe(true)

  // Walletconnect
  await ethereumWalletMock.connectToDapp('walletconnect')
  ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum.isWalletLink).toBe(true)
})
