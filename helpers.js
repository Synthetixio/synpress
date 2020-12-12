const axios = require('axios');
const fs = require('fs');
const unzip = require('unzipper');
const path = require('path');

let networkName;
let networkId;

module.exports = {
  setNetwork: network => {
    if (network === 'main' || network === 'mainnet' || network === 1) {
      networkName = 'mainnet';
      networkId = 1;
    } else if (network === 'ropsten') {
      networkName = 'ropsten';
      networkId = 3;
    } else if (network === 'kovan') {
      networkName = 'kovan';
      networkId = 42;
    } else if (network === 'rinkeby') {
      networkName = 'rinkeby';
      networkId = 4;
    } else if (network === 'goerli') {
      networkName = 'goerli';
      networkId = 5;
    }
  },
  getNetwork: () => {
    return { networkName, networkId };
  },
  getSynpressPath: () => {
    return 'node_modules/@synthetixio/synpress';
  },
  getMetamaskReleases: async () => {
    const response = await axios.get(
      'https://api.github.com/repos/metamask/metamask-extension/releases',
    );
    const filename = response.data[0].assets[0].name;
    const downloadUrl = response.data[0].assets[0].browser_download_url;
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
  prepareMetamask: async () => {
    const release = await module.exports.getMetamaskReleases();
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
