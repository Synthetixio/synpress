import { downloadFile, ensureCacheDirExists, unzipArchive } from 'core'

export const DEFAULT_METAMASK_VERSION = '10.25.0'
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
