import { testWithSynpress } from 'fixtures'
import { UnlockPageSelectors, lock, unlockForFixture } from '../../src'

import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { describe, expect } = test

describe('lock', () => {
  test('should lock the wallet', async ({ metamaskPage }) => {
    await lock(metamaskPage)

    await expect(metamaskPage.locator(UnlockPageSelectors.submitButton)).toBeVisible()
  })
})
