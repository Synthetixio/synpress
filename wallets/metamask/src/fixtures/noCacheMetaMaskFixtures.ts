import { chromium, type BrowserContext } from '@playwright/test';
import { MetaMask } from '../MetaMask';
import { unlockForFixture } from '../fixture-actions/unlockForFixture';
import fs from 'fs-extra';
import path from 'node:path';
import axios from 'axios';
import unzipper from 'unzipper';

const DEFAULT_METAMASK_VERSION = '11.9.1';
const EXTENSION_DOWNLOAD_URL = `https://github.com/MetaMask/metamask-extension/releases/download/v${DEFAULT_METAMASK_VERSION}/metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`;

async function getMetamaskExtensionPath(version: string): Promise<string> {
  const downloadsDirectory = path.join(process.cwd(), 'downloads');
  await createDirIfNotExist(downloadsDirectory);
  const metamaskDirectory = path.join(downloadsDirectory, `metamask-chrome-${version}`);
  const metamaskDirectoryExists = await checkDirOrFileExist(metamaskDirectory);
  const metamaskManifestFilePath = path.join(metamaskDirectory, 'manifest.json');
  const metamaskManifestFileExists = await checkDirOrFileExist(metamaskManifestFilePath);

  if (!metamaskDirectoryExists && !metamaskManifestFileExists) {
    const release = await getMetamaskReleases(version);
    await download(release.downloadUrl, metamaskDirectory);
  }

  return metamaskDirectory;
}

async function getExtensionId(context: BrowserContext, extensionName: string): Promise<string> {
  const page = await context.newPage();
  await page.goto('chrome://extensions');
  const extensions = await page.evaluate(() => chrome.management.getAll());
  const targetExtension = extensions.find(
    (extension: { name: string }) => extension.name.toLowerCase() === extensionName.toLowerCase()
  );

  if (!targetExtension) {
    throw new Error(`[GetExtensionId] Extension with name ${extensionName} not found.`);
  }

  await page.close();
  return targetExtension.id;
}

async function createDirIfNotExist(path: string): Promise<void> {
  try {
    await fs.access(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await fs.mkdir(path);
    } else {
      throw new Error(
        `[createDirIfNotExist] Unhandled error from fs.access() with following error:\n${e}`,
      );
    }
  }
}

async function checkDirOrFileExist(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch (e: Error) {
    if (e.code === 'ENOENT') {
      return false;
    }

    throw new Error(
      `[checkDirOrFileExist] Unhandled error from fs.access() with following error:\n${e}`,
    );
  }
}

async function getMetamaskReleases(version: string): Promise<{ filename: string; downloadUrl: string; tagName: string }> {
  let filename;
  let downloadUrl;
  let tagName;
  let response;

  try {
    if (version === 'latest' || !version) {
      if (process.env.GH_USERNAME && process.env.GH_PAT) {
        response = await axios.get('https://api.github.com/repos/metamask/metamask-extension/releases', {
          auth: {
            username: process.env.GH_USERNAME,
            password: process.env.GH_PAT,
          },
        });
      } else {
        response = await axios.get('https://api.github.com/repos/metamask/metamask-extension/releases');
      }
      filename = response.data[0].assets[0].name;
      downloadUrl = response.data[0].assets[0].browser_download_url;
      tagName = response.data[0].tag_name;
    } else {
      filename = `metamask-chrome-${version}.zip`;
      downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`;
      tagName = `metamask-chrome-${version}`;
    }
    return {
      filename,
      downloadUrl,
      tagName,
    };
  } catch (e) {
    if (e.response && e.response.status === 403) {
      throw new Error(
        `[getMetamaskReleases] Unable to fetch metamask releases from GitHub because you've been rate limited! Please set GH_USERNAME and GH_PAT environment variables to avoid this issue or retry again.`,
      );
    }

    throw new Error(
      `[getMetamaskReleases] Unable to fetch metamask releases from GitHub with following error:\n${e}`,
    );
  }
}

async function download(url: string, destination: string, options?: { extract?: boolean; auth?: string }): Promise<void> {
  try {
    if (options?.extract) {
      if (options.auth) {
        await downloadAndExtract(url, destination, options.auth);
      } else {
        await downloadAndExtract(url, destination);
      }
    } else {
      // Download without extraction
      const response = await axios.get(url, { responseType: 'stream' });
      const writer = fs.createWriteStream(destination);
      response.data.pipe(writer);
      await new Promise((resolve) => writer.on('finish', resolve));
    }
  } catch (e) {
    throw new Error(
      `[download] Unable to download metamask release from: ${url} to: ${destination} with following error:\n${e}`,
    );
  }
}

async function downloadAndExtract(url: string, destination: string, auth?: string): Promise<void> {
  const response = await axios.get(url, { responseType: 'stream', auth });
  const writer = fs.createWriteStream(destination);
  response.data.pipe(writer);
  await new Promise((resolve) => writer.on('finish', resolve));

  // Unzip the downloaded archive
  await unzipArchive({
    archivePath: destination,
  });
}

