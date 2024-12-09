import { connectPhantomToTestDapp } from '../commonSteps/connectPhantomToTestDapp'
import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should Reject Transaction ', async ({ solanaSandboxPage, phantom }) => {
  await solanaSandboxPage.getByRole('button', { name: 'Sign Transaction' }).click()
  await phantom.rejectTransaction()

  await expect(solanaSandboxPage.getByText('User rejected the request.')).toBeVisible()
})

test('should Reject All Transactions ', async ({ solanaSandboxPage, phantom }) => {
  await solanaSandboxPage.getByRole('button', { name: 'Sign All Transaction' }).click()
  await phantom.rejectTransaction()

  await expect(solanaSandboxPage.getByText('User rejected the request.')).toBeVisible()
})

test('should reject contract deployment', async ({ page, phantom }) => {
  connectPhantomToTestDapp(page, phantom)

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await phantom.rejectTransaction()

  await expect(page.locator('#tokenAddresses')).toContainText('Creation Failed')
})
