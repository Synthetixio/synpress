import { downloadFile, ensureCacheDirExists, unzipArchive } from '@synthetixio/synpress-core'

export const DEFAULT_METAMASK_VERSION = '11.9.1'
export const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`

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
