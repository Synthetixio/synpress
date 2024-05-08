import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should reject contract deployment', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.rejectTransaction()

  await expect(page.locator('#tokenAddresses')).toHaveText('Creation Failed')
})
