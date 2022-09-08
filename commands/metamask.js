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

let walletAddress;
let switchBackToCypressWindow;

module.exports = {
  walletAddress: () => {
    return walletAddress;
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
    await playwright.waitAndClick(welcomePageElements.confirmButton);
    return true;
  },
  closePopup: async () => {
    if (
      (await playwright
        .metamaskWindow()
        .$(mainPageElements.popup.container)) !== null
    ) {
      await playwright.waitAndClick(mainPageElements.popup.closeButton);
    }
    return true;
  },
  unlock: async password => {
    await module.exports.fixBlankPage();
    await playwright.waitAndType(unlockPageElements.passwordInput, password);
    await playwright.waitAndClick(unlockPageElements.unlockButton);
    await playwright.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  importWallet: async (secretWords, password) => {
    await playwright.waitAndClick(firstTimeFlowPageElements.importWalletButton);
    await playwright.waitAndClick(
      metametricsPageElements.optOutAnalyticsButton,
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
    await playwright.waitAndClick(firstTimeFlowFormPageElements.importButton);
    await playwright.waitAndClick(endOfFlowPageElements.allDoneButton);
    await playwright.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  createWallet: async password => {
    await playwright.waitAndClick(firstTimeFlowPageElements.createWalletButton);
    await playwright.waitAndClick(
      metametricsPageElements.optOutAnalyticsButton,
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
    await playwright.waitAndClick(firstTimeFlowFormPageElements.importButton);
    await playwright.waitAndClick(secureYourWalletPageElements.nextButton);
    await playwright.waitAndClick(revealSeedPageElements.remindLaterButton);
    await playwright.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  importAccount: async privateKey => {
    await switchToMetamaskIfNotActive();

    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(
      mainPageElements.accountMenu.importAccountButton,
    );

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

    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(
      mainPageElements.accountMenu.createAccountButton,
    );

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

    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await playwright.waitAndClick(settingsPageElements.networksButton);
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
    await playwright.waitAndClick(settingsPageElements.closeButton);

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
    await playwright.waitAndClick(mainPageElements.connectedSites.trashButton);
    await playwright.waitAndClick(
      mainPageElements.connectedSites.disconnectButton,
    );

    // close popup if present
    if (
      (await playwright
        .metamaskWindow()
        .$(mainPageElements.connectedSites.modal)) !== null
    ) {
      await playwright.waitAndClick(
        mainPageElements.connectedSites.closeButton,
      );
    }

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
    // eslint-disable-next-line no-unused-vars
    for (const trashButton of trashButtons) {
      await playwright.waitAndClick(
        mainPageElements.connectedSites.trashButton,
      );
      await playwright.waitAndClick(
        mainPageElements.connectedSites.disconnectButton,
      );
    }

    await switchToCypressIfNotActive();
    return true;
  },
  activateCustomNonce: async () => {
    await switchToMetamaskIfNotActive();

    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await playwright.waitAndClick(settingsPageElements.advancedButton);
    if (
      (await playwright
        .metamaskWindow()
        .$(advancedPageElements.customNonceToggleOn)) === null
    ) {
      await playwright.waitAndClick(advancedPageElements.customNonceToggleOff);
    }
    await playwright.waitAndClick(settingsPageElements.closeButton);
    await playwright.waitFor(mainPageElements.walletOverview);

    await switchToCypressIfNotActive();
    return true;
  },
  resetAccount: async () => {
    await switchToMetamaskIfNotActive();

    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await playwright.waitAndClick(settingsPageElements.advancedButton);
    await playwright.waitAndClick(advancedPageElements.resetAccountButton);
    await playwright.waitAndClick(resetAccountModalElements.resetButton);
    await playwright.waitAndClick(settingsPageElements.closeButton);
    await playwright.waitFor(mainPageElements.walletOverview);

    await switchToCypressIfNotActive();
    return true;
  },
  confirmSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.confirmSignatureRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmDataSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      dataSignaturePageElements.confirmDataSignatureRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.rejectSignatureRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  rejectDataSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      dataSignaturePageElements.rejectDataSignatureRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmPermissionToSpend: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectPermissionToSpend: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.rejectToSpendButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  acceptAccess: async allAccounts => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (allAccounts === true) {
      await playwright.waitAndClick(
        notificationPageElements.selectAllCheck,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      notificationPageElements.nextButton,
      notificationPage,
    );
    await playwright.waitAndClick(
      permissionsPageElements.connectButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmTransaction: async gasConfig => {
    // todo: remove waitForTimeout below after improving switchToMetamaskNotification
    await playwright.metamaskWindow().waitForTimeout(1000);
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (gasConfig && gasConfig.gasFee) {
      await playwright.waitAndSetValue(
        gasConfig.gasFee.toString(),
        confirmPageElements.gasFeeInput,
        notificationPage,
      );
    } else if (getNetwork().isTestnet) {
      await playwright.waitAndSetValue(
        '1',
        confirmPageElements.gasFeeInput,
        notificationPage,
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
    // metamask reloads popup after changing a fee, you have to wait for this event otherwise transaction will fail
    await playwright.metamaskWindow().waitForTimeout(3000);
    const gasLimitInput = confirmPageElements.gasLimitInput;
    await notificationPage.waitForFunction(
      gasLimitInput => document.querySelector(gasLimitInput).value != '0',
      gasLimitInput,
    );
    await playwright.waitAndClick(
      confirmPageElements.confirmButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectTransaction: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmPageElements.rejectButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  confirmEncryptionPublicKeyRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.confirmEncryptionPublicKeyButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },

  rejectEncryptionPublicKeyRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.rejectEncryptionPublicKeyButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmDecryptionRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.confirmDecryptionRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectDecryptionRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.rejectDecryptionRequestButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  allowToAddNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
    );
    return true;
  },
  rejectToAddNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
    );
    return true;
  },
  allowToSwitchNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
    );
    await playwright.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectToSwitchNetwork: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
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
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      (await playwright.metamaskWindow().$(unlockPageElements.unlockPage)) ===
      null
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
    } else {
      await module.exports.unlock(password);
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
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
