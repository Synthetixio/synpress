const helpers = require('../helpers');
const puppeteer = require('../commands/puppeteer');
const metamask = require('../commands/metamask');
const synthetix = require('../commands/synthetix');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      console.log('TRUE'); // required by cypress ¯\_(ツ)_/¯
      arguments_.args.push('--window-size=1920,1080');
      return arguments_;
    }

    if (browser.name === 'electron') {
      arguments_['width'] = 1920;
      arguments_['height'] = 1080;
      arguments_['resizable'] = false;
      return arguments_;
    }

    // metamask welcome screen blocks cypress from loading
    if (browser.name === 'chrome') {
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      );
    }

    // NOTE: extensions cannot be loaded in headless Chrome
    const metamaskPath = await helpers.prepareMetamask(
      process.env.METAMASK_VERSION || '9.1.1',
    );
    arguments_.extensions.push(metamaskPath);
    return arguments_;
  });

  on('task', {
    error(message) {
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m');
    },
    warn(message) {
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m');
    },
    initPuppeteer: async () => {
      const connected = await puppeteer.init();
      return connected;
    },
    assignWindows: async () => {
      const assigned = await puppeteer.assignWindows();
      return assigned;
    },
    switchToCypressWindow: async () => {
      const switched = await puppeteer.switchToCypressWindow();
      return switched;
    },
    switchToMetamaskWindow: async () => {
      const switched = await puppeteer.switchToMetamaskWindow();
      return switched;
    },
    switchToMetamaskNotification: async () => {
      const notificationPage = await puppeteer.switchToMetamaskNotification();
      return notificationPage;
    },
    confirmMetamaskWelcomePage: async () => {
      const confirmed = await metamask.confirmWelcomePage();
      return confirmed;
    },
    unlockMetamask: async password => {
      const unlocked = await metamask.unlock(password);
      return unlocked;
    },
    importMetamaskWallet: async ({ secretWords, password }) => {
      const imported = await metamask.importWallet(secretWords, password);
      return imported;
    },
    changeMetamaskNetwork: async network => {
      const networkChanged = await metamask.changeNetwork(network);
      return networkChanged;
    },
    acceptMetamaskAccess: async () => {
      const accepted = await metamask.acceptAccess();
      return accepted;
    },
    confirmMetamaskTransaction: async () => {
      const confirmed = await metamask.confirmTransaction();
      return confirmed;
    },
    rejectMetamaskTransaction: async () => {
      const rejected = await metamask.rejectTransaction();
      return rejected;
    },
    getMetamaskWalletAddress: async () => {
      const walletAddress = await metamask.getWalletAddress();
      return walletAddress;
    },
    fetchMetamaskWalletAddress: async () => {
      return metamask.walletAddress();
    },
    setupMetamask: async ({ secretWords, network, password }) => {
      await metamask.initialSetup({ secretWords, network, password });
      return true;
    },
    snxExchangerSettle: async ({ asset, walletAddress, privateKey }) => {
      const settled = await synthetix.settle({
        asset,
        walletAddress,
        privateKey,
      });
      return settled;
    },
    snxCheckWaitingPeriod: async ({ asset, walletAddress }) => {
      const waitingPeriod = await synthetix.checkWaitingPeriod({
        asset,
        walletAddress,
      });
      return waitingPeriod;
    },
    getNetwork: () => {
      const network = helpers.getNetwork();
      return network;
    },
  });

  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL;
  }

  if (process.env.CI) {
    config.retries.runMode = 1;
    config.retries.openMode = 1;
  }

  return config;
};
