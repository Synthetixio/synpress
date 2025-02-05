import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should approve token with the default limit', async ({ aavePage, phantom }) => {
  test.setTimeout(80_000)

  await aavePage.goto(
    'https://app.aave.com/reserve-overview/?underlyingAsset=0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357&marketName=proto_sepolia_v3'
  )

  await aavePage.getByRole('button', { name: 'Supply' }).click()
  await aavePage.locator('input[aria-label="amount input"]').fill('1')

  const supplyDaiLocator = aavePage.getByRole('button', {
    name: 'Supply DAI'
  })
  await expect(supplyDaiLocator).toBeDisabled()

  await aavePage.locator('button:has-text("Approve DAI to continue")').click()

  await phantom.approveTokenPermission()

  await expect(supplyDaiLocator).toBeEnabled({ timeout: 10_000 })
})
