import { testWithMetaMaskMock } from '../../../../src'

const test = testWithMetaMaskMock

const { expect } = test

test('should be able to access ethereum API', async ({ page }) => {
  const ethereum = await page.evaluate(() => window.ethereum)
  expect(ethereum).toBeTruthy()
})

test('should be connected to metamask', async ({ page }) => {
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
