import path from 'node:path'
import { fs, vol } from 'memfs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isDirEmpty } from '../../src/utils/isDirEmpty'

const ROOT_DIR = '/tmp'
const FILE_PATH = path.join(ROOT_DIR, 'file.txt')

vi.mock('fs-extra', async () => {
  return {
    default: fs.promises
  }
})

describe('isDirEmpty', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  beforeEach(() => {
    vol.mkdirSync(ROOT_DIR)
  })

  afterEach(() => {
    vol.reset() // Clear the in-memory file system after each test
  })

  it('returns `true` if the directory does not exist', async () => {
    const isEmpty = await isDirEmpty(path.join('empty_dir'))
    expect(isEmpty).toEqual(true)
  })

  it('returns `true` if the directory is empty', async () => {
    const isEmpty = await isDirEmpty(ROOT_DIR)
    expect(isEmpty).toEqual(true)
  })

  it('returns `false` if the directory contains files', async () => {
    fs.writeFileSync(FILE_PATH, 'Hello there! 👋')

    const isEmpty = await isDirEmpty(ROOT_DIR)
    expect(isEmpty).toEqual(false)
  })
})
