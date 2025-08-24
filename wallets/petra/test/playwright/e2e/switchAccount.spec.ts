import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'
import { petraPrivateKeyOne, petraPrivateKeyTwo } from '../../constants'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should switch account', async ({ context, petraPage }) => {
  test.setTimeout(90_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword)
  const accountButton = petraPage.locator(petra.homePage.selectors.accountMenu.accountName)

  await petra.importWalletFromPrivateKey(petraPrivateKeyOne)
  await petra.renameAccount('Tobelabs 1')
  await expect(accountButton).toContainText('Tobelabs 1')

  await petra.importWalletFromPrivateKey(petraPrivateKeyTwo)
  await petra.renameAccount('Tobelabs 2')
  await expect(accountButton).toContainText('Tobelabs 2')

  await petra.switchAccount('Tobelabs 1')
  await expect(accountButton).toContainText('Tobelabs 1')

  const accountAddress = await petra.getAccountAddress()
  expect(accountAddress).toEqual('0x4e5fc4bf420c2525f31c89b779fdd792e204362ec77213c46d2ff82ee0b16e87')
})

test('should throw an error if there is no account with target name', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = petra.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
