import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { expect, describe } = test

describe('when adding a new network', () => {
  test('should reject switch network request', async ({ page, metamask }) => {
    await page.locator('#addEthereumChain').click()

    await metamask.approveNewNetwork()
    await metamask.rejectSwitchNetwork()

    await expect(page.locator('#chainId')).toHaveText('0x1')
  })
})

test('should reject switch network request', async ({ page, metamask }) => {
  await page.locator('#addEthereumChain').click()

  await metamask.approveNewNetwork()
  await metamask.rejectSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')

  await page.locator('#switchEthereumChain').click()

  await metamask.rejectSwitchNetwork()

  await expect(page.locator('#chainId')).toHaveText('0x1')
})
