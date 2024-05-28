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
        process.env.METAMASK_VERSION || '11.15.0',
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
    changeMetamaskNetwork: async network => {
      if (process.env.NETWORK_NAME && !network) {
        network = process.env.NETWORK_NAME;
      } else if (!network) {
        network = 'goerli';
      }
      return await metamask.changeNetwork(network);
    },
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
    confirmMetamaskPermissionToApproveAll:
      metamask.confirmPermissionToApproveAll,
    rejectMetamaskPermissionToApproveAll: metamask.rejectPermissionToApproveAll,
    confirmMetamaskRevokePermissionToAll: metamask.confirmRevokePermissionToAll,
    rejectMetamaskRevokePermissionToAll: metamask.rejectRevokePermissionToAll,
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
