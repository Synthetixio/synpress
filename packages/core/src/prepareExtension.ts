import { downloadFile, ensureCacheDirExists, unzipArchive } from '.'

export const DEFAULT_METAMASK_VERSION = '11.9.1'
export const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`

// NOTE: This function is copied from `wallets/metamask/src/prepareExtension.ts` only TEMPORARILY!
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
