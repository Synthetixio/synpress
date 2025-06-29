import { connectPetraToTestDapp } from '../commonSteps/connectPetraToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should reject `personal_sign`', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)

  await page.locator('#personalSign').click()

  await petra.rejectSignature()

  await expect(page.locator('#personalSign')).toHaveText('Error: User rejected the request.')
  await expect(page.locator('#personalSignResult')).toHaveText('')
})

test('should reject `eth_signTypedData`', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)

  await page.locator('#signTypedData').click()

  await petra.rejectSignature()

  await expect(page.locator('#signTypedDataResult')).toHaveText('Error: User rejected the request.')
})

test('should reject `eth_signTypedData_v3`', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)

  await page.locator('#signTypedDataV3').click()

  await petra.rejectSignature()

  await expect(page.locator('#signTypedDataV3Result')).toHaveText('Error: User rejected the request.')
})

test('should reject `eth_signTypedData_v4`', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)

  await page.locator('#signTypedDataV4').click()

  await petra.rejectSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText('Error: User rejected the request.')
})
