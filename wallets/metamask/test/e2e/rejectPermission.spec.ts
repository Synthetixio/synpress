import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should reject approve request', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.confirmTransaction()

  await page.locator('#approveTokens').click()

  await metamask.rejectTokenPermission()
})
