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

test('should confirm `eth_signTypedData`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedData').click()

  await metamask.confirmSignature()

  await expect(page.locator('#signTypedDataResult')).toHaveText(
    '0xd75eece0d337f4e425f87bd112c849561956afe4f154cdd07d1d4cba7a979b481ba6ceede5c0eb9daa66bec4eea6e7ecfee5496274ef2a93b69abd97531519b21c'
  )

  await page.locator('#signTypedDataVerify').click()

  await expect(page.locator('#signTypedDataVerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should confirm `eth_signTypedData_v3`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedDataV3').click()

  await metamask.confirmSignature()

  await expect(page.locator('#signTypedDataV3Result')).toHaveText(
    '0x6ea8bb309a3401225701f3565e32519f94a0ea91a5910ce9229fe488e773584c0390416a2190d9560219dab757ecca2029e63fa9d1c2aebf676cc25b9f03126a1b'
  )

  await page.locator('#signTypedDataV3Verify').click()

  await expect(page.locator('#signTypedDataV3VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should confirm `eth_signTypedData_v4`', async ({ context, metamaskPage, page, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

  await page.goto('https://metamask.github.io/test-dapp/')

  await page.locator('#signTypedDataV4').click()

  await metamask.confirmSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText(
    '0x789d9365fe0fbf1485b8069cbb000b78abd56b92608f9bc11a0d78e8810cd0434a60e93790c52348e5ac8770a8c5b0bb89411c2fbc61cbb4f56d67d60a3374961c'
  )

  await page.locator('#signTypedDataV4Verify').click()

  await expect(page.locator('#signTypedDataV4VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
