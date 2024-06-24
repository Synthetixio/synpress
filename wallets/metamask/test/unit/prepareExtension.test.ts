import { prepareExtension } from '@synthetixio/synpress-cache'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

const MOCK_CACHE_DIR_PATH = 'mockCacheDirPath'
const MOCK_EXTENSION_FINAL_PATH = 'mockExtensionFinalPath'

vi.mock('@synthetixio/synpress-cache', async (importOriginal) => {
  const prep: { prepareExtension: () => void } = await importOriginal()

  return {
    default: vi.fn(),
    ensureCacheDirExists: vi.fn().mockImplementation(() => MOCK_CACHE_DIR_PATH),
    downloadFile: vi.fn().mockImplementation(() => {
      return {
        filePath: 'mockExtensionArchivePath'
      }
    }),
    unzipArchive: vi.fn().mockImplementation(() => {
      return {
        outputPath: MOCK_EXTENSION_FINAL_PATH
      }
    }),
    prepareExtension: prep.prepareExtension
  }
})

describe('prepareExtension', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('returns correct unzipped extension path', async () => {
    const extensionPath = await prepareExtension('MetaMask')
    expect(extensionPath).toBeDefined()
  })
})
