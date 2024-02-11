import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should connect wallet to dapp', async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, basicSetup.walletPassword, extensionId)

  await page.goto('/')

  await page.locator('#connectButton').click()

  await metamask.connectToDapp()

  await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

test('should connect multiple wallets to dapp', async ({ context, page, metamaskPage, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  await metamask.addNewAccount('Account 2')
  await metamask.addNewAccount('Account 3')

  await page.goto('/')
  await page.locator('#connectButton').click()

  // "accounts" param is order agnostic
  await metamask.connectToDapp(['Account 2', 'Account 1'])

  await expect(page.locator('#accounts')).toHaveText(
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8,0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
  )
})