async function unzipArchive(options: { archivePath: string; overwrite?: boolean }): Promise<{ outputPath: string; unzipSkipped: boolean }> {
  const { archivePath, overwrite } = options;
  const archiveFileExtension = archivePath.split('.').slice(-1);
  const outputPath = archivePath.replace(`.${archiveFileExtension}`, '');

  const fileExists = fs.existsSync(outputPath);
  if (fileExists && !overwrite) {
    return {
      outputPath,
      unzipSkipped: true,
    };
  }

  // Creates the output directory
  fs.mkdirSync(outputPath, { recursive: true });

  await new Promise((resolve, reject) => {
    fs.createReadStream(archivePath)
      .pipe(unzipper.Parse())
      .on('entry', function (entry: any) {
        const fileName = entry.path;
        const type = entry.type as 'Directory' | 'File';

        if (type === 'Directory') {
          fs.mkdirSync(path.join(outputPath, fileName), { recursive: true });
          return;
        }

        if (type === 'File') {
          // Ensure manifest.json is directly at the root of outputPath
          if (fileName === 'manifest.json') {
            entry.pipe(fs.createWriteStream(path.join(outputPath, fileName)));
          } else {
            const outputFilePath = path.join(outputPath, fileName);
            const outputFilePathDir = path.dirname(outputFilePath);

            // Handles the rare case when a file is in a directory which has no entry ¯\_(ツ)_/¯
            if (!fs.existsSync(outputFilePathDir)) {
              fs.mkdirSync(outputFilePathDir, { recursive: true });
            }

            entry.pipe(fs.createWriteStream(outputFilePath));
          }
        }
      })
      .promise()
      .then(() => {
        resolve({
          outputPath,
          unzipSkipped: false,
        });
      })
      .catch((error: Error) => {
        fs.unlinkSync(outputPath);
        reject(new Error(`[Pipe] ${error.message}`));
      });
  });

  return {
    outputPath,
    unzipSkipped: false,
  };
}

export async function cachelessSetupMetaMask(
  seedPhrase: string,
  password: string,
  metamaskVersion?: string
): Promise<MetaMask> {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Prepare MetaMask Extension
  const metamaskPath = await prepareExtension(
    metamaskVersion ? await getMetamaskExtensionPath(metamaskVersion) : undefined
  ); 

  // Load MetaMask Extension
  await context.addInitScript({
    content: `
      if (typeof window.chrome === 'undefined' || typeof window.chrome.webstore === 'undefined') {
        window.chrome = {
          webstore: {
            install: (id: string, successCallback: Function, errorCallback: Function) => {
              const error = new Error('Mocked webstore.install error');
              if (errorCallback) errorCallback(error);
            },
            update: (id: string, successCallback: Function, errorCallback: Function) => {
              const error = new Error('Mocked webstore.update error');
              if (errorCallback) errorCallback(error);
            },
            onInstalled: {
              addListener: (callback: Function) => {
                callback({ reason: 'install' });
              }
            },
            onUpdated: {
              addListener: (callback: Function) => {
                callback({ reason: 'update' });
              }
            }
          }
        };
      } 
      chrome.management.install({
        path: '${metamaskPath}',
        errorCallback: (error: Error) => {
          console.error('MetaMask extension installation error:', error);
        }
      });
    `,
    path: 'chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/home.html',
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const extensionId = await getExtensionId(context, 'MetaMask');
  const metamaskPage = await context.newPage();
  await metamaskPage.goto(`chrome-extension://${extensionId}/home.html`, { waitUntil: 'networkidle' });

  const metamask = new MetaMask(context, metamaskPage, password, extensionId);
  await metamask.importWallet(seedPhrase);
  await unlockForFixture(metamaskPage, password);

  return metamask;
}

export async function prepareExtension(outputDir?: string): Promise<string> {
  if (!outputDir) {
    outputDir = await fs.mkdtemp(path.join(process.cwd(), 'tmp_'));
  }

  const downloadResult = await downloadFile({
    url: EXTENSION_DOWNLOAD_URL,
    outputDir: outputDir,
    fileName: `metamask-chrome-${DEFAULT_METAMASK_VERSION}.zip`,
  });

  const unzipResult = await unzipArchive({
    archivePath: downloadResult.filePath,
  });

  if (!outputDir) {
    await fs.remove(outputDir);
  }

  return unzipResult.outputPath;
}

async function downloadFile(options: { url: string; outputDir: string; fileName: string; overrideFile?: boolean }): Promise<{ filePath: string; downloadSkipped: boolean }> {
  const { url, outputDir, fileName, overrideFile } = options;

  const filePath = path.join(outputDir, fileName);

  const fileExists = fs.existsSync(filePath);
  if (fileExists && !overrideFile) {
    return {
      filePath,
      downloadSkipped: true,
    };
  }

  console.log(`[DEBUG] Downloading file from ${url}`);

  const response = await axios.get(url, {
    responseType: 'stream',
    // onDownloadProgress: onDownloadProgress(url, fileName)
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  await new Promise((resolve) => writer.on('finish', resolve));

  return {
    filePath,
    downloadSkipped: false,
  };
}