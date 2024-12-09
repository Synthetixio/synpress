import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Sign Transaction ', async ({ solanaSandboxPage, phantom }) => {
  await solanaSandboxPage.getByRole('button', { name: 'Sign Transaction' }).click()
  await phantom.confirmTransaction()

  await expect(solanaSandboxPage.getByText('> success')).toBeVisible()
})

test('should Sign All Transactions ', async ({ solanaSandboxPage, phantom }) => {
  await solanaSandboxPage.getByRole('button', { name: 'Sign All Transaction' }).click()
  await phantom.confirmTransaction()

  await expect(solanaSandboxPage.getByText('> success')).toBeVisible()
})

test('should confirm contract deployment with default gas setting', async ({ page, phantom }) => {
  connectPhantomToTestDapp(page, phantom)

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await phantom.confirmTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
})

;(['Slow', 'Fast'] as const).forEach((gasSetting) => {
  test(`should confirm contract deployment with ${gasSetting} gas setting`, async ({ page, phantom }) => {
    connectPhantomToTestDapp(page, phantom)

    await expect(page.locator('#tokenAddresses')).toBeEmpty()
    await page.locator('#createToken').click()

    await phantom.confirmTransaction({ gasSetting })

    await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
  })
})
