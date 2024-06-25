import { chromium, type BrowserContext, type Page } from '@playwright/test';
import { MetaMask } from '../MetaMask';
import { unlockForFixture } from '../fixture-actions/unlockForFixture';
import fs from 'fs-extra';
import path from 'node:path';
import axios from 'axios';
import unzipper from 'unzipper';
import { getExtensionId } from '../fixture-actions';

// Define constants for MetaMask
const DEFAULT_METAMASK_VERSION = '11.9.1';
const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`;

// Function to prepare MetaMask extension (download and unzip)
async function prepareMetaMask(version: string = DEFAULT_METAMASK_VERSION): Promise<string> {
  const downloadsDirectory = path.join(process.cwd(), 'downloads');
  await fs.ensureDir(downloadsDirectory); // Create the directory if it doesn't exist

  const metamaskDirectory = path.join(downloadsDirectory, `metamask-chrome-${version}`);
  const metamaskManifestPath = path.join(metamaskDirectory, 'manifest.json');

  // Download and unzip only if not already present
  if (!fs.existsSync(metamaskManifestPath)) {
    await downloadAndExtract(EXTENSION_DOWNLOAD_URL, metamaskDirectory);
  }

  return metamaskDirectory;
}

// Function to download and unzip the MetaMask extension
async function downloadAndExtract(url: string, destination: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(destination);
  response.data.pipe(writer);
  await new Promise((resolve) => writer.on('finish', resolve));

  await unzipArchive(destination);
}

// Function to unzip the archive
async function unzipArchive(archivePath: string): Promise<void> {
  const archiveFileExtension = archivePath.split('.').slice(-1);
  const outputPath = archivePath.replace(`.${archiveFileExtension}`, '');

  await fs.ensureDir(outputPath); 

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(archivePath)
        .pipe(unzipper.Parse())
        .on('entry', (entry: any) => {
          const fileName = entry.path;
          const type = entry.type as 'Directory' | 'File';

          if (type === 'Directory') {
            fs.mkdirSync(path.join(outputPath, fileName), { recursive: true });
            return;
          }

          if (type === 'File') {
            entry.pipe(fs.createWriteStream(path.join(outputPath, fileName)));
          }
        })
        .on('finish', () => resolve())
        .on('error', (error: Error) => reject(error)); 
    });
  } catch (error) {
    // Handle errors here
    console.error(`[unzipArchive] Error unzipping archive: ${error.message}`);
    // You might want to implement retries or other error handling logic 
    throw error; // Re-throw the error to stop execution
  }
}
// The main function to set up MetaMask without caching
export async function cachelessSetupMetaMask(
  seedPhrase: string,
  password: string,
  metamaskVersion?: string
): Promise<BrowserContext> {
  const metamaskPath = await prepareMetaMask(metamaskVersion || DEFAULT_METAMASK_VERSION);
  const browser = await chromium.launch({ args: [`--load-extension=${metamaskPath}`] });
  const context = await browser.newContext();
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  // const extensionId = await getExtensionId(context, 'MetaMask');

  // console.log(`[MetaMask] Extension ID: ${extensionId}`);
  // const metamaskPage = await context.newPage();
  // await metamaskPage.goto(`chrome-extension://${extensionId}/home.html`, { waitUntil: 'networkidle' });
  const metamaskPage = context.pages()[0] as Page
  await metamaskPage.goto('chrome://extensions')

  const metamask = new MetaMask(context, metamaskPage, password);
  await metamask.importWallet(seedPhrase);
  await unlockForFixture(metamaskPage, password);

  return context;
}