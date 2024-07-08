import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should switch account', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.importWalletFromPrivateKey('ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a')
  await metamask.importWalletFromPrivateKey('7dd4aab86170c0edbdcf97600eff0ae319fdc94149c5e8c33d5439f8417a40bf')

  await metamask.switchAccount('Account 1')

  await expect(metamaskPage.getByText('Account 1')).toBeVisible()
  await expect(metamaskPage.getByText('0xf39Fd...92266')).toBeVisible()
})

test('should throw an error if there is no account with target name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = metamask.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
