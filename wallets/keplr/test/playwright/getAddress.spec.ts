import test from '../synpress'
const { expect } = test

test.only('should get address', async ({ page, keplr }) => {
  console.log('page', page, keplr)
  expect(await keplr.getWalletAddress(page)).toBeTruthy()
})