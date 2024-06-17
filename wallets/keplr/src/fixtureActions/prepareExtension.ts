import { downloadFile, ensureCacheDirExists, unzipArchive } from '@synthetixio/synpress-cache'

interface ExtensionConfig {
  name: string;
  version: string;
  downloadUrl: string;
}

async function getExtensionConfig(name: string): Promise<ExtensionConfig> {
  const config = {
    "extensions": [
      {
        "name": "MetaMask",
        "version": "11.9.1",
        "downloadUrl": "https://github.com/MetaMask/metamask-extension/releases/download/v11.9.1/metamask-chrome-11.9.1.zip"
      },
      {
        "name": "Keplr",
        "version": "0.12.102",
        "downloadUrl": "https://github.com/chainapsis/keplr-wallet/releases/download/v0.12.102/keplr-extension-manifest-v2-v0.12.102.zip" 
      }
    ]
  }

  const extension = config.extensions.find((ext: { name: string }) => ext.name === name);
  if (!extension) {
    throw new Error(`Extension configuration not found for ${name}`);
  }
  return extension;
}

export async function prepareExtension(extensionName: string) {
  const cacheDirPath = ensureCacheDirExists();
  const extensionConfig = await getExtensionConfig(extensionName); // Get config

  const downloadResult = await downloadFile({
    url: extensionConfig.downloadUrl,
    outputDir: cacheDirPath,
    fileName: `${extensionConfig.name.toLowerCase()}-chrome-${extensionConfig.version}.zip`
  });

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath
  });

  return unzipResult.outputPath;
}