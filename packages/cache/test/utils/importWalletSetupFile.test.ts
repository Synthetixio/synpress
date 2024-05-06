import { afterAll, describe, expect, it, vi } from 'vitest'
import { importWalletSetupFile } from '../../src/utils/importWalletSetupFile'

vi.mock('../../src/ensureCacheDirExists', async () => {
  return {
    ensureCacheDirExists: vi.fn(() => '/tmp')
  }
})

vi.mock('./valid.setup.ts', async () => {
  return {
    default: {
      hash: 'bca3f22838f317ed9e87',
      fn: async () => {
        return
      }
    }
  }
})

vi.mock('./invalid.setup.ts', async () => {
  return {
    default: {
      duck: 'Quack! 🦆'
    }
  }
})

describe('importWalletSetupFile', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  // This error is from `await import`.
  it('throws if the target file does not exist', async () => {
    const nonExistentFilePath = './non-existent-file.ts'
    await expect(importWalletSetupFile(nonExistentFilePath)).rejects.toThrowError(
      `Failed to load url ${nonExistentFilePath}`
    )
  })

  it('throws if the target file is not a valid wallet setup file', async () => {
    const invalidFilePath = './invalid.setup.ts'
    await expect(importWalletSetupFile(invalidFilePath)).rejects.toThrowError(
      `[ImportWalletSetupFile] Invalid wallet setup function at ${invalidFilePath}`
    )
  })

  it('returns the hash and function of a valid wallet setup file', async () => {
    const validFilePath = './valid.setup.ts'
    const result = await importWalletSetupFile(validFilePath)

    expect(result).toEqual({
      hash: 'bca3f22838f317ed9e87',
      fn: expect.any(Function)
    })
  })
})
