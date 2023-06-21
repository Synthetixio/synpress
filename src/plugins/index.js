const helpers = require('../helpers');
const playwright = require('../commands/playwright');
const metamask = require('../commands/metamask');
const etherscan = require('../commands/etherscan');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome') {
      // metamask welcome screen blocks cypress from loading
      arguments_.args.push(
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      );
      if (process.env.CI) {
        // Avoid: "dri3 extension not supported" error
        arguments_.args.push('--disable-gpu');
      }
      if (process.env.HEADLESS_MODE) {
        arguments_.args.push('--headless=new');
      }
      if (browser.isHeadless) {
        arguments_.args.push('--window-size=1920,1080');
      }
    }

    if (!process.env.SKIP_METAMASK_INSTALL) {
      // NOTE: extensions cannot be loaded in headless Chrome
      const metamaskPath = await helpers.prepareMetamask(
        process.env.METAMASK_VERSION || '10.25.0',
      );
      arguments_.extensions.push(metamaskPath);
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
    // playwright commands
    initPlaywright: async () => {
      const connected = await playwright.init();
      return connected;
    },
    clearPlaywright: async () => {
      const cleared = await playwright.clear();
      return cleared;
    },
    assignWindows: async () => {
      const assigned = await playwright.assignWindows();
      return assigned;
    },
    clearWindows: async () => {
      const cleared = await playwright.clearWindows();
      return cleared;
    },
    assignActiveTabName: async tabName => {
      const assigned = await playwright.assignActiveTabName(tabName);
      return assigned;
    },
    isMetamaskWindowActive: async () => {
      const isMetamaskActive = await playwright.isMetamaskWindowActive();
      return isMetamaskActive;
    },
    isCypressWindowActive: async () => {
      const isCypressActive = await playwright.isCypressWindowActive();
      return isCypressActive;
    },
    switchToCypressWindow: async () => {
      const switched = await playwright.switchToCypressWindow();
      return switched;
    },
    switchToMetamaskWindow: async () => {
      const switched = await playwright.switchToMetamaskWindow();
      return switched;
    },
    switchToMetamaskNotification: async () => {
      const notificationPage = await playwright.switchToMetamaskNotification();
      return notificationPage;
    },
    unlockMetamask: async password => {
      const unlocked = await metamask.unlock(password);
      return unlocked;
    },
    importMetamaskAccount: async privateKey => {
      const imported = await metamask.importAccount(privateKey);
      return imported;
    },
    createMetamaskAccount: async accountName => {
      const created = await metamask.createAccount(accountName);
      return created;
    },
    switchMetamaskAccount: async accountNameOrAccountNumber => {
      const switched = await metamask.switchAccount(accountNameOrAccountNumber);
      return switched;
    },
    addMetamaskNetwork: async network => {
      const networkAdded = await metamask.addNetwork(network);
      return networkAdded;
    },
    changeMetamaskNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME;
      } else if (!network) {
        network = 'goerli';
      }
      const networkChanged = await metamask.changeNetwork(network);
      return networkChanged;
    },
    activateAdvancedGasControlInMetamask: async skipSetup => {
      const activated = await metamask.activateAdvancedGasControl(skipSetup);
      return activated;
    },
    activateShowHexDataInMetamask: async skipSetup => {
      const activated = await metamask.activateShowHexData(skipSetup);
      return activated;
    },
    activateTestnetConversionInMetamask: async skipSetup => {
      const activated = await metamask.activateTestnetConversion(skipSetup);
      return activated;
    },
    activateShowTestnetNetworksInMetamask: async skipSetup => {
      const activated = await metamask.activateShowTestnetNetworks(skipSetup);
      return activated;
    },
    activateCustomNonceInMetamask: async skipSetup => {
      const activated = await metamask.activateCustomNonce(skipSetup);
      return activated;
    },
    activateDismissBackupReminderInMetamask: async skipSetup => {
      const activated = await metamask.activateDismissBackupReminder(skipSetup);
      return activated;
    },
    activateEthSignRequestsInMetamask: async skipSetup => {
      const activated = await metamask.activateEthSignRequests(skipSetup);
      return activated;
    },
    activateImprovedTokenAllowanceInMetamask: async skipSetup => {
      const activated = await metamask.activateImprovedTokenAllowance(
        skipSetup,
      );
      return activated;
    },
    resetMetamaskAccount: async () => {
      const resetted = await metamask.resetAccount();
      return resetted;
    },
    disconnectMetamaskWalletFromDapp: async () => {
      const disconnected = await metamask.disconnectWalletFromDapp();
      return disconnected;
    },
    disconnectMetamaskWalletFromAllDapps: async () => {
      const disconnected = await metamask.disconnectWalletFromAllDapps();
      return disconnected;
    },
    confirmMetamaskSignatureRequest: async () => {
      const confirmed = await metamask.confirmSignatureRequest();
      return confirmed;
    },
    confirmMetamaskDataSignatureRequest: async () => {
      const confirmed = await metamask.confirmDataSignatureRequest();
      return confirmed;
    },
    rejectMetamaskSignatureRequest: async () => {
      const rejected = await metamask.rejectSignatureRequest();
      return rejected;
    },
    rejectMetamaskDataSignatureRequest: async () => {
      const rejected = await metamask.rejectDataSignatureRequest();
      return rejected;
    },
    confirmMetamaskEncryptionPublicKeyRequest: async () => {
      const confirmed = await metamask.confirmEncryptionPublicKeyRequest();
      return confirmed;
    },
    rejectMetamaskEncryptionPublicKeyRequest: async () => {
      const rejected = await metamask.rejectEncryptionPublicKeyRequest();
      return rejected;
    },
    confirmMetamaskDecryptionRequest: async () => {
      const confirmed = await metamask.confirmDecryptionRequest();
      return confirmed;
    },
    rejectMetamaskDecryptionRequest: async () => {
      const rejected = await metamask.rejectDecryptionRequest();
      return rejected;
    },
    importMetamaskToken: async tokenConfig => {
      const imported = await metamask.importToken(tokenConfig);
      return imported;
    },
    confirmMetamaskAddToken: async () => {
      const confirmed = await metamask.confirmAddToken();
      return confirmed;
    },
    rejectMetamaskAddToken: async () => {
      const rejected = await metamask.rejectAddToken();
      return rejected;
    },
    confirmMetamaskPermissionToSpend: async spendLimit => {
      const confirmed = await metamask.confirmPermissionToSpend(spendLimit);
      return confirmed;
    },
    rejectMetamaskPermissionToSpend: async () => {
      const rejected = await metamask.rejectPermissionToSpend();
      return rejected;
    },
    confirmMetamaskPermisionToApproveAll: metamask.confirmPermisionToApproveAll,
    rejectMetamaskPermisionToApproveAll: metamask.rejectPermisionToApproveAll,
    acceptMetamaskAccess: async options => {
      const accepted = await metamask.acceptAccess(options);
      return accepted;
    },
    rejectMetamaskAccess: metamask.rejectAccess,
    confirmMetamaskTransaction: async gasConfig => {
      const confirmed = await metamask.confirmTransaction(gasConfig);
      return confirmed;
    },
    rejectMetamaskTransaction: async () => {
      const rejected = await metamask.rejectTransaction();
      return rejected;
    },
    allowMetamaskToAddNetwork: async ({ waitForEvent }) => {
      const allowed = await metamask.allowToAddNetwork({ waitForEvent });
      return allowed;
    },
    rejectMetamaskToAddNetwork: async () => {
      const rejected = await metamask.rejectToAddNetwork();
      return rejected;
    },
    allowMetamaskToSwitchNetwork: async () => {
      const allowed = await metamask.allowToSwitchNetwork();
      return allowed;
    },
    rejectMetamaskToSwitchNetwork: async () => {
      const rejected = await metamask.rejectToSwitchNetwork();
      return rejected;
    },
    allowMetamaskToAddAndSwitchNetwork: async () => {
      const allowed = await metamask.allowToAddAndSwitchNetwork();
      return allowed;
    },
    getMetamaskWalletAddress: async () => {
      const walletAddress = await metamask.getWalletAddress();
      return walletAddress;
    },
    fetchMetamaskWalletAddress: async () => {
      return metamask.walletAddress();
    },
    setupMetamask: async ({
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    }) => {
      if (process.env.NETWORK_NAME) {
        network = process.env.NETWORK_NAME;
      }
      if (
        process.env.NETWORK_NAME &&
        process.env.RPC_URL &&
        process.env.CHAIN_ID &&
        process.env.SYMBOL
      ) {
        network = {
          id: process.env.CHAIN_ID,
          name: process.env.NETWORK_NAME,
          nativeCurrency: {
            symbol: process.env.SYMBOL,
          },
          rpcUrls: {
            public: { http: [process.env.RPC_URL] },
            default: { http: [process.env.RPC_URL] },
          },
          blockExplorers: {
            etherscan: { url: process.env.BLOCK_EXPLORER },
            default: { url: process.env.BLOCK_EXPLORER },
          },
          testnet: process.env.IS_TESTNET,
        };
      }
      if (process.env.PRIVATE_KEY) {
        secretWordsOrPrivateKey = process.env.PRIVATE_KEY;
      }
      if (process.env.SECRET_WORDS) {
        secretWordsOrPrivateKey = process.env.SECRET_WORDS;
      }
      await metamask.initialSetup(null, {
        secretWordsOrPrivateKey,
        network,
        password,
        enableAdvancedSettings,
        enableExperimentalSettings,
      });
      return true;
    },
    getCurrentNetwork: () => {
      const network = helpers.getCurrentNetwork();
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
    config.e2e.baseUrl = process.env.BASE_URL;
    config.component.baseUrl = process.env.BASE_URL;
  }

  if (process.env.CI) {
    config.retries.runMode = 1;
    config.retries.openMode = 1;
  }

  if (process.env.SKIP_METAMASK_SETUP) {
    config.env.SKIP_METAMASK_SETUP = true;
  }

  return config;
};
