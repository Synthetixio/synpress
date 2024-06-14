import { downloadFile, ensureCacheDirExists, unzipArchive } from '.'

export const DEFAULT_METAMASK_VERSION = '11.9.1'
export const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`

export const DEFAULT_KEPLR_VERSION = '0.12.102'
export const EXTENSION_KEPLR_DOWNLOAD_URL = `https://github.com/chainapsis/keplr-wallet/releases/download/v${DEFAULT_KEPLR_VERSION}/keplr-extension-manifest-v2-v${DEFAULT_KEPLR_VERSION}.zip`;

// NOTE: This function is copied from `wallets/metamask/src/prepareExtension.ts` only TEMPORARILY!
export async function prepareKeplrExtension() {
  const cacheDirPath = ensureCacheDirExists()

  const downloadResult = await downloadFile({
    url: EXTENSION_KEPLR_DOWNLOAD_URL,
    outputDir: cacheDirPath,
    fileName: `keplr-chrome-${DEFAULT_KEPLR_VERSION}.zip`
  })

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}

export async function prepareMetamaskExtension() {
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