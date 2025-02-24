import { downloadFile, ensureCacheDirExists, unzipArchivePhantom } from '.'

export const PHANTOM_EXTENSION_DOWNLOAD_URL = 'https://crx-backup.phantom.dev/latest.crx'

// NOTE: This function is copied from `wallets/phantom/src/prepareExtensionPhantom.ts` only TEMPORARILY!
export async function prepareExtensionPhantom() {
  const cacheDirPath = ensureCacheDirExists()

  const downloadResult = await downloadFile({
    url: PHANTOM_EXTENSION_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: 'phantom-chrome-latest.crx'
  })

  const unzipResult = await unzipArchivePhantom({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
