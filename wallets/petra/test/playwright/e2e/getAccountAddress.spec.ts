import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should get account address', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  const solanaAccountAddress = await petra.getAccountAddress('aptos')
  expect(solanaAccountAddress).toEqual('oeYf6KAJkLYhBuR8CiGc6L4D4Xtfepr85fuDgA9kq96')
})
