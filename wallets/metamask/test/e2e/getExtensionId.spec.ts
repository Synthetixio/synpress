import { testWithSynpress } from 'fixtures'
import { getExtensionId, unlockForFixture } from '../../src'

import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { describe, expect } = test

describe('getExtensionId', () => {
  test('should return the extension id', async ({ context }) => {
    const extensionId = await getExtensionId(context, 'MetaMask')
    expect(extensionId).toMatch(/^[a-z]{32}$/)
  })
})
