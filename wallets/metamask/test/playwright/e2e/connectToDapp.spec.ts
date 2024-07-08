import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

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

  await metamask.addNewAccount('Account x2')
  await metamask.addNewAccount('Account x3')

  await page.goto('/')
  await page.locator('#connectButton').click()

  // "accounts" param is order agnostic
  await metamask.connectToDapp(['Account x2', 'Account 1'])

  const accounts = (await page.locator('#accounts').innerText()).split(',').filter((address) => address.includes('0x'))

  // Two accounts connected
  expect(accounts).toHaveLength(2)
})
