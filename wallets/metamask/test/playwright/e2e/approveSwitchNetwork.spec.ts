import synpress from '../synpress'

const test = synpress

const { expect } = test

/// TODO: It's impossible to enable this test and run it in parallel with other tests using MetaMask Test Dapp due to port conflict.
// describe('when adding a new network', () => {
//   test('should switch to the new network', async ({ page, metamask }) => {
//     await page.locator('#addEthereumChain').click()
//
//     await metamask.approveNewNetwork()
//     await metamask.approveSwitchNetwork()
//
//     await expect(page.locator('#chainId')).toHaveText('0x53a')
//   })
// })

test('should switch to the requested network', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await metamask.switchNetwork('Ethereum Mainnet')

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#switchEthereumChain').click()

  await metamask.approveSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x53a')
})
