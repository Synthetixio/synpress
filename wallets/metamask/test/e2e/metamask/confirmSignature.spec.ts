import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import connectedSetup from '../wallet-setup/connected.setup'

const test = testWithSynpress(connectedSetup, unlockForFixture)

const { expect } = test

test('should confirm `personal_sign`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#personalSign').click()

  await metamask.confirmSignature()

  await expect(page.locator('#personalSignResult')).toHaveText(
    '0xf95b3efc808585303e20573e960993cde30c7f5a0f1c25cfab0379d5a14311d17898199814c8ebe66ec80b2b11690f840bde539f862ff4f04468d2a40f15178a1b'
  )

  await page.locator('#personalSignVerify').click()

  await expect(page.locator('#personalSignVerifySigUtilResult')).toHaveText(
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
  )
  await expect(page.locator('#personalSignVerifyECRecoverResult')).toHaveText(
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
  )
})
