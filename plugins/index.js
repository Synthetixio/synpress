const helpers = require('../helpers');
const playwright = require('../commands/playwright');
const etherscan = require('../commands/etherscan');

const metamask = require('../commands/metamask');
const phantomProvider = require('../commands/phantom');

const providersHelper = require('../providers');

const providerMap = {
  metamask,
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
    initPlaywright: playwright.init,
    clearPlaywright: playwright.clear,
    assignWindows: playwright.assignWindows,
    clearWindows: playwright.clearWindows,
    assignActiveTabName: playwright.assignActiveTabName,
    isMetamaskWindowActive: playwright.isMetamaskWindowActive,
    isCypressWindowActive: playwright.isCypressWindowActive,
    switchToCypressWindow: playwright.switchToCypressWindow,
    switchToMetamaskWindow: playwright.switchToMetamaskWindow,
    switchToMetamaskNotification: playwright.switchToMetamaskNotification,
    unlockMetamask: metamask.unlock,
    importMetamaskAccount: metamask.importAccount,
    createMetamaskAccount: metamask.createAccount,
    renameMetamaskAccount: metamask.renameAccount,
    switchMetamaskAccount: metamask.switchAccount,
    addMetamaskNetwork: metamask.addNetwork,
    activateAdvancedGasControlInMetamask: metamask.activateAdvancedGasControl,
    activateShowHexDataInMetamask: metamask.activateShowHexData,
    activateTestnetConversionInMetamask: metamask.activateTestnetConversion,
    activateShowTestnetNetworksInMetamask: metamask.activateShowTestnetNetworks,
    activateCustomNonceInMetamask: metamask.activateCustomNonce,
    activateDismissBackupReminderInMetamask:
      metamask.activateDismissBackupReminder,
    activateEthSignRequestsInMetamask: metamask.activateEthSignRequests,
    activateImprovedTokenAllowanceInMetamask:
      metamask.activateImprovedTokenAllowance,
    resetMetamaskAccount: metamask.resetAccount,
    disconnectMetamaskWalletFromDapp: metamask.disconnectWalletFromDapp,
    disconnectMetamaskWalletFromAllDapps: metamask.disconnectWalletFromAllDapps,
    confirmMetamaskSignatureRequest: metamask.confirmSignatureRequest,
    confirmMetamaskDataSignatureRequest: metamask.confirmDataSignatureRequest,
    rejectMetamaskSignatureRequest: metamask.rejectSignatureRequest,
    rejectMetamaskDataSignatureRequest: metamask.rejectDataSignatureRequest,
    confirmMetamaskEncryptionPublicKeyRequest:
      metamask.confirmEncryptionPublicKeyRequest,
    rejectMetamaskEncryptionPublicKeyRequest:
      metamask.rejectEncryptionPublicKeyRequest,
    confirmMetamaskDecryptionRequest: metamask.confirmDecryptionRequest,
    rejectMetamaskDecryptionRequest: metamask.rejectDecryptionRequest,
    importMetamaskToken: metamask.importToken,
    confirmMetamaskAddToken: metamask.confirmAddToken,
    rejectMetamaskAddToken: metamask.rejectAddToken,
    confirmMetamaskPermissionToSpend: metamask.confirmPermissionToSpend,
    rejectMetamaskPermissionToSpend: metamask.rejectPermissionToSpend,
    confirmMetamaskPermisionToApproveAll: metamask.confirmPermisionToApproveAll,
    rejectMetamaskPermisionToApproveAll: metamask.rejectPermisionToApproveAll,
    acceptMetamaskAccess: metamask.acceptAccess,
    rejectMetamaskAccess: metamask.rejectAccess,
    confirmMetamaskTransaction: metamask.confirmTransaction,
    confirmMetamaskTransactionAndWaitForMining:
      metamask.confirmTransactionAndWaitForMining,
    rejectMetamaskTransaction: metamask.rejectTransaction,
    openMetamaskTransactionDetails: metamask.openTransactionDetails,
    closeMetamaskTransactionDetailsPopup: metamask.closeTransactionDetailsPopup,
    allowMetamaskToAddNetwork: async ({ waitForEvent }) =>
      await metamask.allowToAddNetwork({ waitForEvent }),
    rejectMetamaskToAddNetwork: metamask.rejectToAddNetwork,
    allowMetamaskToSwitchNetwork: metamask.allowToSwitchNetwork,
    rejectMetamaskToSwitchNetwork: metamask.rejectToSwitchNetwork,
    allowMetamaskToAddAndSwitchNetwork: metamask.allowToAddAndSwitchNetwork,
    getMetamaskWalletAddress: metamask.getWalletAddress,
    fetchMetamaskWalletAddress: metamask.walletAddress,
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

    activateEnhancedTokenDetectionInMetamask: async skipSetup => {
      const activated = await getProvider(
        selectedProvider,
      ).activateEnhancedTokenDetection(skipSetup);
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
    confirmSignatureRequest: async () => {
      const confirmed = await getProvider(
        selectedProvider,
      ).confirmSignatureRequest();
      return confirmed;
    },
    selectWallet: async (wallet, mode) => {
      const result = await getProvider(selectedProvider).selectWallet(
        wallet,
        mode,
      );
      return result;
    },
    acceptAccess: async options => {
      const accepted = await getProvider(selectedProvider).acceptAccess(
        options,
      );
      return accepted;
    },
    confirmTransaction: async gasConfig => {
      const confirmed = await getProvider(selectedProvider).confirmTransaction(
        gasConfig,
      );
      return confirmed;
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
      await getProvider(provider).initialSetup(null, {
        secretWordsOrPrivateKey,
        network,
        password,
        enableAdvancedSettings,
        enableExperimentalSettings,
      });
      return true;
    },
    getCurrentNetwork: helpers.getCurrentNetwork,
    etherscanGetTransactionStatus: async ({ txid }) =>
      await etherscan.getTransactionStatus(txid),
    etherscanWaitForTxSuccess: async ({ txid }) =>
      await etherscan.waitForTxSuccess(txid),
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
