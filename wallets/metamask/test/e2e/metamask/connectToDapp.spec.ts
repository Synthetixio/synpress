import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { describe, expect } = test

describe('MetaMask.connectToDapp', () => {
  test('should connect wallet to dapp', async ({ context, page, extensionId }) => {
    const metamask = new MetaMask(context, page, basicSetup.walletPassword)

    await page.goto('https://metamask.github.io/test-dapp/')

    await page.locator('#connectButton').click()

    await metamask.connectToDapp(extensionId)

    await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  })
})
