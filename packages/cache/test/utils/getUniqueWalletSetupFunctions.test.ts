import { afterAll, describe, expect, it, vi } from 'vitest'
import { getUniqueWalletSetupFunctions } from '../../src/utils/getUniqueWalletSetupFunctions'

vi.mock('../../src/utils/getWalletSetupFiles', async () => {
  return {
    getWalletSetupFiles: async (path: string) => {
      if (path === 'invalid') {
        return [
          'mallard-duck-1.setup.ts',
          'mallard-duck-2.setup.ts',
          'mandarin-duck-1.setup.ts',
          'mandarin-duck-2.setup.ts',
          'perry-the-platypus.setup.ts',
          'dr-heinz-doofenshmirtz.setup.ts'
        ]
      }

      // Happy valid path.
      return ['perry-the-platypus.setup.ts', 'dr-heinz-doofenshmirtz.setup.ts']
    }
  }
})

vi.mock('../../src/utils/importWalletSetupFile', async () => {
  return {
    importWalletSetupFile: async (filePath: string) => {
      const fn = async () => {
        return
      }

      if (filePath.includes('mallard-duck')) {
        return {
          hash: '1ba3f33e2d4ee1b7567c',
          fn
        }
      }

      if (filePath.includes('mandarin-duck')) {
        return {
          hash: '5b7e41ab761187064b2a',
          fn
        }
      }

      if (filePath.includes('dr-heinz-doofenshmirtz')) {
        return {
          hash: '0a547b6910d7f1034196',
          fn
        }
      }

      // Perry the platypus 🕵️‍♂️
      return {
        hash: 'f992037c880ad53e72f2',
        fn
      }
    }
  }
})

vi.mock('./mallard-duck-1.setup.ts', async () => ({
  default: {
    hash: '1ba3f33e2d4ee1b7567c',
    fn: async () => {
      return
    }
  }
}))

vi.mock('./mallard-duck-2.setup.ts', async () => ({
  default: {
    hash: '1ba3f33e2d4ee1b7567c',
    fn: async () => {
      return
    }
  }
}))

vi.mock('./mandarin-duck-1.setup.ts', async () => ({
  default: {
    hash: '5b7e41ab761187064b2a',
    fn: async () => {
      return
    }
  }
}))

vi.mock('./mandarin-duck-2.setup.ts', async () => ({
  default: {
    hash: '5b7e41ab761187064b2a',
    fn: async () => {
      return
    }
  }
}))

vi.mock('./perry-the-platypus.setup.ts', async () => ({
  default: {
    hash: 'f992037c880ad53e72f2',
    fn: async () => {
      return
    }
  }
}))

vi.mock('./dr-heinz-doofenshmirtz.setup.ts', async () => ({
  default: {
    hash: '0a547b6910d7f1034196',
    fn: async () => {
      return
    }
  }
}))

describe('getUniqueWalletSetupFunctions', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  it('throws if there are identical setup functions', async () => {
    await expect(getUniqueWalletSetupFunctions('invalid')).rejects.toThrowError(
      [
        '[GetUniqueWalletSetupFunctions] There are identical wallet setup functions:',
        '\t1ba3f33e2d4ee1b7567c - [mallard-duck-1.setup.ts, mallard-duck-2.setup.ts]',
        '\t5b7e41ab761187064b2a - [mandarin-duck-1.setup.ts, mandarin-duck-2.setup.ts]'
      ].join('\n')
    )
  })

  it('returns a map of unique setup functions', async () => {
    const setupFunctions = await getUniqueWalletSetupFunctions('valid')

    expect(setupFunctions.size).toEqual(2)
    expect(Array.from(setupFunctions.keys())).toEqual(['f992037c880ad53e72f2', '0a547b6910d7f1034196'])
    expect(Array.from(setupFunctions.values())).toEqual([
      {
        fileName: 'perry-the-platypus.setup.ts',
        setupFunction: expect.any(Function)
      },
      {
        fileName: 'dr-heinz-doofenshmirtz.setup.ts',
        setupFunction: expect.any(Function)
      }
    ])
  })
})
