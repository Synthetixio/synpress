const axios = require('axios');
const fs = require('fs');
const unzip = require('unzipper');
const path = require('path');

module.exports = {
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
    const release = await this.getMetamaskReleases();
    const downloadsDirectory = path.resolve(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDirectory)) {
      fs.mkdirSync(downloadsDirectory);
    }
    const downloadDestination = path.join(downloadsDirectory, release.filename);
    await this.download(release.downloadUrl, downloadDestination);
    const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
    await this.extract(downloadDestination, metamaskDirectory);
    return metamaskDirectory;
  },
};
