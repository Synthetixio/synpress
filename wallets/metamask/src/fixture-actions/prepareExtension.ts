import { downloadFile, ensureCacheDirExists, unzipArchive } from '@synthetixio/synpress-cache'
import { DEFAULT_METAMASK_VERSION, EXTENSION_DOWNLOAD_URL } from '../utils/constants'

export async function prepareExtension() {
  const cacheDirPath = ensureCacheDirExists()

  const downloadResult = await downloadFile({
    url: EXTENSION_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: `metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`
  })

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
