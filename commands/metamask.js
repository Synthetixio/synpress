const playwright = require('./playwright');

const {
  welcomePageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  firstTimeFlowFormPageElements,
  secureYourWalletPageElements,
  revealSeedPageElements,
  endOfFlowPageElements,
} = require('../pages/metamask/first-time-flow-page');
const { mainPageElements } = require('../pages/metamask/main-page');
const { unlockPageElements } = require('../pages/metamask/unlock-page');
const {
  notificationPageElements,
  permissionsPageElements,
  confirmPageElements,
  signaturePageElements,
  encryptionPublicKeyPageElements,
  decryptPageElements,
  dataSignaturePageElements,
} = require('../pages/metamask/notification-page');
const {
  settingsPageElements,
  advancedPageElements,
  resetAccountModalElements,
  networksPageElements,
  addNetworkPageElements,
} = require('../pages/metamask/settings-page');
const {
  confirmationPageElements,
} = require('../pages/metamask/confirmation-page');
const { setNetwork, getNetwork } = require('../helpers');

let extensionInitialUrl;
let extensionId;
let extensionHomeUrl;
let extensionSettingsUrl;
let extensionAdvancedSettingsUrl;
let extensionAddNetworkUrl;
let extensionNewAccountUrl;
let extensionImportAccountUrl;
let walletAddress;
let switchBackToCypressWindow;

