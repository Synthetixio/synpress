import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should get account address', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  const solanaAccountAddress = await phantom.getAccountAddress('solana')
  expect(solanaAccountAddress).toEqual('oeYf6KAJkLYhBuR8CiGc6L4D4Xtfepr85fuDgA9kq96')
})
