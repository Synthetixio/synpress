import { testWithSynpress } from 'fixtures'
import { connectToDapp, getExtensionId, unlockForFixture } from '../../src'

import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { describe, expect } = test

describe('connectToDapp', () => {
  test('should connect wallet to dapp', async ({ context, page }) => {
    const extensionId = await getExtensionId(context, 'MetaMask')

    await page.goto('https://metamask.github.io/test-dapp/')

    await page.locator('#connectButton').click()

    await connectToDapp(context, extensionId)

    await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  })
})
