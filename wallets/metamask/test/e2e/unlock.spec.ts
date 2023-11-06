import { testWithSynpress } from 'fixtures'
import { HomePageSelectors, lock, unlock, unlockForFixture } from '../../src'

import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { describe, expect } = test

describe('unlock', () => {
  test('should unlock the wallet', async ({ metamaskPage }) => {
    await lock(metamaskPage)

    await unlock(metamaskPage, basicSetup.walletPassword)

    await expect(metamaskPage.locator(HomePageSelectors.logo)).toBeVisible()
  })
})
