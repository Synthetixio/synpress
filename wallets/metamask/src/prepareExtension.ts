import path from 'node:path'
import { downloadFile, ensureCacheDirExists, unzipArchive } from '@synthetixio/synpress-cache'
import fs from 'fs-extra'

export const DEFAULT_METAMASK_VERSION = '11.9.1'
export const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`

export async function prepareExtension(forceCache = true) {
  let outputDir = ''
  if (forceCache) {
    outputDir = ensureCacheDirExists()
  } else {
    outputDir = path.resolve('./', 'downloads')

    if (!(await fs.exists(outputDir))) {
      fs.mkdirSync(outputDir)
    }
  }

  const downloadResult = await downloadFile({
    url: EXTENSION_DOWNLOAD_URL,
    outputDir,
    fileName: `metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`
  })

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
