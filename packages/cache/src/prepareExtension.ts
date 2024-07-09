import download from 'download'
import unzipCrx from 'unzip-crx-3'
import { downloadFile, ensureCacheDirExists, unzipArchive } from '.'

interface ExtensionConfig {
  name: string
  version: string
  downloadUrl: string
}

export async function getExtensionConfig(name: string): Promise<ExtensionConfig> {
  const config = {
    extensions: [
      {
        name: 'MetaMask',
        version: '11.9.1',
        downloadUrl:
          'https://github.com/MetaMask/metamask-extension/releases/download/v11.9.1/metamask-chrome-11.9.1.zip'
      },
      {
        name: 'Keplr',
        version: '0.12.102',
        downloadUrl:
          'https://github.com/chainapsis/keplr-wallet/releases/download/v0.12.102/keplr-extension-manifest-v2-v0.12.102.zip'
      },
      {
        name: 'Phantom',
        version: 'phantom-chrome-latest',
        downloadUrl: 'https://crx-backup.phantom.dev/latest.crx'
      }
    ]
  }

  const extension = config.extensions.find((ext: { name: string }) => ext.name === name)
  if (!extension) {
    throw new Error(`Extension configuration not found for ${name}`)
  }
  return extension
}

export async function prepareExtension(extensionName: string) {
  const cacheDirPath = ensureCacheDirExists()
  const extensionConfig = await getExtensionConfig(extensionName) // Get config
  let downloadResult
  if (extensionConfig.name === 'Phantom') {
    const outputPath = `${cacheDirPath}/latest`
    downloadResult = await download(extensionConfig.downloadUrl, cacheDirPath, {
      headers: {
        Accept: 'application/octet-stream'
      }
    })
    await unzipCrx('.cache-synpress/latest.crx', outputPath)
    return outputPath
  } else {
    downloadResult = await downloadFile({
      url: extensionConfig.downloadUrl,
      outputDir: cacheDirPath,
      fileName: `${extensionConfig.name.toLowerCase()}-chrome-${extensionConfig.version}.zip`
    })
    const unzipResult = await unzipArchive({
      archivePath: downloadResult.filePath
    })

    return unzipResult.outputPath
  }
}
