import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should get account address for all available networks', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  const solanaAccountAddress = await phantom.getAccountAddress('solana')
  expect(solanaAccountAddress).toEqual('oeYf6KAJkLYhBuR8CiGc6L4D4Xtfepr85fuDgA9kq96')

  const ethereumAccountAddress = await phantom.getAccountAddress('ethereum')
  expect(ethereumAccountAddress).toEqual('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

  const baseAccountAddress = await phantom.getAccountAddress('base')
  expect(baseAccountAddress).toEqual('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

  const polygonAccountAddress = await phantom.getAccountAddress('polygon')
  expect(polygonAccountAddress).toEqual('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')

  const bitcoinAccountAddress = await phantom.getAccountAddress('bitcoin')
  expect(bitcoinAccountAddress).toEqual('bc1q4qw42stdzjqs59xvlrlxr8526e3nunw7mp73te')
})
