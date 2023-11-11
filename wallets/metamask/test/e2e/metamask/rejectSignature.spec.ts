import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import connectedSetup from '../wallet-setup/connected.setup'

const test = testWithSynpress(connectedSetup, unlockForFixture)

const { expect } = test

test('should reject `personal_sign`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#personalSign').click()

  await metamask.rejectSignature()

  await expect(page.locator('#personalSign')).toHaveText(
    'Error: MetaMask Message Signature: User denied message signature.'
  )
  await expect(page.locator('#personalSignResult')).toHaveText('')
})

test('should reject `eth_signTypedData`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedData').click()

  await metamask.rejectSignature()

  await expect(page.locator('#signTypedDataResult')).toHaveText(
    'Error: MetaMask Message Signature: User denied message signature.'
  )
})

test('should reject `eth_signTypedData_v3`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedDataV3').click()

  await metamask.rejectSignature()

  await expect(page.locator('#signTypedDataV3Result')).toHaveText(
    'Error: MetaMask Message Signature: User denied message signature.'
  )
})

test('should reject `eth_signTypedData_v4`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedDataV4').click()

  await metamask.rejectSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText(
    'Error: MetaMask Message Signature: User denied message signature.'
  )
})
