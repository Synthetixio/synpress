import { fs, vol } from 'memfs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import path from 'node:path'
import fsExtra from 'fs-extra'
import type { WalletSetupFunction } from '../../src'
import * as EnsureCacheDirExists from '../../src/ensureCacheDirExists'
import * as CreateCacheForWalletSetupFunction from '../../src/utils/createCacheForWalletSetupFunction'
import { triggerCacheCreation } from '../../src/utils/triggerCacheCreation'

const ROOT_DIR = '/tmp'
const EXTENSION_PATH = path.join(ROOT_DIR, 'extension')

vi.mock('fs-extra', async () => {
  return {
    default: {
      ...fs.promises,
      exists: async (path: string) => {
        return vol.existsSync(path)
      },
      remove: async (path: string) => {
        vol.rmdirSync(path)
      }
    }
  }
})

vi.mock('../../src/ensureCacheDirExists', async () => {
  return {
    ensureCacheDirExists: vi.fn(() => '/tmp')
  }
})

vi.mock('../../src/utils/createCacheForWalletSetupFunction', async () => {
  return {
    createCacheForWalletSetupFunction: vi.fn(async () => {
      return 'Resolved Quack! 🦆'
    })
  }
})

// We're not adding a test for code that uses `isDirEmpty` because soon it will be removed.
vi.mock('../../src/utils/isDirEmpty', async () => {
  return {
    isDirEmpty: vi.fn(async () => {
      return false
    })
  }
})

describe('triggerCacheCreation', () => {
  const createCacheForWalletSetupFunctionSpy = vi.spyOn(
    CreateCacheForWalletSetupFunction,
    'createCacheForWalletSetupFunction'
  )

  const downloadExtension = vi.fn(async () => EXTENSION_PATH)
  const testSetupFunction = vi.fn()

  function prepareSetupFunctions(hashes: string[]) {
    const setupFunctions = new Map<string, { fileName: string; setupFunction: WalletSetupFunction }>()

    for (const hash of hashes) {
      setupFunctions.set(hash, { fileName: path.join(ROOT_DIR, `${hash}.ts`), setupFunction: testSetupFunction })
    }

    return setupFunctions
  }

  function expectCreateCacheForWalletSetupFunction(
    n: number,
    setupFunctions: ReturnType<typeof prepareSetupFunctions>,
    hash: string
  ) {
    const fileNameWithCorrectExtension = setupFunctions.get(hash)?.fileName?.replace(/\.(ts|js|mjs)$/, '.{ts,js,mjs}')

    expect(createCacheForWalletSetupFunctionSpy).toHaveBeenNthCalledWith(
      n,
      EXTENSION_PATH,
      path.join(ROOT_DIR, hash),
      testSetupFunction,
      fileNameWithCorrectExtension
    )
  }

  afterAll(() => {
    vi.resetAllMocks()
  })

  beforeEach(() => {
    vol.mkdirSync(ROOT_DIR)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vol.reset() // Clear the in-memory file system after each test
  })

  it('calls ensureCacheDirExists', async () => {
    const ensureCacheDirExistsSpy = vi.spyOn(EnsureCacheDirExists, 'ensureCacheDirExists')

    const setupFunctions = prepareSetupFunctions(['hash1', 'hash2'])
    await triggerCacheCreation(setupFunctions, downloadExtension, false)

    expect(ensureCacheDirExistsSpy).toHaveBeenCalledOnce()
  })

  it('calls passed downloadExtension function', async () => {
    const setupFunctions = prepareSetupFunctions(['hash1', 'hash2'])
    await triggerCacheCreation(setupFunctions, downloadExtension, false)

    expect(downloadExtension).toHaveBeenCalledOnce()
  })

  it('calls createCacheForWalletSetupFunction with correct arguments', async () => {
    const setupFunctions = prepareSetupFunctions(['hash1', 'hash2'])
    await triggerCacheCreation(setupFunctions, downloadExtension, false)

    expect(createCacheForWalletSetupFunctionSpy).toHaveBeenCalledTimes(2)
    expectCreateCacheForWalletSetupFunction(1, setupFunctions, 'hash1')
    expectCreateCacheForWalletSetupFunction(2, setupFunctions, 'hash2')
  })

  it('checks if cache already exists for each entry', async () => {
    const existsSpy = vi.spyOn(fsExtra, 'exists')

    const setupFunctions = prepareSetupFunctions(['hash1', 'hash2'])
    await triggerCacheCreation(setupFunctions, downloadExtension, false)

    expect(existsSpy).toHaveBeenCalledTimes(2)
    expect(existsSpy).toHaveBeenNthCalledWith(1, path.join(ROOT_DIR, 'hash1'))
    expect(existsSpy).toHaveBeenNthCalledWith(2, path.join(ROOT_DIR, 'hash2'))
  })

  it('returns an array of createCacheForWalletSetupFunction promises', async () => {
    const setupFunctions = prepareSetupFunctions(['hash1', 'hash2'])
    const promises = await triggerCacheCreation(setupFunctions, downloadExtension, false)

    expect(promises).toHaveLength(2)
    expect(promises[0]).toBeInstanceOf(Promise)
    expect(promises[1]).toBeInstanceOf(Promise)
  })

  describe('when force flag is false', () => {
    it('ignores setup function for which cache already exists', async () => {
      const setupFunctions = prepareSetupFunctions(['hash1', 'hash2', 'hash3'])

      // Creating cache for 2nd setup function.
      fs.mkdirSync(path.join(ROOT_DIR, 'hash2'))

      const promises = await triggerCacheCreation(setupFunctions, downloadExtension, false)

      expect(promises).toHaveLength(2)
      expect(createCacheForWalletSetupFunctionSpy).toHaveBeenCalledTimes(2)
      expectCreateCacheForWalletSetupFunction(1, setupFunctions, 'hash1')
      expectCreateCacheForWalletSetupFunction(2, setupFunctions, 'hash3')
    })
  })

  describe('when force flag is true', () => {
    it('removes cache if it already exists for given setup function', async () => {
      const setupFunctions = prepareSetupFunctions(['hash1', 'hash2', 'hash3'])

      // Creating cache for 2nd setup function.
      const pathToExistingCache = path.join(ROOT_DIR, 'hash2')
      fs.mkdirSync(pathToExistingCache)

      await triggerCacheCreation(setupFunctions, downloadExtension, true)

      expect(fs.existsSync(pathToExistingCache)).toBe(false)
    })

    it('calls createCacheForWalletSetupFunction for setup functions that were previously cached', async () => {
      const setupFunctions = prepareSetupFunctions(['hash1', 'hash2', 'hash3'])

      // Creating cache for 2nd setup function.
      fs.mkdirSync(path.join(ROOT_DIR, 'hash2'))

      const promises = await triggerCacheCreation(setupFunctions, downloadExtension, true)

      expect(promises).toHaveLength(3)
      expect(createCacheForWalletSetupFunctionSpy).toHaveBeenCalledTimes(3)
      expectCreateCacheForWalletSetupFunction(1, setupFunctions, 'hash1')
      expectCreateCacheForWalletSetupFunction(2, setupFunctions, 'hash2')
      expectCreateCacheForWalletSetupFunction(3, setupFunctions, 'hash3')
    })
  })
})
