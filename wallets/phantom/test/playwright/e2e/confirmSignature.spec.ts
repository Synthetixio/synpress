import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should confirm `personal_sign`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#personalSign').click()

  await phantom.confirmSignature()

  await expect(page.locator('#personalSignResult')).toHaveText(
    '0xf95b3efc808585303e20573e960993cde30c7f5a0f1c25cfab0379d5a14311d17898199814c8ebe66ec80b2b11690f840bde539f862ff4f04468d2a40f15178a1b'
  )
})

test('should confirm `eth_signTypedData`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedData').click()

  await phantom.confirmSignature()

  await expect(page.locator('#signTypedDataResult')).toHaveText(
    '0xd75eece0d337f4e425f87bd112c849561956afe4f154cdd07d1d4cba7a979b481ba6ceede5c0eb9daa66bec4eea6e7ecfee5496274ef2a93b69abd97531519b21c'
  )

  await page.locator('#signTypedDataVerify').click()

  await expect(page.locator('#signTypedDataVerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should confirm `eth_signTypedData_v3`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedDataV3').click()

  await phantom.confirmSignature()

  await expect(page.locator('#signTypedDataV3Result')).toHaveText(
    '0x6ea8bb309a3401225701f3565e32519f94a0ea91a5910ce9229fe488e773584c0390416a2190d9560219dab757ecca2029e63fa9d1c2aebf676cc25b9f03126a1b'
  )

  await page.locator('#signTypedDataV3Verify').click()

  await expect(page.locator('#signTypedDataV3VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should confirm `eth_signTypedData_v4`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedDataV4').click()

  await phantom.confirmSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText(
    '0x1cf422c4a319c19ecb89c960e7c296810278fa2bef256c7e9419b285c8216c547b3371fa1ec3987ce08561d3ed779845393d8d3e4311376d0bc0846f37d1b2821c'
  )

  await page.locator('#signTypedDataV4Verify').click()

  await expect(page.locator('#signTypedDataV4VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should confirm `eth_sign`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#ethSign').click()

  await phantom.confirmSignatureWithRisk()

  await expect(page.locator('#ethSignResult')).toContainText(
    '0x369af83ed2fcee757c12d59d921289722d7c6bc11f484f667f2ef8b74b068a0e281ffff7099fc5a4af534f5dbaaab92238b715dd887e3a9f8e2298dc99f554e81b'
  )
})
