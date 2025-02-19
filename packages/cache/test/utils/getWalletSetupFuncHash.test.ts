import { describe, expect, it } from 'vitest'
import { WALLET_SETUP_FUNC_HASH_LENGTH, getWalletSetupFuncHash } from '../../src/utils/getWalletSetupFuncHash'

const EXPECTED_HASH = '117dc0b7e0dd758cfee3'

describe('getWalletSetupFuncHash', () => {
  it('throws an error if esbuild transformation fails', async () => {
    const incorrectFunctionObject = {
      toString: () => null
      // biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
    } as any

    expect(() => getWalletSetupFuncHash(incorrectFunctionObject)).toThrowError(
      'The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object'
    )
  })

  it('returns hash', async () => {
    const hash = getWalletSetupFuncHash('test_test')
    expect(hash).toEqual(EXPECTED_HASH)
  })

  it('returns hash of a correct length', async () => {
    const hash = getWalletSetupFuncHash('test_test2')

    // We multiply by 2 because the hash is in a hex format, i.e. each byte is represented by 2 characters.
    expect(hash.length).toEqual(2 * WALLET_SETUP_FUNC_HASH_LENGTH)
  })
})
