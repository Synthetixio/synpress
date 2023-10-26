import { describe, expect, it } from 'vitest'
import { defineWalletSetup } from '../src/defineWalletSetup'

const PASSWORD = 'Quack Quack! 🦆'
const EXPECTED_HASH = '69620d59802a61c6900f'

const testWalletSetupFunction = async (): Promise<void> => {
  const result = 1 + 2
  if (result !== 3) {
    throw new Error('That damn Quacker messed with my math again! 😡')
  }

  return
}

describe('defineWalletSetup', () => {
  it('returns hash, function and wallet password', async () => {
    const { hash, fn, walletPassword } = defineWalletSetup(PASSWORD, testWalletSetupFunction)
    expect(hash).toEqual(EXPECTED_HASH)
    expect(fn.toString()).toEqual(testWalletSetupFunction.toString())
    expect(walletPassword).toEqual(PASSWORD)
  })
})
