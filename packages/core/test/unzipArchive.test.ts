import path from 'node:path'
import { fs, vol } from 'memfs'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { unzipArchive } from '../src/unzipArchive'
import {
  ARCHIVE_CONTENTS,
  createTestZipArchive,
  createTestZipArchiveWithIncorrectEntries
} from './test-utils/createTestZipArchive'

const ROOT_DIR = '/tmp'
const FILE_NAME = 'duck.txt'
const NESTED_FILE_NAME = 'nested-duck.txt'
const ARCHIVE_PATH = path.join(ROOT_DIR, 'archive.zip')
const OUTPUT_PATH = path.join(ROOT_DIR, 'archive')
const OUTPUT_NESTED_DIR_PATH = path.join(OUTPUT_PATH, 'nested')
const FILE_OUTPUT_PATH = path.join(OUTPUT_PATH, FILE_NAME)
const NESTED_FILE_OUTPUT_PATH = path.join(OUTPUT_NESTED_DIR_PATH, NESTED_FILE_NAME)

vi.mock('fs-extra', async () => {
  return {
    default: fs
  }
})

describe('unzipArchive', () => {
  beforeEach(async () => {
    vol.mkdirSync(ROOT_DIR)
  })

  afterEach(() => {
    // Using this instead of `vol.reset()` due to a bug with streams:
    // https://github.com/streamich/memfs/issues/550
    vol.rmdirSync(ROOT_DIR, { recursive: true })
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  describe('when the archive cannot be unzipped', () => {
    const incorrectArchivePath = `${ROOT_DIR}/incorrect-archive.zip`
    const outputDirPath = `${ROOT_DIR}/incorrect-archive`

    beforeEach(() => {
      fs.writeFileSync(incorrectArchivePath, 'Hello there! 👋') // Plain text file
    })

    it('throws an error', async () => {
      const unzipFileFuncCall = unzipArchive({
        archivePath: incorrectArchivePath
      })

      await expect(unzipFileFuncCall).rejects.toThrowError(
        '[UnzipFile] Error unzipping the file - [Pipe] invalid signature'
      )
    })

    it('removes the output directory if an error is thrown', async () => {
      const unzipFileFuncCall = unzipArchive({
        archivePath: incorrectArchivePath
      })

      await expect(unzipFileFuncCall).rejects.toThrow()
      expect(fs.existsSync(outputDirPath)).toBe(false)
    })
  })

  describe('when the output directory does not exist', () => {
    const runTestAndValidate = async () => {
      const result = await unzipArchive({
        archivePath: ARCHIVE_PATH
      })

      expect(result).toStrictEqual({
        outputPath: OUTPUT_PATH,
        unzipSkipped: false
      })
      expect(fs.existsSync(result.outputPath)).toBe(true)
      expect(fs.readFileSync(FILE_OUTPUT_PATH, 'utf8')).toBe(ARCHIVE_CONTENTS[FILE_NAME])
      expect(fs.readFileSync(NESTED_FILE_OUTPUT_PATH, 'utf8')).toBe(ARCHIVE_CONTENTS[NESTED_FILE_NAME])
    }

    it('unzips the archive', async () => {
      // Setup
      createTestZipArchive(ARCHIVE_PATH)

      await runTestAndValidate()
    })

    it('unzips the archive if it contains incorrectly encoded directories', async () => {
      // Setup
      await createTestZipArchiveWithIncorrectEntries(ARCHIVE_PATH)

      await runTestAndValidate()
    })
  })

  describe('when the archive is already unzipped', () => {
    const unzippedFileContent = 'This is an unzipped duck file! 🦆'

    beforeEach(() => {
      fs.mkdirSync(OUTPUT_PATH)
      fs.writeFileSync(FILE_OUTPUT_PATH, unzippedFileContent)
      expect(fs.existsSync(FILE_OUTPUT_PATH)).toBe(true)
    })

    it('skips unzipping', async () => {
      const createReadStreamSpy = vi.spyOn(fs, 'createReadStream')

      const result = await unzipArchive({
        archivePath: ARCHIVE_PATH
      })

      expect(result).toStrictEqual({
        outputPath: OUTPUT_PATH,
        unzipSkipped: true
      })
      expect(fs.existsSync(FILE_OUTPUT_PATH)).toBe(true)
      expect(fs.readFileSync(FILE_OUTPUT_PATH, 'utf8')).toBe(unzippedFileContent)

      expect(createReadStreamSpy).not.toHaveBeenCalled()
    })

    it('overwrites the output directory if the `overwrite` flag is present', async () => {
      createTestZipArchive(ARCHIVE_PATH)

      const result = await unzipArchive({
        archivePath: ARCHIVE_PATH,
        overwrite: true
      })

      expect(result).toStrictEqual({
        outputPath: OUTPUT_PATH,
        unzipSkipped: false
      })
      expect(fs.existsSync(result.outputPath)).toBe(true)
      expect(fs.readFileSync(FILE_OUTPUT_PATH, 'utf8')).not.toBe(unzippedFileContent)
      expect(fs.readFileSync(NESTED_FILE_OUTPUT_PATH, 'utf8')).toBe(ARCHIVE_CONTENTS[NESTED_FILE_NAME])
    })
  })
})
