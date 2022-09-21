const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const download = require('download');
const packageJson = require('./package.json');

let networkName = 'mainnet';
let networkId = 1;
let isTestnet = false;

module.exports = {
  setNetwork: network => {
    if (network === 'mainnet') {
      networkName = 'mainnet';
      networkId = 1;
      isTestnet = false;
    } else if (network === 'ropsten') {
      networkName = 'ropsten';
      networkId = 3;
      isTestnet = true;
    } else if (network === 'kovan') {
      networkName = 'kovan';
      networkId = 42;
      isTestnet = true;
    } else if (network === 'rinkeby') {
      networkName = 'rinkeby';
      networkId = 4;
      isTestnet = true;
    } else if (network === 'goerli') {
      networkName = 'goerli';
      networkId = 5;
      isTestnet = true;
    } else if (typeof network === 'object') {
      networkName = network.networkName;
      networkId = Number(network.chainId);
      isTestnet = network.isTestnet;
    }
    // todo: handle a case when setNetwork() is triggered by changeNetwork() with a string of already added custom networks
  },
  getNetwork: () => {
    return { networkName, networkId, isTestnet };
  },
  getSynpressPath: () => {
    if (process.env.SYNPRESS_LOCAL_TEST) {
      return '.';
    } else {
      return path.dirname(require.resolve(packageJson.name));
    }
  },
  checkDirExist: async path => {
    try {
      await fs.access(path);
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fs.mkdir(path);
      } else {
        throw new Error(
          `[prepareMetamask] Unhandled error from fs.access() with following error:\n${e}`,
        );
      }
    }
  },
  getMetamaskReleases: async version => {
    let filename;
    let downloadUrl;
    let tagName;

    try {
      const response = await axios.get(
        'https://api.github.com/repos/metamask/metamask-extension/releases',
      );
      if (version === 'latest' || !version) {
        filename = response.data[0].assets[0].name;
        downloadUrl = response.data[0].assets[0].browser_download_url;
        tagName = response.data[0].tag_name;
      } else if (version) {
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
      throw new Error(
        `[getMetamaskReleases] Unable to fetch metamask releases from: ${downloadUrl} with following error:\n${e}`,
      );
    }
  },
  download: async (url, destination) => {
    try {
      // todo: check if zip file exists, if yes then remove it before
      // todo: if directory exists, dont overwrite
      await download(url, destination, { extract: true });
    } catch (e) {
      throw new Error(
        `[download] Unable to download metamask release from: ${url} to: ${destination} with following error:\n${e}`,
      );
    }
  },
  prepareMetamask: async version => {
    const release = await module.exports.getMetamaskReleases(version);
    const downloadsDirectory = path.resolve(__dirname, 'downloads');
    await module.exports.dirExists(downloadsDirectory);
    const metamaskDirectory = path.join(downloadsDirectory, release.tagName);
    await module.exports.download(release.downloadUrl, metamaskDirectory);
    return metamaskDirectory;
  },
};
