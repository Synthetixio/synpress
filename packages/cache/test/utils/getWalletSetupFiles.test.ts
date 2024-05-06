import path from 'node:path'
import { fs, vol } from 'memfs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getWalletSetupFiles } from '../../src/utils/getWalletSetupFiles'

const ROOT_DIR = '/tmp'
const DUMMY_CONTENT = 'Hello world! 👋'

vi.mock('fs-extra', async () => {
  return {
    default: fs.promises
  }
})

async function createFiles(fileNames: string[]) {
  for (const fileName of fileNames) {
    const filePath = path.join(ROOT_DIR, fileName)
    await fs.promises.writeFile(filePath, DUMMY_CONTENT)
  }
}

describe('getWalletSetupFiles', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  beforeEach(async () => {
    vol.mkdirSync(ROOT_DIR)
    await createFiles([
      'quack',
      'quack.js',
      'quack.mjs',
      'quack.cjs',
      'quack.ts',
      'quack.tsx',
      'quack.setup',
      'quack.setup.js',
      'quack.setup.mjs',
      'quack.setup.cjs',
      'quack.setup.ts',
      'quack.setup.tsx'
    ])
  })

  afterEach(() => {
    vol.reset() // Clear the in-memory file system after each test
  })

  it('throws if unknown error', async () => {
    // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
    await expect(getWalletSetupFiles(null!)).rejects.toThrowError('path must be a string or Buffer')
  })

  it('throws if the target directory does not exist', async () => {
    const nonExistentDirPath = path.join(ROOT_DIR, 'non-existent-dir')
    await expect(getWalletSetupFiles(nonExistentDirPath)).rejects.toThrowError(
      `[GetWalletSetupFiles] Wallet setup directory does not exist at ${nonExistentDirPath}`
    )
  })

  it('throws if no setup files are found in the target directory', async () => {
    const emptyDirPath = path.join(ROOT_DIR, 'empty-dir')
    vol.mkdirSync(emptyDirPath)

    await expect(getWalletSetupFiles(emptyDirPath)).rejects.toThrowError(
      `[GetWalletSetupFiles] No wallet setup files found at ${emptyDirPath}`
    )
  })

  it('returns only valid setup files', async () => {
    const setupFiles = await getWalletSetupFiles(ROOT_DIR)

    expect(setupFiles).toHaveLength(3)
    expect(setupFiles).toContain('quack.setup.ts')
    expect(setupFiles).toContain('quack.setup.js')
    expect(setupFiles).toContain('quack.setup.mjs')
  })
})
