import os from 'node:os'
import path from 'node:path'
import { fs, vol } from 'memfs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTempContextDir } from '../../src/utils/createTempContextDir'

const BROWSER_NAME = 'chromium'
const TEST_ID = 'test-id'
const SUFFIX = '123456'

const ROOT_DIR = '/tmp'
const TEMP_DIR_PATH = path.join(ROOT_DIR, `synpress_${BROWSER_NAME}_${TEST_ID}_${SUFFIX}`)

vi.mock('fs-extra', async () => {
  return {
    default: {
      ...fs,
      mkdtemp: async (prefix: string) => {
        const dirName = prefix + SUFFIX
        await fs.promises.mkdir(dirName)
        return dirName
      }
    }
  }
})

vi.mock('node:os', async () => {
  return {
    default: {
      tmpdir: () => ROOT_DIR
    }
  }
})

describe('createTempContextDir', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  beforeEach(() => {
    vol.mkdirSync(ROOT_DIR)
  })

  afterEach(() => {
    vol.reset() // Clear the in-memory file system after each test
    vi.clearAllMocks()
  })

  it('calls os.tmpdir', async () => {
    const osTmpDirSpy = vi.spyOn(os, 'tmpdir')

    await createTempContextDir(BROWSER_NAME, TEST_ID)

    expect(osTmpDirSpy).toHaveBeenCalledOnce()
  })

  it('returns path to the directory', async () => {
    const tempDirPath = await createTempContextDir(BROWSER_NAME, TEST_ID)
    expect(tempDirPath).toEqual(TEMP_DIR_PATH)
  })

  it('creates a directory with the correct name', async () => {
    expect(fs.readdirSync(ROOT_DIR)).toHaveLength(0)

    const tempDirPath = await createTempContextDir(BROWSER_NAME, TEST_ID)

    expect(fs.readdirSync(ROOT_DIR)).toHaveLength(1)
    expect(fs.existsSync(tempDirPath)).toBeTruthy()
  })
})
