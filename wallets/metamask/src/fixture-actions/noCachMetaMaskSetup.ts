import path from 'node:path'
import os from 'os'
import { type BrowserContext, chromium } from '@playwright/test'
import appRoot from 'app-root-path'
import axios from 'axios'
import fs from 'fs-extra'
import unzipper from 'unzipper'

const DEFAULT_METAMASK_VERSION = '11.9.1'
const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`

// Function to prepare MetaMask extension (download and unzip)
async function prepareMetaMask(version: string = DEFAULT_METAMASK_VERSION): Promise<string> {
  // const downloadsDirectory = path.join(process.cwd(), 'downloads');
  let downloadsDirectory
  if (os.platform() === 'win32') {
    downloadsDirectory = appRoot.resolve('/node_modules')
  } else {
    downloadsDirectory = path.join(process.cwd(), 'downloads')
  }

  await fs.ensureDir(downloadsDirectory)

  const metamaskDirectory = path.join(downloadsDirectory, `metamask-chrome-${version}.zip`)
  const metamaskManifestPath = path.join(metamaskDirectory, 'manifest.json')

  if (!fs.existsSync(metamaskManifestPath)) {
    await downloadAndExtract(EXTENSION_DOWNLOAD_URL, metamaskDirectory)
  }
  const archiveFileExtension = path.extname(metamaskDirectory)
  const outputPath = metamaskDirectory.replace(archiveFileExtension, '')
  return outputPath
}

async function downloadAndExtract(url: string, destination: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'stream' })
  const writer = fs.createWriteStream(destination)
  response.data.pipe(writer)
  await new Promise((resolve) => writer.on('finish', resolve))

  await unzipArchive(destination)
}

async function unzipArchive(archivePath: string): Promise<void> {
  const archiveFileExtension = path.extname(archivePath)
  const outputPath = archivePath.replace(archiveFileExtension, '')

  await fs.ensureDir(outputPath)

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(archivePath)
        .pipe(unzipper.Parse())
        .on('entry', (entry: { path: string; type: string; pipe: (arg: unknown) => void }) => {
          const fileName = entry.path
          const type = entry.type as 'Directory' | 'File'

          if (type === 'Directory') {
            fs.mkdirSync(path.join(outputPath, fileName), { recursive: true })
            return
          }

          if (type === 'File') {
            entry.pipe(fs.createWriteStream(path.join(outputPath, fileName)))
          }
        })
        .on('finish', () => resolve(void 0))
        .on('error', (error: Error) => reject(error))
    })
  } catch (error: unknown) {
    console.error(`[unzipArchive] Error unzipping archive: ${(error as { message: string }).message}`)
    throw error
  }
}

export async function cachelessSetupMetaMask(metamaskVersion?: string): Promise<BrowserContext> {
  const metamaskPath = await prepareMetaMask(metamaskVersion || DEFAULT_METAMASK_VERSION)
  const browserArgs = [`--load-extension=${metamaskPath}`, `--disable-extensions-except=${metamaskPath}`]
  console.log(metamaskPath)
  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: browserArgs
  })
  return context
}
