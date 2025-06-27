import { aaveSetup } from '../commonSteps/aaveSetup'
import synpress from '../synpress'

const test = synpress

const { expect } = test

// TODO - Either add funds with https://app.aave.com/faucet/ or find another app for the test
test.skip('should reject approve token request', async ({ page, phantom }) => {
  test.setTimeout(80_000)

  await aaveSetup(page, phantom)

  await expect(page.locator('button:has-text("Approve DAI to continue")')).not.toBeVisible()
  await expect(page.locator('button:has-text("Approving DAI...")')).toBeVisible()

  await phantom.rejectTokenPermission()

  await expect(page.locator('button:has-text("Approving DAI...")')).not.toBeVisible({ timeout: 10_000 })
  await expect(page.locator('button:has-text("Approve DAI to continue")')).toBeVisible()
  await expect(page.getByText('There was some error. Please try changing the parameters or')).toBeVisible()
})
