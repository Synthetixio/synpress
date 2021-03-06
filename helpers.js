const axios = require('axios');
const fs = require('fs');
const unzip = require('unzipper');
const path = require('path');

let networkName = 'mainnet';
let networkId = 1;
let isTestnet = false;

module.exports = {
  setNetwork: network => {
    if (network === 'main' || network === 'mainnet' || network === 1) {
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
    }
  },
  getNetwork: () => {
    return { networkName, networkId, isTestnet };
  },
  getSynpressPath: () => {
    return 'node_modules/@synthetixio/synpress';
  },
  getMetamaskReleases: async version => {
    let filename;
    let downloadUrl;

    const response = await axios.get(
      'https://api.github.com/repos/metamask/metamask-extension/releases',
    );

    if (version) {
      filename = `metamask-chrome-${version}.zip`;
      downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`;
    } else {
      filename = response.data[0].assets[0].name;
      downloadUrl = response.data[0].assets[0].browser_download_url;
    }

    return {
      filename,
      downloadUrl,
    };
  },
  download: async (url, destination) => {
    const writer = fs.createWriteStream(destination);
    const result = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    await new Promise(resolve =>
      result.data.pipe(writer).on('finish', resolve),
    );
  },
  extract: async (file, destination) => {
    const stream = fs.createReadStream(file);
    await new Promise(resolve =>
      stream.pipe(unzip.Extract({ path: destination }).on('close', resolve)),
    );
  },
  prepareMetamask: async version => {
    const release = await module.exports.getMetamaskReleases(version);
    const downloadsDirectory = path.resolve(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDirectory)) {
      fs.mkdirSync(downloadsDirectory);
    }
    const downloadDestination = path.join(downloadsDirectory, release.filename);
    await module.exports.download(release.downloadUrl, downloadDestination);
    const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
    await module.exports.extract(downloadDestination, metamaskDirectory);
    return metamaskDirectory;
  },
};
