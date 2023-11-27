import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should switch network', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.toggleShowTestNetworks()

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.closeDropdownButton).click()

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText('Ethereum Mainnet')

  const targetNetwork = 'Sepolia'
  await metamask.switchNetwork(targetNetwork)

  await expect(metamaskPage.locator(metamask.homePage.selectors.currentNetwork)).toHaveText(targetNetwork)
})

test('should throw an error if there is no account with target name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = metamask.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
