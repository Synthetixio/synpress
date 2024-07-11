import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should add a new network', async ({ page, metamask, createAnvilNode }) => {
  await createAnvilNode({
    chainId: 1338,
    port: 8546
  })

  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.approveSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x53a')
})
