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
