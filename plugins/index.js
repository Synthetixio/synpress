const helpers = require('../helpers');
const playwright = require('../commands/playwright');
const provider =
  process.env.PROVIDER === 'phantom'
    ? require('../commands/phantom')
    : require('../commands/metamask');
const etherscan = require('../commands/etherscan');

const metamaskProvider = require('../commands/metamask');
const phantomProvider = require('../commands/phantom');

const providersHelper = require('../providers');

const providerMap = {
  metamask: metamaskProvider,
  phantom: phantomProvider,
};
let selectedProvider = 'metamask';

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  function getProvider(providerName = selectedProvider) {
    return providerMap[providerName];
  }

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

    if (process.env.PROVIDERS) {
      process.env.CYPRESS_PROVIDERS = process.env.PROVIDERS;
      const providers = providersHelper.getProviders(process.env.PROVIDERS);
      for (const provider of providers) {
        const providerPath = await helpers.prepareProvider(
          provider.name,
          provider.version || 'latest',
        );

        arguments_.extensions.push(providerPath);
      }
    }
    // if (!process.env.SKIP_METAMASK_INSTALL) {
    //   // NOTE: extensions cannot be loaded in headless Chrome
    //   const providerPath = await helpers.prepareProvider(
    //     process.env.PROVIDER_VERSION || '10.25.0',
    //   );

    //   arguments_.extensions.push(providerPath);
    // }

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
    selectProvider(providerName) {
      selectedProvider = providerName;
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
    assignWindows: async provider => {
      const assigned = await playwright.assignWindows(provider);
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
    isWindowActive: async provider => {
      const isActive = await playwright.isWindowActive(provider);
      return isActive;
    },
    isCypressWindowActive: async () => {
      const isCypressActive = await playwright.isCypressWindowActive();
      return isCypressActive;
    },
    switchToCypressWindow: async () => {
      const switched = await playwright.switchToCypressWindow();
      return switched;
    },
    switchToWindow: async provider => {
      const switched = await playwright.switchToWindow(provider);
      return switched;
    },
    switchToNotification: async provider => {
      const notificationPage = await playwright.switchToNotification(provider);
      return notificationPage;
    },
    /**
     * @deprecated
     */
    unlockMetamask: async password => {
      return module.exports.unlock(password);
    },
    unlock: async password => {
      const unlocked = await getProvider(selectedProvider).unlock(password);
      return unlocked;
    },
    lock: () => {
      return getProvider(selectedProvider).lock();
    },
    confirmIncorrectNetworkStage: () => {
      return getProvider(selectedProvider).confirmIncorrectNetworkStage();
    },
    importMetamaskAccount: async privateKey => {
      const imported = await getProvider(selectedProvider).importAccount(
        privateKey,
      );
      return imported;
    },
    createMetamaskAccount: async accountName => {
      const created = await getProvider(selectedProvider).createAccount(
        accountName,
      );
      return created;
    },
    switchMetamaskAccount: async accountNameOrAccountNumber => {
      const switched = await getProvider(selectedProvider).switchAccount(
        accountNameOrAccountNumber,
      );
      return switched;
    },
    addMetamaskNetwork: async network => {
      const networkAdded = await getProvider(selectedProvider).addNetwork(
        network,
      );
      return networkAdded;
    },
    changeMetamaskNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME;
      } else if (!network) {
        network = 'goerli';
      }
      const networkChanged = await getProvider(selectedProvider).changeNetwork(
        network,
      );
      return networkChanged;
    },
    activateAdvancedGasControlInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateAdvancedGasControl(skipSetup);
      return activated;
    },
    activateEnhancedTokenDetectionInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateEnhancedTokenDetection(skipSetup);
      return activated;
    },
    activateShowHexDataInMetamask: async skipSetup => {
      const activated = await getProvider(selectedProvider).activateShowHexData(
        skipSetup,
      );
      return activated;
    },
    activateTestnetConversionInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateTestnetConversion(skipSetup);
      return activated;
    },
    activateShowTestnetNetworksInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateShowTestnetNetworks(skipSetup);
      return activated;
    },
    activateCustomNonceInMetamask: async skipSetup => {
      const activated = await getProvider(selectedProvider).activateCustomNonce(
        skipSetup,
      );
      return activated;
    },
    activateDismissBackupReminderInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateDismissBackupReminder(skipSetup);
      return activated;
    },
    activateEnhancedGasFeeUIInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateEnhancedGasFeeUI(skipSetup);
      return activated;
    },
    activateShowCustomNetworkListInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateShowCustomNetworkList(skipSetup);
      return activated;
    },
    resetMetamaskAccount: async () => {
      const resetted = await getProvider(selectedProvider).resetAccount();
      return resetted;
    },
    disconnectMetamaskWalletFromDapp: async () => {
      const disconnected = await getProvider(
        selectedProvider,
      ).disconnectWalletFromDapp();
      return disconnected;
    },
    disconnectMetamaskWalletFromAllDapps: async () => {
      const disconnected = await getProvider(
        selectedProvider,
      ).disconnectWalletFromAllDapps();
      return disconnected;
    },

    /**
     * @deprecated
     */
    confirmMetamaskSignatureRequest: async () => {
      return module.exports.confirmSignatureRequest();
    },
    confirmSignatureRequest: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmSignatureRequest();
      return confirmed;
    },

    confirmMetamaskDataSignatureRequest: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmDataSignatureRequest();
      return confirmed;
    },
    rejectMetamaskSignatureRequest: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectSignatureRequest();
      return rejected;
    },
    rejectMetamaskDataSignatureRequest: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectDataSignatureRequest();
      return rejected;
    },
    confirmMetamaskEncryptionPublicKeyRequest: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmEncryptionPublicKeyRequest();
      return confirmed;
    },
    rejectMetamaskEncryptionPublicKeyRequest: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectEncryptionPublicKeyRequest();
      return rejected;
    },
    confirmMetamaskDecryptionRequest: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmDecryptionRequest();
      return confirmed;
    },
    rejectMetamaskDecryptionRequest: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectDecryptionRequest();
      return rejected;
    },
    importMetamaskToken: async tokenConfig => {
      const imported = await getProvider(selectedProvider).importToken(
        tokenConfig,
      );
      return imported;
    },
    selectWallet: async (wallet, mode) => {
      const result = await getProvider(selectedProvider).selectWallet(
        wallet,
        mode,
      );
      return result;
    },
    confirmMetamaskAddToken: async () => {
      const confirmed = await getProvider(selectedProvider).confirmAddToken();
      return confirmed;
    },
    rejectMetamaskAddToken: async () => {
      const rejected = await getProvider(selectedProvider).rejectAddToken();
      return rejected;
    },
    confirmMetamaskPermissionToSpend: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmPermissionToSpend();
      return confirmed;
    },
    rejectMetamaskPermissionToSpend: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectPermissionToSpend();
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
      const accepted = await getProvider(selectedProvider).acceptAccess(
        options,
      );
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
      const confirmed = await getProvider(selectedProvider).confirmTransaction(
        gasConfig,
      );
      return confirmed;
    },

    rejectMetamaskTransaction: async () => {
      const rejected = await getProvider(selectedProvider).rejectTransaction();
      return rejected;
    },
    allowMetamaskToAddNetwork: async ({ waitForEvent }) => {
      const allowed = await getProvider(selectedProvider).allowToAddNetwork({
        waitForEvent,
      });
      return allowed;
    },
    rejectMetamaskToAddNetwork: async () => {
      const rejected = await getProvider(selectedProvider).rejectToAddNetwork();
      return rejected;
    },
    allowMetamaskToSwitchNetwork: async () => {
      const allowed = await getProvider(
        selectedProvider,
      ).allowToSwitchNetwork();
      return allowed;
    },
    rejectMetamaskToSwitchNetwork: async () => {
      const rejected = await getProvider(
        selectedProvider,
      ).rejectToSwitchNetwork();
      return rejected;
    },
    allowMetamaskToAddAndSwitchNetwork: async () => {
      const allowed = await getProvider(
        selectedProvider,
      ).allowToAddAndSwitchNetwork();
      return allowed;
    },
    getMetamaskWalletAddress: async () => {
      const walletAddress = await getProvider(
        selectedProvider,
      ).getWalletAddress();
      return walletAddress;
    },
    /**
     * @deprecated
     */
    fetchMetamaskWalletAddress: async () => {
      return module.exports.fetchWalletAddress();
    },
    fetchWalletAddress: async ({ provider = selectedProvider } = {}) => {
      return getProvider(provider).walletAddress();
    },
    setup: async ({
      provider = selectedProvider,
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    }) => {
      console.log(`Setting up ${provider}...`);

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
      await getProvider(provider).initialSetup({
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

  if (process.env.PROVIDERS) {
    config.env.PROVIDERS = process.env.PROVIDERS;
  }

  return config;
};