module.exports = {
  extensionId: () => {
    return extensionId;
  },
  extensionUrls: () => {
    return {
      extensionInitialUrl,
      extensionHomeUrl,
      extensionSettingsUrl,
      extensionAdvancedSettingsUrl,
      extensionAddNetworkUrl,
      extensionNewAccountUrl,
      extensionImportAccountUrl,
    };
  },
  walletAddress: () => {
    return walletAddress;
  },
  goToSettings: async () => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(extensionSettingsUrl),
    ]);
  },
  goToAdvancedSettings: async () => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(extensionAdvancedSettingsUrl),
    ]);
  },
  goToAddNetwork: async () => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(extensionAddNetworkUrl),
    ]);
  },
  goToNewAccount: async () => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(extensionNewAccountUrl),
    ]);
  },
  goToImportAccount: async () => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(extensionImportAccountUrl),
    ]);
  },
  getExtensionDetails: async () => {
    extensionInitialUrl = await playwright.metamaskWindow().url();
    extensionId = extensionInitialUrl.match('//(.*?)/')[1];
    extensionHomeUrl = `chrome-extension://${extensionId}/home.html`;
    extensionSettingsUrl = `${extensionHomeUrl}#settings`;
    extensionAdvancedSettingsUrl = `${extensionSettingsUrl}/advanced`;
    extensionAddNetworkUrl = `${extensionSettingsUrl}/networks/add-network`;
    extensionNewAccountUrl = `${extensionHomeUrl}#new-account`;
    extensionImportAccountUrl = `${extensionNewAccountUrl}/import`;

    return {
      extensionInitialUrl,
      extensionId,
      extensionSettingsUrl,
      extensionAdvancedSettingsUrl,
      extensionAddNetworkUrl,
      extensionNewAccountUrl,
      extensionImportAccountUrl,
    };
  },
  // workaround for metamask random blank page on first run
  fixBlankPage: async () => {
    await playwright.metamaskWindow().waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if (
        (await playwright.metamaskWindow().$(welcomePageElements.app)) === null
      ) {
        await playwright.metamaskWindow().reload();
        await playwright.metamaskWindow().waitForTimeout(2000);
      } else {
        break;
      }
    }
  },
  confirmWelcomePage: async () => {
    await module.exports.fixBlankPage();
    await playwright.waitAndClick(
      welcomePageElements.confirmButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    return true;
  },
  closePopup: async () => {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise popup may not be detected properly and not closed
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      (await playwright
        .metamaskWindow()
        .$(mainPageElements.popup.container)) !== null
    ) {
      const popupBackground = playwright
        .metamaskWindow()
        .locator(mainPageElements.popup.background);
      const popupBackgroundBox = await popupBackground.boundingBox();
      await playwright
        .metamaskWindow()
        .mouse.click(popupBackgroundBox.x + 1, popupBackgroundBox.y + 1);
    }
    return true;
  },
  closeModal: async () => {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise modal may not be detected properly and not closed
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      (await playwright
        .metamaskWindow()
        .$(mainPageElements.connectedSites.modal)) !== null
    ) {
      await playwright.waitAndClick(
        mainPageElements.connectedSites.closeButton,
      );
    }
    return true;
  },
  unlock: async password => {
    await module.exports.fixBlankPage();
    await playwright.waitAndType(unlockPageElements.passwordInput, password);
    await playwright.waitAndClick(
      unlockPageElements.unlockButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopup();
    return true;
  },
  importWallet: async (secretWords, password) => {
    await playwright.waitAndClick(
      firstTimeFlowPageElements.importWalletButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      metametricsPageElements.optOutAnalyticsButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndType(
      firstTimeFlowFormPageElements.secretWordsInput,
      secretWords,
    );
    await playwright.waitAndType(
      firstTimeFlowFormPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      firstTimeFlowFormPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(firstTimeFlowFormPageElements.termsCheckbox);
    await playwright.waitAndClick(
      firstTimeFlowFormPageElements.importButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      endOfFlowPageElements.allDoneButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopup();
    return true;
  },
  createWallet: async password => {
    await playwright.waitAndClick(
      firstTimeFlowPageElements.createWalletButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      metametricsPageElements.optOutAnalyticsButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndType(
      firstTimeFlowFormPageElements.newPasswordInput,
      password,
    );
    await playwright.waitAndType(
      firstTimeFlowFormPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      firstTimeFlowFormPageElements.newSignupCheckbox,
    );
    await playwright.waitAndClick(
      firstTimeFlowFormPageElements.importButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      secureYourWalletPageElements.nextButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      revealSeedPageElements.remindLaterButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopup();
    return true;
  },
  importAccount: async privateKey => {
    await switchToMetamaskIfNotActive();
    await module.exports.goToImportAccount();
    await playwright.waitAndType(
      mainPageElements.importAccount.input,
      privateKey,
    );
    await playwright.waitAndClick(mainPageElements.importAccount.importButton);
    await switchToCypressIfNotActive();
    return true;
  },
  createAccount: async accountName => {
    if (accountName) {
      accountName = accountName.toLowerCase();
    }

    await switchToMetamaskIfNotActive();
    await module.exports.goToNewAccount();
    if (accountName) {
      await playwright.waitAndType(
        mainPageElements.createAccount.input,
        accountName,
      );
    }
    await playwright.waitAndClick(mainPageElements.createAccount.createButton);
    await switchToCypressIfNotActive();
    return true;
  },
  switchAccount: async accountNameOrAccountNumber => {
    if (typeof accountNameOrAccountNumber === 'string') {
      accountNameOrAccountNumber = accountNameOrAccountNumber.toLowerCase();
    }

    await switchToMetamaskIfNotActive();
    // note: closePopup() is required after changing createAccount() to use direct urls (popup started appearing)
    // ^ this change also introduced 500ms delay for closePopup() function
    await module.exports.closePopup();
    await playwright.waitAndClick(mainPageElements.accountMenu.button);

    if (typeof accountNameOrAccountNumber === 'number') {
      await playwright.waitAndClick(
        mainPageElements.accountMenu.accountButton(accountNameOrAccountNumber),
      );
    } else {
      await playwright.waitAndClickByText(
        mainPageElements.accountMenu.accountName,
        accountNameOrAccountNumber,
      );
    }

    await switchToCypressIfNotActive();
    return true;
  },
  changeNetwork: async network => {
    await switchToMetamaskIfNotActive();

    if (typeof network === 'string') {
      network = network.toLowerCase();
    } else if (typeof network === 'object') {
      network.networkName = network.networkName.toLowerCase();
    }

    await playwright.waitAndClick(mainPageElements.networkSwitcher.button);
    if (network === 'main' || network === 'mainnet') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(0),
      );
    } else if (network === 'ropsten') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(1),
      );
    } else if (network === 'kovan') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(2),
      );
    } else if (network === 'rinkeby') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(3),
      );
    } else if (network === 'goerli') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(4),
      );
    } else if (network === 'localhost') {
      await playwright.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(5),
      );
    } else if (typeof network === 'object') {
      await playwright.waitAndClickByText(
        mainPageElements.networkSwitcher.dropdownMenuItem,
        network.networkName,
      );
    } else {
      await playwright.waitAndClickByText(
        mainPageElements.networkSwitcher.dropdownMenuItem,
        network,
      );
    }

    setNetwork(network);

    if (typeof network === 'object') {
      await playwright.waitForText(
        mainPageElements.networkSwitcher.networkName,
        network.networkName,
      );
    } else {
      await playwright.waitForText(
        mainPageElements.networkSwitcher.networkName,
        network,
      );
    }

    await switchToCypressIfNotActive();

    return true;
  },
  addNetwork: async network => {
    await switchToMetamaskIfNotActive();

    if (
      process.env.NETWORK_NAME &&
      process.env.RPC_URL &&
      process.env.CHAIN_ID
    ) {
      network = {
        networkName: process.env.NETWORK_NAME,
        rpcUrl: process.env.RPC_URL,
        chainId: process.env.CHAIN_ID,
        symbol: process.env.SYMBOL,
        blockExplorer: process.env.BLOCK_EXPLORER,
        isTestnet: process.env.IS_TESTNET,
      };
    }

    if (typeof network === 'string') {
      network = network.toLowerCase();
    } else if (typeof network === 'object') {
      network.networkName = network.networkName.toLowerCase();
    }

    await module.exports.goToAddNetwork();
    await playwright.waitAndClick(networksPageElements.addNetworkButton);
    await playwright.waitAndType(
      addNetworkPageElements.networkNameInput,
      network.networkName,
    );
    await playwright.waitAndType(
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrl,
    );
    await playwright.waitAndType(
      addNetworkPageElements.chainIdInput,
      network.chainId,
    );

    if (network.symbol) {
      await playwright.waitAndType(
        addNetworkPageElements.symbolInput,
        network.symbol,
      );
    }

    if (network.blockExplorer) {
      await playwright.waitAndType(
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorer,
      );
    }

    await playwright.waitAndClick(addNetworkPageElements.saveButton);
    await playwright.waitAndClick(
      settingsPageElements.closeButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );

    setNetwork(network);

    await playwright.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );

    await switchToCypressIfNotActive();
    return true;
  },
  async disconnectWalletFromDapp() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    const trashButton = await playwright
      .metamaskWindow()
      .$(mainPageElements.connectedSites.trashButton);
    if (trashButton) {
      console.log(
        '[disconnectWalletFromDapp] Wallet is connected to a dapp, disconnecting..',
      );
      await playwright.waitAndClick(
        mainPageElements.connectedSites.trashButton,
      );
      await playwright.waitAndClick(
        mainPageElements.connectedSites.disconnectButton,
      );
    } else {
      console.log(
        '[disconnectWalletFromDapp] Wallet is not connected to a dapp, skipping..',
      );
    }
    await module.exports.closeModal();
    await switchToCypressIfNotActive();
    return true;
  },
  async disconnectWalletFromAllDapps() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    const trashButtons = await playwright
      .metamaskWindow()
      .$$(mainPageElements.connectedSites.trashButton);
    if (trashButtons.length) {
      console.log(
        '[disconnectWalletFromAllDapps] Wallet is connected to dapps, disconnecting..',
      );
      // eslint-disable-next-line no-unused-vars
      for (const trashButton of trashButtons) {
        await playwright.waitAndClick(
          mainPageElements.connectedSites.trashButton,
        );
        await playwright.waitAndClick(
          mainPageElements.connectedSites.disconnectButton,
        );
      }
    } else {
      console.log(
        '[disconnectWalletFromAllDapps] Wallet is not connected to any dapps, skipping..',
      );
    }
    await module.exports.closeModal();
    await switchToCypressIfNotActive();
    return true;
  },
  activateCustomNonce: async () => {
    await switchToMetamaskIfNotActive();
    await module.exports.goToAdvancedSettings();
    if (
      (await playwright
        .metamaskWindow()
        .$(advancedPageElements.customNonceToggleOn)) === null
    ) {
      await playwright.waitAndClick(advancedPageElements.customNonceToggleOff);
    }
    await playwright.waitAndClick(
      settingsPageElements.closeButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await switchToCypressIfNotActive();
    return true;
  },
  resetAccount: async () => {
    await switchToMetamaskIfNotActive();
    await module.exports.goToAdvancedSettings();
    await playwright.waitAndClick(advancedPageElements.resetAccountButton);
    await playwright.waitAndClick(resetAccountModalElements.resetButton);
    await playwright.waitAndClick(
      settingsPageElements.closeButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await switchToCypressIfNotActive();
    return true;
  },
  confirmSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();

    playwright.waitAndClick(
      signaturePageElements.confirmSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmDataSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      dataSignaturePageElements.confirmDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.rejectSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectDataSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      dataSignaturePageElements.rejectDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmPermissionToSpend: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectPermissionToSpend: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.rejectToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  acceptAccess: async allAccounts => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    // todo: allAccounts doesn't work? - waitAndClick has .first()
    if (allAccounts === true) {
      await playwright.waitAndClick(
        notificationPageElements.selectAllCheck,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      notificationPageElements.nextButton,
      notificationPage,
      { waitForEvent: 'navi' },
    );
    await playwright.waitAndClick(
      permissionsPageElements.connectButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmTransaction: async gasConfig => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (gasConfig && gasConfig.gasFee) {
      await playwright.waitAndSetValue(
        gasConfig.gasFee.toString(),
        confirmPageElements.gasFeeInput,
        notificationPage,
      );
    } else if (getNetwork().isTestnet) {
      await playwright.waitAndClick(
        confirmPageElements.gasFeeArrowUpButton,
        notificationPage,
        1,
      );
    } else {
      await playwright.waitAndClick(
        confirmPageElements.gasFeeArrowUpButton,
        notificationPage,
        10,
      );
    }

    if (gasConfig && gasConfig.gasLimit) {
      await playwright.waitAndSetValue(
        gasConfig.gasLimit.toString(),
        confirmPageElements.gasLimitInput,
        notificationPage,
      );
    }

    const gasLimitInput = confirmPageElements.gasLimitInput;
    await notificationPage.waitForFunction(
      gasLimitInput => document.querySelector(gasLimitInput).value != '0',
      gasLimitInput,
    );

    await playwright.waitAndClick(
      confirmPageElements.confirmButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectTransaction: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmPageElements.rejectButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmEncryptionPublicKeyRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.confirmEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },

  rejectEncryptionPublicKeyRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.rejectEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmDecryptionRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.confirmDecryptionRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectDecryptionRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.rejectDecryptionRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  allowToAddNetwork: async ({ waitForEvent } = {}) => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (waitForEvent) {
      await playwright.waitAndClick(
        confirmationPageElements.footer.approveButton,
        notificationPage,
        { waitForEvent },
      );
    } else {
      await playwright.waitAndClick(
        confirmationPageElements.footer.approveButton,
        notificationPage,
      );
    }
    return true;
  },
  rejectToAddNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  allowToSwitchNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectToSwitchNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  allowToAddAndSwitchNetwork: async () => {
    await module.exports.allowToAddNetwork();
    await module.exports.allowToSwitchNetwork();
    return true;
  },
  getWalletAddress: async () => {
    await switchToMetamaskIfNotActive();

    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.accountDetailsButton,
    );
    walletAddress = await playwright.waitAndGetValue(
      mainPageElements.accountModal.walletAddressInput,
    );
    await playwright.waitAndClick(mainPageElements.accountModal.closeButton);

    await switchToCypressIfNotActive();

    return walletAddress;
  },
  initialSetup: async ({ secretWordsOrPrivateKey, network, password }) => {
    const isCustomNetwork =
      (process.env.NETWORK_NAME &&
        process.env.RPC_URL &&
        process.env.CHAIN_ID) ||
      typeof network == 'object';

    await playwright.init();
    await playwright.assignWindows();
    await playwright.assignActiveTabName('metamask');
    await module.exports.getExtensionDetails();
    await module.exports.fixBlankPage();
    if (
      (await playwright
        .metamaskWindow()
        .$(welcomePageElements.confirmButton)) !== null
    ) {
      await module.exports.confirmWelcomePage();
      if (secretWordsOrPrivateKey.includes(' ')) {
        // secret words
        await module.exports.importWallet(secretWordsOrPrivateKey, password);
      } else {
        // private key
        await module.exports.createWallet(password);
        await module.exports.importAccount(secretWordsOrPrivateKey);
      }
      if (isCustomNetwork) {
        await module.exports.addNetwork(network);
      } else {
        await module.exports.changeNetwork(network);
      }
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else if (
      (await playwright
        .metamaskWindow()
        .$(unlockPageElements.passwordInput)) !== null
    ) {
      await module.exports.unlock(password);
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else {
      if (
        (await playwright
          .metamaskWindow()
          .$(mainPageElements.walletOverview)) !== null &&
        !process.env.RESET_METAMASK
      ) {
        await playwright.switchToMetamaskWindow();
        walletAddress = await module.exports.getWalletAddress();
        await playwright.switchToCypressWindow();
        return true;
      } else {
        // todo: reset metamask state
      }
    }
  },
};

async function switchToMetamaskIfNotActive() {
  if (await playwright.isCypressWindowActive()) {
    await playwright.switchToMetamaskWindow();
    switchBackToCypressWindow = true;
  }
  return switchBackToCypressWindow;
}

async function switchToCypressIfNotActive() {
  if (switchBackToCypressWindow) {
    await playwright.switchToCypressWindow();
    switchBackToCypressWindow = false;
  }
  return switchBackToCypressWindow;
}
