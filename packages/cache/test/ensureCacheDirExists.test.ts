import path from 'node:path'
import fs from 'fs-extra'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { CACHE_DIR_NAME } from '../src/constants'
import { ensureCacheDirExists } from '../src/ensureCacheDirExists'

vi.mock('fs-extra', async () => {
  return {
    default: {
      ensureDirSync: vi.fn()
    }
  }
})

const EXPECTED_CACHE_DIR_PATH = path.join(process.cwd(), CACHE_DIR_NAME)

describe('ensureCacheDirExists', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('calls `fs.ensureDirSync` with correct cache directory path', async () => {
    const ensureDirSyncSpy = vi.spyOn(fs, 'ensureDirSync')

    ensureCacheDirExists()

    expect(ensureDirSyncSpy).toHaveBeenCalledOnce()
    expect(ensureDirSyncSpy).toHaveBeenCalledWith(EXPECTED_CACHE_DIR_PATH)
  })

  it('returns the cache directory path', async () => {
    const cacheDirPath = ensureCacheDirExists()
    expect(cacheDirPath).toEqual(EXPECTED_CACHE_DIR_PATH)
  })
})
