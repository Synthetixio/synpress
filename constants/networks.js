const networks = require('../fixtures/networks.json');
const networkNames = {
  mainnet: 'mainnet',
  goerli: 'goerli',
  sepolia: 'sepolia',
  localhost: 'localhost',
  optimism: networks.optimism.networkName.toLowerCase(),
  optimismGoerli: networks['optimism-goerli'].networkName.toLowerCase(),
};

module.exports = { networkNames };
