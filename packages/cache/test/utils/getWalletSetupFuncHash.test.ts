import { describe, expect, it } from 'vitest'
import { WALLET_SETUP_FUNC_HASH_LENGTH, getWalletSetupFuncHash } from '../../src/utils/getWalletSetupFuncHash'

const EXPECTED_HASH = 'b940c886be3c1a041ddd'

const testFunction = async (name: string) => {
  return `Hello ${name}!`
}

describe('getWalletSetupFuncHash', () => {
  it('throws an error if esbuild transformation fails', async () => {
    const incorrectFunctionObject = {
      toString: () => null
      // biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
    } as any

    expect(() => getWalletSetupFuncHash(incorrectFunctionObject)).toThrowError('Transform failed with 1 error')
  })

  it('returns hash', async () => {
    const hash = getWalletSetupFuncHash(testFunction)
    expect(hash).toEqual(EXPECTED_HASH)
  })

  it('returns hash of a correct length', async () => {
    const hash = getWalletSetupFuncHash(testFunction)

    // We multiply by 2 because the hash is in a hex format, i.e. each byte is represented by 2 characters.
    expect(hash.length).toEqual(2 * WALLET_SETUP_FUNC_HASH_LENGTH)
  })
})
