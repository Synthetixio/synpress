import { connectPetraToTestDapp } from '../commonSteps/connectPetraToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Reject signing message Transaction', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)
  await page.getByRole('button', { name: /^sign message$/i }).click()

  await Promise.all([
    expect(page.getByRole('alert').locator('> section')).toContainText('User has rejected the request'),
    petra.rejectSignature()
  ])
})

test('should Reject All Transactions', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)
  await page.getByRole('button', { name: /^sign message and verify$/i }).click()

  await Promise.all([
    expect(page.getByRole('alert').locator('> section')).toContainText('Failed to sign a message'),
    petra.rejectSignature()
  ])
})

test('should reject sign transaction', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)
  await petra.toggleNetworkMode('testnet')

  await page.getByRole('button', { name: /^sign transaction$/i }).click()

  await Promise.all([
    expect(page.getByRole('alert').locator('> section')).toContainText('User has rejected the request'),
    petra.rejectSignature()
  ])
})
