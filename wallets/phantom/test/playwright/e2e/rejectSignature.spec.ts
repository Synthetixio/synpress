import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should reject `personal_sign`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#personalSign').click()

  await phantom.rejectSignature()

  await expect(page.locator('#personalSign')).toHaveText('Error: User rejected the request.')
  await expect(page.locator('#personalSignResult')).toHaveText('')
})

test('should reject `eth_signTypedData`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedData').click()

  await phantom.rejectSignature()

  await expect(page.locator('#signTypedDataResult')).toHaveText('Error: User rejected the request.')
})

test('should reject `eth_signTypedData_v3`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedDataV3').click()

  await phantom.rejectSignature()

  await expect(page.locator('#signTypedDataV3Result')).toHaveText('Error: User rejected the request.')
})

test('should reject `eth_signTypedData_v4`', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await page.locator('#signTypedDataV4').click()

  await phantom.rejectSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText('Error: User rejected the request.')
})
