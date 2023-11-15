import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect, describe } = test

describe('when adding a new network', () => {
  test('should switch to the new network', async ({ page, metamask }) => {
    await page.locator('#addEthereumChain').click()

    await metamask.approveNewNetwork()
    await metamask.approveSwitchNetwork()

    await expect(page.locator('#chainId')).toHaveText('0x53a')
  })
})

test('should switch to the requested network', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.rejectSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#switchEthereumChain').click()

  await metamask.approveSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x53a')
})
