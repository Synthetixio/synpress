import path from 'node:path'
import axios from 'axios'
import { fs, vol } from 'memfs'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import { downloadFile } from '../src/downloadFile'

const ROOT_DIR = '/tmp'
const FILE_NAME = 'duck.txt'
const FILE_CONTENT = 'Downloadable Quack! 🐾'
const FILE_PATH = path.join(ROOT_DIR, FILE_NAME)
const MOCK_URL = `https://example.com/${FILE_NAME}`

const server = setupServer(
  rest.get(MOCK_URL, (_, res, ctx) => {
    return res(ctx.text(FILE_CONTENT))
  })
)

vi.mock('fs-extra', async () => {
  return {
    default: fs
  }
})

describe('downloadFile', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
    vi.resetAllMocks()
  })

  beforeEach(() => {
    vol.mkdirSync(ROOT_DIR)
  })

  afterEach(() => {
    server.resetHandlers()
    vol.reset() // Clear the in-memory file system after each test
    vi.clearAllMocks()
  })

  it('calls axios.get with the correct arguments', async () => {
    const axiosSpy = vi.spyOn(axios, 'get')

    await downloadFile({
      url: MOCK_URL,
      outputDir: ROOT_DIR,
      fileName: FILE_NAME
    })

    expect(axiosSpy).toHaveBeenCalledOnce()
    expect(axiosSpy).toHaveBeenCalledWith(MOCK_URL, {
      responseType: 'stream'
    })
  })

  it('throws an error if the file cannot be downloaded', async () => {
    server.use(
      rest.get(MOCK_URL, (_, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: 'Internal server error' })
        )
      })
    )

    const downloadFileFuncCall = downloadFile({
      url: MOCK_URL,
      outputDir: ROOT_DIR,
      fileName: FILE_NAME
    })

    await expect(downloadFileFuncCall).rejects.toThrowError(
      '[DownloadFile] Error downloading the file - [Axios] Request failed with status code 500'
    )
  })

  describe('when the file does not exist', () => {
    it('downloads a file', async () => {
      const result = await downloadFile({
        url: MOCK_URL,
        outputDir: ROOT_DIR,
        fileName: FILE_NAME
      })

      expect(result).to.deep.equal({
        filePath: FILE_PATH,
        downloadSkipped: false
      })
      expect(fs.existsSync(result.filePath)).toBe(true)
      expect(fs.readFileSync(result.filePath, 'utf8')).toBe(FILE_CONTENT)
    })
  })

  describe('when the file already exists', () => {
    const existingMockFileContent = 'This is an existing duck file! 🦆'

    beforeEach(() => {
      fs.writeFileSync(FILE_PATH, existingMockFileContent)
      expect(fs.existsSync(FILE_PATH)).toBe(true)
    })

    it('skips download', async () => {
      const result = await downloadFile({
        url: MOCK_URL,
        outputDir: ROOT_DIR,
        fileName: FILE_NAME
      })

      expect(result).to.deep.equal({
        filePath: FILE_PATH,
        downloadSkipped: true
      })
      expect(fs.existsSync(result.filePath)).toBe(true)
      expect(fs.readFileSync(result.filePath, 'utf8')).toBe(
        existingMockFileContent
      )
    })

    it('overwrites the existing file if the `overrideFile` flag is present', async () => {
      const result = await downloadFile({
        url: MOCK_URL,
        outputDir: ROOT_DIR,
        fileName: FILE_NAME,
        overrideFile: true
      })

      expect(result).to.deep.equal({
        filePath: FILE_PATH,
        downloadSkipped: false
      })
      expect(fs.existsSync(result.filePath)).toBe(true)
      expect(fs.readFileSync(result.filePath, 'utf8')).toBe(FILE_CONTENT)
    })
  })
})
