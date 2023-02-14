const helpers = require('../helpers');
const playwright = require('../commands/playwright');
const provider =
  process.env.PROVIDER === 'phantom'
    ? require('../commands/phantom')
    : require('../commands/metamask');
const etherscan = require('../commands/etherscan');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome') {
      arguments_.args.push('--window-size=1920,1080'); // optional
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
      arguments_.preferences.default.profile = {
        content_settings: {
          exceptions: {
            clipboard: {
              '*': {
                expiration: '0',
                last_modified: '13248200230459161',
                model: 0,
                setting: 1,
              },
            },
          },
        },
      };
    }

    if (!process.env.SKIP_METAMASK_INSTALL) {
      // NOTE: extensions cannot be loaded in headless Chrome
      const providerPath = await helpers.prepareProvider(
        process.env.PROVIDER_VERSION || '10.25.0',
      );

      arguments_.extensions.push(providerPath);
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
    /**
     * @deprecated
     */
    unlockMetamask: async password => {
      return module.exports.unlock(password);
    },
    unlock: async password => {
      const unlocked = await provider.unlock(password);
      return unlocked;
    },
    lock: () => {
      return provider.lock();
    },
    confirmIncorrectNetworkStage: () => {
      return provider.confirmIncorrectNetworkStage();
    },
    importMetamaskAccount: async privateKey => {
      const imported = await provider.importAccount(privateKey);
      return imported;
    },
    createMetamaskAccount: async accountName => {
      const created = await provider.createAccount(accountName);
      return created;
    },
    switchMetamaskAccount: async accountNameOrAccountNumber => {
      const switched = await provider.switchAccount(accountNameOrAccountNumber);
      return switched;
    },
    addMetamaskNetwork: async network => {
      const networkAdded = await provider.addNetwork(network);
      return networkAdded;
    },
    changeMetamaskNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME;
      } else if (!network) {
        network = 'goerli';
      }
      const networkChanged = await provider.changeNetwork(network);
      return networkChanged;
    },
    activateAdvancedGasControlInMetamask: async skipSetup => {
      const activated = await provider.activateAdvancedGasControl(skipSetup);
      return activated;
    },
    activateEnhancedTokenDetectionInMetamask: async skipSetup => {
      const activated = await provider.activateEnhancedTokenDetection(
        skipSetup,
      );
      return activated;
    },
    activateShowHexDataInMetamask: async skipSetup => {
      const activated = await provider.activateShowHexData(skipSetup);
      return activated;
    },
    activateTestnetConversionInMetamask: async skipSetup => {
      const activated = await provider.activateTestnetConversion(skipSetup);
      return activated;
    },
    activateShowTestnetNetworksInMetamask: async skipSetup => {
      const activated = await provider.activateShowTestnetNetworks(skipSetup);
      return activated;
    },
    activateCustomNonceInMetamask: async skipSetup => {
      const activated = await provider.activateCustomNonce(skipSetup);
      return activated;
    },
    activateDismissBackupReminderInMetamask: async skipSetup => {
      const activated = await provider.activateDismissBackupReminder(skipSetup);
      return activated;
    },
    activateEnhancedGasFeeUIInMetamask: async skipSetup => {
      const activated = await provider.activateEnhancedGasFeeUI(skipSetup);
      return activated;
    },
    activateShowCustomNetworkListInMetamask: async skipSetup => {
      const activated = await provider.activateShowCustomNetworkList(skipSetup);
      return activated;
    },
    resetMetamaskAccount: async () => {
      const resetted = await provider.resetAccount();
      return resetted;
    },
    disconnectMetamaskWalletFromDapp: async () => {
      const disconnected = await provider.disconnectWalletFromDapp();
      return disconnected;
    },
    disconnectMetamaskWalletFromAllDapps: async () => {
      const disconnected = await provider.disconnectWalletFromAllDapps();
      return disconnected;
    },

    /**
     * @deprecated
     */
    confirmMetamaskSignatureRequest: async () => {
      return module.exports.confirmSignatureRequest();
    },
    confirmSignatureRequest: async () => {
      const confirmed = await provider.confirmSignatureRequest();
      return confirmed;
    },

    confirmMetamaskDataSignatureRequest: async () => {
      const confirmed = await provider.confirmDataSignatureRequest();
      return confirmed;
    },
    rejectMetamaskSignatureRequest: async () => {
      const rejected = await provider.rejectSignatureRequest();
      return rejected;
    },
    rejectMetamaskDataSignatureRequest: async () => {
      const rejected = await provider.rejectDataSignatureRequest();
      return rejected;
    },
    confirmMetamaskEncryptionPublicKeyRequest: async () => {
      const confirmed = await provider.confirmEncryptionPublicKeyRequest();
      return confirmed;
    },
    rejectMetamaskEncryptionPublicKeyRequest: async () => {
      const rejected = await provider.rejectEncryptionPublicKeyRequest();
      return rejected;
    },
    confirmMetamaskDecryptionRequest: async () => {
      const confirmed = await provider.confirmDecryptionRequest();
      return confirmed;
    },
    rejectMetamaskDecryptionRequest: async () => {
      const rejected = await provider.rejectDecryptionRequest();
      return rejected;
    },
    importMetamaskToken: async tokenConfig => {
      const imported = await provider.importToken(tokenConfig);
      return imported;
    },
    confirmMetamaskAddToken: async () => {
      const confirmed = await provider.confirmAddToken();
      return confirmed;
    },
    rejectMetamaskAddToken: async () => {
      const rejected = await provider.rejectAddToken();
      return rejected;
    },
    confirmMetamaskPermissionToSpend: async () => {
      const confirmed = await provider.confirmPermissionToSpend();
      return confirmed;
    },
    rejectMetamaskPermissionToSpend: async () => {
      const rejected = await provider.rejectPermissionToSpend();
      return rejected;
    },
    confirmMetamaskPermisionToApproveAll: metamask.confirmPermisionToApproveAll,
    rejectMetamaskPermisionToApproveAll: metamask.rejectPermisionToApproveAll,

    /**
     * @deprecated
     */
    acceptMetamaskAccess: async options => {
      return module.exports.acceptAccess(options);
    },
    acceptAccess: async options => {
      const accepted = await provider.acceptAccess(options);
      return accepted;
    },
    rejectMetamaskAccess: metamask.rejectAccess,

    /**
     * @deprecated
     */
    confirmMetamaskTransaction: async gasConfig => {
      return module.exports.confirmTransaction(gasConfig);
    },
    confirmTransaction: async gasConfig => {
      const confirmed = await provider.confirmTransaction(gasConfig);
      return confirmed;
    },

    rejectMetamaskTransaction: async () => {
      const rejected = await provider.rejectTransaction();
      return rejected;
    },
    allowMetamaskToAddNetwork: async ({ waitForEvent }) => {
      const allowed = await provider.allowToAddNetwork({ waitForEvent });
      return allowed;
    },
    rejectMetamaskToAddNetwork: async () => {
      const rejected = await provider.rejectToAddNetwork();
      return rejected;
    },
    allowMetamaskToSwitchNetwork: async () => {
      const allowed = await provider.allowToSwitchNetwork();
      return allowed;
    },
    rejectMetamaskToSwitchNetwork: async () => {
      const rejected = await provider.rejectToSwitchNetwork();
      return rejected;
    },
    allowMetamaskToAddAndSwitchNetwork: async () => {
      const allowed = await provider.allowToAddAndSwitchNetwork();
      return allowed;
    },
    getMetamaskWalletAddress: async () => {
      const walletAddress = await provider.getWalletAddress();
      return walletAddress;
    },
    /**
     * @deprecated
     */
    fetchMetamaskWalletAddress: async () => {
      return module.exports.fetchWalletAddress();
    },
    fetchWalletAddress: async () => {
      return provider.walletAddress();
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
      await provider.initialSetup({
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
