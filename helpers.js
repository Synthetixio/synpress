const log = require('debug')('synpress:helpers');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { ethers } = require('ethers');
const download = require('download');
const packageJson = require('./package.json');

const PRESET_NETWORKS = Object.freeze({
  mainnet: {
    networkName: 'mainnet',
    networkId: 1,
    isTestnet: false,
  },
  goerli: {
    networkName: 'goerli',
    networkId: 5,
    isTestnet: true,
  },
  sepolia: {
    networkName: 'sepolia',
    networkId: 11155111,
    isTestnet: true,
  },
});

let selectedNetwork = PRESET_NETWORKS.mainnet;

module.exports = {
  async setNetwork(network) {
    log(`Setting network to ${JSON.stringify(network)}`);

    if (Object.keys(PRESET_NETWORKS).includes(network)) {
      selectedNetwork = PRESET_NETWORKS[network];
    }

    if (network === 'localhost') {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const { chainId, name } = await provider.getNetwork();
      selectedNetwork = {
        networkName: name,
        networkId: chainId,
        isTestnet: true,
      };
    } else if (typeof network === 'object') {
      selectedNetwork = {
        networkName: network.networkName,
        networkId: Number(network.chainId),
        isTestnet: network.isTestnet,
      };
    }
    // todo: handle a case when setNetwork() is triggered by changeNetwork() with a string of already added custom networks
  },
  getNetwork: () => {
    log(`Current network data: ${selectedNetwork}`);
    return selectedNetwork;
  },
  getSynpressPath() {
    if (process.env.SYNPRESS_LOCAL_TEST) {
      return '.';
    } else {
      return path.dirname(require.resolve(packageJson.name));
    }
  },
  async createDirIfNotExist(path) {
    try {
      log(`Checking if directory exists on path: ${path}`);
      await fs.access(path);
      return true;
    } catch (e) {
      if (e.code === 'ENOENT') {
        log(`Creating directory as it doesn't exist..`);
        await fs.mkdir(path);
        return true;
      }

      throw new Error(
        `[createDirIfNotExist] Unhandled error from fs.access() with following error:\n${e}`,
      );
    }
  },
  async checkDirOrFileExist(path) {
    try {
      log(`Checking if directory exists on path: ${path}`);
      await fs.access(path);
      return true;
    } catch (e) {
      if (e.code === 'ENOENT') {
        log(`Directory or file doesn't exist`);
        return false;
      }

      throw new Error(
        `[checkDirOrFileExist] Unhandled error from fs.access() with following error:\n${e}`,
      );
    }
  },
  async getMetamaskReleases(version) {
    log(`Trying to find metamask version ${version} in GitHub releases..`);
    let filename;
    let downloadUrl;
    let tagName;
    let response;

    try {
      if (version === 'latest' || !version) {
        if (process.env.GH_USERNAME && process.env.GH_PAT) {
          response = await axios.get(
            'https://api.github.com/repos/metamask/metamask-extension/releases',
            {
              auth: {
                username: process.env.GH_USERNAME,
                password: process.env.GH_PAT,
              },
            },
          );
        } else {
          response = await axios.get(
            'https://api.github.com/repos/metamask/metamask-extension/releases',
          );
        }
        filename = response.data[0].assets[0].name;
        downloadUrl = response.data[0].assets[0].browser_download_url;
        tagName = response.data[0].tag_name;
        log(
          `Metamask version found! Filename: ${filename}; Download url: ${downloadUrl}; Tag name: ${tagName}`,
        );
      } else if (version) {
        filename = `metamask-chrome-${version}.zip`;
        downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`;
        tagName = `metamask-chrome-${version}`;
        log(
          `Metamask version found! Filename: ${filename}; Download url: ${downloadUrl}; Tag name: ${tagName}`,
        );
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
  },
  async download(url, destination) {
    try {
      log(
        `Trying to download and extract file from: ${url} to following path: ${destination}`,
      );
      if (process.env.GH_USERNAME && process.env.GH_PAT) {
        await download(url, destination, {
          extract: true,
          auth: `${process.env.GH_USERNAME}:${process.env.GH_PAT}`,
        });
      } else {
        await download(url, destination, {
          extract: true,
        });
      }
    } catch (e) {
      throw new Error(
        `[download] Unable to download metamask release from: ${url} to: ${destination} with following error:\n${e}`,
      );
    }
  },
  async prepareMetamask(version) {
    const release = await module.exports.getMetamaskReleases(version);
    const downloadsDirectory = path.resolve(__dirname, 'downloads');
    await module.exports.createDirIfNotExist(downloadsDirectory);
    const metamaskDirectory = path.join(downloadsDirectory, release.tagName);
    const metamaskDirectoryExists = await module.exports.checkDirOrFileExist(
      metamaskDirectory,
    );
    const metamaskManifestFilePath = path.join(
      downloadsDirectory,
      release.tagName,
      'manifest.json',
    );
    const metamaskManifestFileExists = await module.exports.checkDirOrFileExist(
      metamaskManifestFilePath,
    );
    if (!metamaskDirectoryExists && !metamaskManifestFileExists) {
      await module.exports.download(release.downloadUrl, metamaskDirectory);
    } else {
      log('Metamask is already downloaded');
    }
    return metamaskDirectory;
  },
};
