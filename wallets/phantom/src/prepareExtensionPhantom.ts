import path from 'node:path'
import { downloadFile, ensureCacheDirExists, unzipArchivePhantom } from '@synthetixio/synpress-cache'
import fs from 'fs-extra'

export const PHANTOM_EXTENSION_DOWNLOAD_URL = 'https://crx-backup.phantom.dev/latest.crx'

export async function prepareExtensionPhantom(forceCache = true) {
  let outputDir = ''
  if (forceCache) {
    outputDir = ensureCacheDirExists()
  } else {
    outputDir = process.platform === 'win32' ? `file:\\\\\\${outputDir}` : path.resolve('./', 'downloads')

    if (!(await fs.exists(outputDir))) {
      fs.mkdirSync(outputDir)
    }
  }

  const downloadResult = await downloadFile({
    url: PHANTOM_EXTENSION_DOWNLOAD_URL,
    outputDir,
    fileName: 'phantom-chrome-latest.crx'
  })

  const unzipResult = await unzipArchivePhantom({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
