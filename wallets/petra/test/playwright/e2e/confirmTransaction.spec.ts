import { connectPetraToTestDapp } from '../commonSteps/connectPetraToTestDapp'
import { solanaSandboxSetup } from '../commonSteps/solanaSandboxSetup'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Sign Transaction', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, petra)

  await page.getByRole('button', { name: 'Sign Transaction' }).click()
  await petra.confirmTransaction()

  await expect(page.getByText('> success')).toBeVisible()
})

test('should Sign All Transactions', async ({ page, petra }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, petra)

  await page.getByRole('button', { name: 'Sign All Transaction' }).click()
  await petra.confirmTransaction()

  await expect(page.getByText('> success')).toBeVisible()
})

test('should confirm contract deployment with default gas setting', async ({ page, petra }) => {
  await connectPetraToTestDapp(page, petra)

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await petra.confirmTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
})
;(['Slow', 'Fast'] as const).forEach((gasSetting) => {
  test(`should confirm contract deployment with ${gasSetting} gas setting`, async ({ page, petra }) => {
    await connectPetraToTestDapp(page, petra)

    await expect(page.locator('#tokenAddresses')).toBeEmpty()
    await page.locator('#createToken').click()

    await petra.confirmTransaction({ gasSetting })

    await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
  })
})
