const helpers = require('../helpers');
const puppeteer = require('../commands/puppeteer');
const blank = require('../commands/blank');
const synthetix = require('../commands/synthetix');
const etherscan = require('../commands/etherscan');

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

    // blank welcome screen blocks cypress from loading
    if (browser.name === 'chrome') {
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      );
    }
    if (!process.env.SKIP_METAMASK_INSTALL) {
      // NOTE: extensions cannot be loaded in headless Chrome
      const blankPath = await helpers.prepareBlank();
      arguments_.extensions.push(blankPath);
    }

    return arguments_;
  });

  on('task', {
    error(message) {
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m');
      return true;
    },
    warn(message) {
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m');
      return true;
    },
    // puppeteer commands
    initPuppeteer: async () => {
      const connected = await puppeteer.init();
      return connected;
    },
    clearPuppeteer: async () => {
      const cleared = await puppeteer.clear();
      return cleared;
    },
    assignWindows: async () => {
      const assigned = await puppeteer.assignWindows();
      return assigned;
    },
    clearWindows: async () => {
      const cleared = await puppeteer.clearWindows();
      return cleared;
    },
    assignActiveTabName: async tabName => {
      const assigned = await puppeteer.assignActiveTabName(tabName);
      return assigned;
    },
    isBlankWindowActive: async () => {
      const isBlankActive = await puppeteer.isBlankWindowActive();
      return isBlankActive;
    },
    isCypressWindowActive: async () => {
      const isCypressActive = await puppeteer.isCypressWindowActive();
      return isCypressActive;
    },
    switchToCypressWindow: async () => {
      const switched = await puppeteer.switchToCypressWindow();
      return switched;
    },
    switchToBlankWindow: async () => {
      const switched = await puppeteer.switchToBlankWindow();
      return switched;
    },
    switchToBlankNotification: async () => {
      const notificationPage = await puppeteer.switchToBlankNotification();
      return notificationPage;
    },
    unlockBlank: async password => {
      const unlocked = await blank.unlock(password);
      return unlocked;
    },
    importBlankAccount: async privateKey => {
      const imported = await blank.importAccount(privateKey);
      return imported;
    },
    createBlankAccount: async accountName => {
      const created = await blank.createAccount(accountName);
      return created;
    },
    switchBlankAccount: async accountNameOrAccountNumber => {
      const switched = await blank.switchAccount(accountNameOrAccountNumber);
      return switched;
    },
    addBlankNetwork: async network => {
      const networkAdded = await blank.addNetwork(network);
      return networkAdded;
    },
    changeBlankNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME;
      } else if (!network) {
        network = 'kovan';
      }
      const networkChanged = await blank.changeNetwork(network);
      return networkChanged;
    },
    activateCustomNonceInBlank: async () => {
      const activated = await blank.activateCustomNonce();
      return activated;
    },
    resetBlankAccount: async () => {
      const resetted = await blank.resetAccount();
      return resetted;
    },
    disconnectBlankWalletFromDapp: async () => {
      const disconnected = await blank.disconnectWalletFromDapp();
      return disconnected;
    },
    disconnectBlankWalletFromAllDapps: async () => {
      const disconnected = await blank.disconnectWalletFromAllDapps();
      return disconnected;
    },
    confirmBlankSignatureRequest: async () => {
      const confirmed = await blank.confirmSignatureRequest();
      return confirmed;
    },
    rejectBlankSignatureRequest: async () => {
      const rejected = await blank.rejectSignatureRequest();
      return rejected;
    },
    confirmBlankPermissionToSpend: async () => {
      const confirmed = await blank.confirmPermissionToSpend();
      return confirmed;
    },
    rejectBlankPermissionToSpend: async () => {
      const rejected = await blank.rejectPermissionToSpend();
      return rejected;
    },
    acceptBlankAccess: async () => {
      const accepted = await blank.acceptAccess();
      return accepted;
    },
    confirmBlankTransaction: async gasConfig => {
      const confirmed = await blank.confirmTransaction(gasConfig);
      return confirmed;
    },
    rejectBlankTransaction: async () => {
      const rejected = await blank.rejectTransaction();
      return rejected;
    },
    allowBlankToAddNetwork: async () => {
      const allowed = await blank.allowToAddNetwork();
      return allowed;
    },
    rejectBlankToAddNetwork: async () => {
      const rejected = await blank.rejectToAddNetwork();
      return rejected;
    },
    allowBlankToSwitchNetwork: async () => {
      const allowed = await blank.allowToSwitchNetwork();
      return allowed;
    },
    rejectBlankToSwitchNetwork: async () => {
      const rejected = await blank.rejectToSwitchNetwork();
      return rejected;
    },
    allowBlankToAddAndSwitchNetwork: async () => {
      const allowed = await blank.allowToAddAndSwitchNetwork();
      return allowed;
    },
    getBlankWalletAddress: async () => {
      const walletAddress = await blank.getWalletAddress();
      return walletAddress;
    },
    fetchBlankWalletAddress: async () => {
      return blank.walletAddress();
    },
    setupBlank: async ({
      secretWordsOrPrivateKey,
      network = 'kovan',
      password,
    }) => {
      if (process.env.NETWORK_NAME) {
        network = process.env.NETWORK_NAME;
      }
      if (process.env.PRIVATE_KEY) {
        secretWordsOrPrivateKey = process.env.PRIVATE_KEY;
      }
      if (process.env.SECRET_WORDS) {
        secretWordsOrPrivateKey = process.env.SECRET_WORDS;
      }
      await blank.initialSetup({
        secretWordsOrPrivateKey,
        network,
        password,
      });
      return true;
    },
    snxExchangerSettle: async ({ asset, walletAddress, privateKey }) => {
      if (process.env.PRIVATE_KEY) {
        privateKey = process.env.PRIVATE_KEY;
      }
      const settled = await synthetix.settle({
        asset,
        walletAddress,
        privateKey,
      });
      // todo: wait for confirmation?
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
    etherscanGetTransactionStatus: async ({ txid }) => {
      const txStatus = await etherscan.getTransactionStatus(txid);
      return txStatus;
    },
    etherscanWaitForTxSuccess: async ({ txid }) => {
      const txSuccess = await etherscan.waitForTxSuccess(txid);
      return txSuccess;
    },
  });

  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL;
  }

  if (process.env.CI) {
    config.retries.runMode = 1;
    config.retries.openMode = 1;
  }

  if (process.env.SKIP_METAMASK_SETUP) {
    config.env.SKIP_METAMASK_SETUP = true;
  }

  // next component testing
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/next')(on, config);
  }

  return config;
};
