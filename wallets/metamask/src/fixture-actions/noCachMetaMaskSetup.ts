import path from 'node:path'
import { type BrowserContext, chromium } from '@playwright/test'
import appRoot from 'app-root-path'
import axios from 'axios'
import fs from 'fs-extra'
import unzipper from 'unzipper'
import { DEFAULT_METAMASK_VERSION, EXTENSION_DOWNLOAD_URL } from '../utils/constants'

async function prepareMetaMask(version: string = DEFAULT_METAMASK_VERSION): Promise<string> {
  let downloadsDirectory
  if (process.platform === 'win32') {
    downloadsDirectory = appRoot.resolve('/node_modules')
  } else {
    downloadsDirectory = path.join(process.cwd(), 'downloads')
  }

  await fs.ensureDir(downloadsDirectory)

  const metamaskDirectory = path.join(downloadsDirectory, `metamask-chrome-${version}.zip`)
  const archiveFileExtension = path.extname(metamaskDirectory)
  const outputPath = metamaskDirectory.replace(archiveFileExtension, '')
  const metamaskManifestPath = path.join(outputPath, 'manifest.json')

  if (!fs.existsSync(metamaskManifestPath)) {
    await downloadAndExtract(EXTENSION_DOWNLOAD_URL, metamaskDirectory)
  }

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
      const stream = fs.createReadStream(archivePath).pipe(unzipper.Parse())
      stream.on(
        'entry',
        async (entry: { path: string; type: string; pipe: (arg: unknown) => void; autodrain: () => void }) => {
          const fileName = entry.path
          const type = entry.type as 'Directory' | 'File'

          if (type === 'Directory') {
            await fs.mkdir(path.join(outputPath, fileName), { recursive: true })
            entry.autodrain()
            return
          }

          if (type === 'File') {
            const writeStream = fs.createWriteStream(path.join(outputPath, fileName))
            entry.pipe(writeStream)

            await new Promise<void>((res, rej) => {
              writeStream.on('finish', res)
              writeStream.on('error', rej)
            })
          }
        }
      )
      stream.on('finish', resolve)
      stream.on('error', reject)
    })
  } catch (error: unknown) {
    console.error(`[unzipArchive] Error unzipping archive: ${(error as { message: string }).message}`)
    throw error
  }
}

export async function cachelessSetupMetaMask(metamaskVersion?: string): Promise<BrowserContext> {
  const metamaskPath = await prepareMetaMask(metamaskVersion || DEFAULT_METAMASK_VERSION)
  const browserArgs = [`--load-extension=${metamaskPath}`, `--disable-extensions-except=${metamaskPath}`]

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: browserArgs
  })
  return context
}
