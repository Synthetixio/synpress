import { connectPetraToTestDapp } from '../commonSteps/connectPetraToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Sign Message', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)

  await page.getByRole('button', { name: /^sign message$/i }).click()

  await petra.confirmSignature()

  await expect(page.locator('p[aria-label="Signed result"]')).toContainText(
    'Hello world from synpress. This is for test only.'
  )
})

test('should Sign and verify message', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)
  await page.getByRole('button', { name: /^sign message and verify$/i }).click()
  await petra.confirmSignature()

  await expect(page.locator('p[aria-label="Verification result"]')).toContainText('Message is verified')
})

test('should Sign and submit transaction', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await connectPetraToTestDapp(page, petra)
  await petra.toggleNetworkMode('testnet')

  await page.getByRole('button', { name: /^sign transaction$/i }).click()
  await petra.confirmTransaction()

  await expect(page.locator('p[aria-label="Transaction successful"]')).toContainText('Transaction successful')
})
