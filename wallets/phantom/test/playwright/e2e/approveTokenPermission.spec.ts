import { aaveSetup } from '../commonSteps/aaveSetup'
import synpress from '../synpress'

const test = synpress

const { expect } = test

// TODO - Either add funds with https://app.aave.com/faucet/ or find another app for the test
test.skip('should approve token with the default limit', async ({ page, phantom }) => {
  test.setTimeout(80_000)

  await aaveSetup(page, phantom)

  await phantom.approveTokenPermission()

  await expect(
    page.getByRole('button', {
      name: 'Supply DAI'
    })
  ).toBeEnabled({ timeout: 10_000 })
})
