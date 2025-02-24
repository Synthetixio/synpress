import * as core from '@synthetixio/synpress-cache'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

import { PHANTOM_EXTENSION_DOWNLOAD_URL, prepareExtensionPhantom } from '../../src/prepareExtensionPhantom'

const MOCK_CACHE_DIR_PATH = 'mockCacheDirPath'
const MOCK_EXTENSION_ARCHIVE_PATH = 'mockExtensionArchivePath'
const MOCK_EXTENSION_FINAL_PATH = 'mockExtensionFinalPath'

vi.mock('@synthetixio/synpress-cache', async () => {
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
    unzipArchivePhantom: vi.fn().mockImplementation(() => {
      return {
        outputPath: MOCK_EXTENSION_FINAL_PATH
      }
    })
  }
})

describe('prepareExtensionPhantom', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('creates cache directory', async () => {
    const ensureCacheDirExistsSpy = vi.spyOn(core, 'ensureCacheDirExists')

    await prepareExtensionPhantom()

    expect(ensureCacheDirExistsSpy).toHaveBeenCalledOnce()
    expect(ensureCacheDirExistsSpy).toReturnWith(MOCK_CACHE_DIR_PATH)
  })

  it('downloads Phantom extension archive', async () => {
    const downloadFileSpy = vi.spyOn(core, 'downloadFile')

    await prepareExtensionPhantom()

    expect(downloadFileSpy).toHaveBeenCalledOnce()
    expect(downloadFileSpy).toHaveBeenCalledWith({
      url: PHANTOM_EXTENSION_DOWNLOAD_URL,
      outputDir: MOCK_CACHE_DIR_PATH,
      fileName: 'phantom-chrome-latest.crx'
    })
    expect(downloadFileSpy).toReturnWith({
      filePath: MOCK_EXTENSION_ARCHIVE_PATH
    })
  })

  it('unzips Phantom extension archive', async () => {
    const unzipArchiveSpy = vi.spyOn(core, 'unzipArchivePhantom')

    await prepareExtensionPhantom()

    expect(unzipArchiveSpy).toHaveBeenCalledOnce()
    expect(unzipArchiveSpy).toHaveBeenCalledWith({
      archivePath: MOCK_EXTENSION_ARCHIVE_PATH
    })
    expect(unzipArchiveSpy).toReturnWith({
      outputPath: MOCK_EXTENSION_FINAL_PATH
    })
  })

  it('returns correct unzipped extension path', async () => {
    const extensionPath = await prepareExtensionPhantom()
    expect(extensionPath).toEqual(MOCK_EXTENSION_FINAL_PATH)
  })
})
