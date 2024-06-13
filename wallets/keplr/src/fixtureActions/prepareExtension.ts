import { downloadFile, ensureCacheDirExists, unzipArchive } from '@synthetixio/synpress-cache'

export const DEFAULT_KEPLR_VERSION = '0.12.101'
export const EXTENSION_DOWNLOAD_URL = `https://github.com/chainapsis/keplr-wallet/releases/download/v${DEFAULT_KEPLR_VERSION}/keplr-extension-manifest-v2-v${DEFAULT_KEPLR_VERSION}.zip`;
export async function prepareExtension() {
  const cacheDirPath = ensureCacheDirExists()

  const downloadResult = await downloadFile({
    url: EXTENSION_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: `keplr-extension-manifest-v2-v${DEFAULT_KEPLR_VERSION}.zip`
  })

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
