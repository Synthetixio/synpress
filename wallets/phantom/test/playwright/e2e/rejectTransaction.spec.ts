import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import { solanaSandboxSetup } from '../commonSteps/solanaSandboxSetup'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Reject Transaction ', async ({ page, phantom }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, phantom)

  await page.getByRole('button', { name: 'Sign Transaction' }).click()
  await phantom.rejectTransaction()

  await expect(page.getByText('User rejected the request.')).toBeVisible()
})

test('should Reject All Transactions ', async ({ page, phantom }) => {
  test.setTimeout(90_000)

  await solanaSandboxSetup(page, phantom)

  await page.getByRole('button', { name: 'Sign All Transaction' }).click()
  await phantom.rejectTransaction()

  await expect(page.getByText('User rejected the request.')).toBeVisible()
})

test('should reject contract deployment', async ({ page, phantom }) => {
  await connectPhantomToTestDapp(page, phantom)

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await phantom.rejectTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
})
