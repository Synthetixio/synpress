const log = require('debug')('synpress:helpers');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { ethers } = require('ethers');
const download = require('download');
const packageJson = require('./package.json');
const chains = require('viem/chains');
const appRoot = require('app-root-path');
const os = require('os');

let currentNetwork = chains.mainnet;
// list of added networks to metamask
let addedNetworks = [chains.mainnet, chains.goerli, chains.sepolia];

module.exports = {
  // set currently active network
  async setNetwork(network) {
    log(`Setting network to ${JSON.stringify(network)}`);
    currentNetwork = network;
  },
  // find network in presets
  async findNetwork(network) {
    if (typeof network === 'object') {
      network = network.name || network.network;
    }

    network = network.toLowerCase();
    log(
      `[findNetwork] Trying to find following network: ${JSON.stringify(
        network,
      )}`,
    );

    let chain;
    for (const [key, value] of Object.entries(chains)) {
      const { name, network: chainNetwork } = value;
      const lcName = name ? name.toLowerCase() : undefined;
      const lcChainNetwork = chainNetwork
        ? chainNetwork.toLowerCase()
        : undefined;
      if (lcName === network || lcChainNetwork === network) {
        chain = chains[key];
        break;
      } else if (key.toLowerCase() === network) {
        chain = chains[key];
        break;
      }
    }

    if (!chain) {
      throw new Error(
        `[setNetwork] Provided chain was not found.\nFor list of available chains, check: https://github.com/wagmi-dev/references/tree/main/packages/chains#chains`,
      );
    }

    if (
      chain.network === 'localhost' ||
      chain.network === 'foundry' ||
      chain.network === 'hardhat'
    ) {
      // todo: ip+port rpcUrls
      const provider = new ethers.JsonRpcProvider(
        chain.rpcUrls.default.http[0],
      );
      await provider.getNetwork().then(result => {
        chain.id = Number(result.chainId);
        chain.forkedFrom = result.name;
      });
    }

    return chain;
  },
  // get currently active network
  getCurrentNetwork() {
    log(
      `[getCurrentNetwork] Current network data: ${JSON.stringify(
        currentNetwork,
      )}`,
    );
    return currentNetwork;
  },
  // add new network to presets and list of metamask networks
  async addNetwork(newNetwork) {
    if (!newNetwork.network) {
      newNetwork.network = newNetwork.name.toLowerCase().replace(' ', '-');
    }

    log(`[addNetwork] Adding new network: ${newNetwork}`);
    chains[newNetwork.network] = newNetwork;
    addedNetworks.push(newNetwork);
  },
  // check if network is already added to metamask
  async checkNetworkAdded(network) {
    log(
      `[checkNetworkAdded] Checking if network is already added: ${JSON.stringify(
        network,
      )}`,
    );
    if (addedNetworks.includes(network)) {
      log(`[checkNetworkAdded] Network is present`);
      return true;
    } else {
      log(`[checkNetworkAdded] Network doesn't exist`);
      return false;
    }
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

    let downloadsDirectory;
    if (os.platform() === 'win32') {
      downloadsDirectory = appRoot.resolve('/node_modules');
    } else {
      downloadsDirectory = path.resolve(__dirname, 'downloads');
    }

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
