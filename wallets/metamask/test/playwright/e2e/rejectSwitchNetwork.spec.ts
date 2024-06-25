import synpress from '../synpress'

const test = synpress

const { expect } = test

/// TODO: It's impossible to enable this test and run it in parallel with other tests using MetaMask Test Dapp due to port conflict.
// describe('when adding a new network', () => {
//   test('should reject switch network request', async ({ page, metamask }) => {
//     await page.locator('#addEthereumChain').click()
//
//     await metamask.approveNewNetwork()
//     await metamask.rejectSwitchNetwork()
//
//     await expect(page.locator('#chainId')).toHaveText('0x1')
//   })
// })

test('should reject switch network request', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await metamask.switchNetwork('Ethereum Mainnet')

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#switchEthereumChain').click()

  await metamask.rejectSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')
})
