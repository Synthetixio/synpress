import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import { solanaSandboxSetup } from '../commonSteps/solanaSandboxSetup'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Sign Transaction', async ({ page, phantom }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, phantom)

  await page.getByRole('button', { name: 'Sign Transaction' }).click()
  await phantom.confirmTransaction()

  await expect(page.getByText('> success')).toBeVisible()
})

test('should Sign All Transactions', async ({ page, phantom }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, phantom)

  await page.getByRole('button', { name: 'Sign All Transaction' }).click()
  await phantom.confirmTransaction()

  await expect(page.getByText('> success')).toBeVisible()
})

test('should confirm contract deployment with default gas setting', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await phantom.confirmTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
})
;(['Slow', 'Fast'] as const).forEach((gasSetting) => {
  test(`should confirm contract deployment with ${gasSetting} gas setting`, async ({ page, phantom }) => {
    await connectPhantomToTestDapp(page, phantom)

    await expect(page.locator('#tokenAddresses')).toBeEmpty()
    await page.locator('#createToken').click()

    await phantom.confirmTransaction({ gasSetting })

    await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
  })
})
