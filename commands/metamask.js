const puppeteer = require('./puppeteer');

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
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if (
        (await puppeteer.metamaskWindow().$(welcomePageElements.app)) === null
      ) {
        await puppeteer.metamaskWindow().reload();
        await puppeteer.metamaskWindow().waitForTimeout(2000);
      } else {
        break;
      }
    }
  },
  confirmWelcomePage: async () => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndClick(welcomePageElements.confirmButton);
    return true;
  },
  closePopup: async () => {
    if (
      (await puppeteer.metamaskWindow().$(mainPageElements.popup.container)) !==
      null
    ) {
      await puppeteer.waitAndClick(mainPageElements.popup.closeButton);
    }
    return true;
  },
  unlock: async password => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndType(unlockPageElements.passwordInput, password);
    await puppeteer.waitAndClick(unlockPageElements.unlockButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  importWallet: async (secretWords, password) => {
    await puppeteer.waitAndClick(firstTimeFlowPageElements.importWalletButton);
    await puppeteer.waitAndClick(metametricsPageElements.optOutAnalyticsButton);
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.secretWordsInput,
      secretWords,
    );
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.passwordInput,
      password,
    );
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.confirmPasswordInput,
      password,
    );
    await puppeteer.waitAndClick(firstTimeFlowFormPageElements.termsCheckbox);
    await puppeteer.waitAndClick(firstTimeFlowFormPageElements.importButton);
    await puppeteer.waitAndClick(endOfFlowPageElements.allDoneButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  createWallet: async password => {
    await puppeteer.waitAndClick(firstTimeFlowPageElements.createWalletButton);
    await puppeteer.waitAndClick(metametricsPageElements.optOutAnalyticsButton);
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.newPasswordInput,
      password,
    );
    await puppeteer.waitAndType(
      firstTimeFlowFormPageElements.confirmPasswordInput,
      password,
    );
    await puppeteer.waitAndClick(
      firstTimeFlowFormPageElements.newSignupCheckbox,
    );
    await puppeteer.waitAndClick(firstTimeFlowFormPageElements.importButton);
    await puppeteer.waitAndClick(secureYourWalletPageElements.nextButton);
    await puppeteer.waitAndClick(revealSeedPageElements.remindLaterButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
    await module.exports.closePopup();
    return true;
  },
  importAccount: async privateKey => {
    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.accountMenu.importAccountButton,
    );

    await puppeteer.waitAndType(
      mainPageElements.importAccount.input,
      privateKey,
    );
    await puppeteer.waitAndClick(mainPageElements.importAccount.importButton);

    await switchToCypressIfNotActive();
    return true;
  },
  createAccount: async accountName => {
    if (accountName) {
      accountName = accountName.toLowerCase();
    }

    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.accountMenu.createAccountButton,
    );

    if (accountName) {
      await puppeteer.waitAndType(
        mainPageElements.createAccount.input,
        accountName,
      );
    }
    await puppeteer.waitAndClick(mainPageElements.createAccount.createButton);

    await switchToCypressIfNotActive();
    return true;
  },
  switchAccount: async accountNameOrAccountNumber => {
    if (typeof accountNameOrAccountNumber === 'string') {
      accountNameOrAccountNumber = accountNameOrAccountNumber.toLowerCase();
    }

    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);

    if (typeof accountNameOrAccountNumber === 'number') {
      await puppeteer.waitAndClick(
        mainPageElements.accountMenu.accountButton(accountNameOrAccountNumber),
      );
    } else {
      await puppeteer.waitAndClickByText(
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

    await puppeteer.waitAndClick(mainPageElements.networkSwitcher.button);
    if (network === 'main' || network === 'mainnet') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(0),
      );
    } else if (network === 'ropsten') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(1),
      );
    } else if (network === 'kovan') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(2),
      );
    } else if (network === 'rinkeby') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(3),
      );
    } else if (network === 'goerli') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(4),
      );
    } else if (network === 'localhost') {
      await puppeteer.waitAndClick(
        mainPageElements.networkSwitcher.networkButton(5),
      );
    } else if (typeof network === 'object') {
      await puppeteer.waitAndClickByText(
        mainPageElements.networkSwitcher.dropdownMenuItem,
        network.networkName,
      );
    } else {
      await puppeteer.waitAndClickByText(
        mainPageElements.networkSwitcher.dropdownMenuItem,
        network,
      );
    }

    setNetwork(network);

    if (typeof network === 'object') {
      await puppeteer.waitForText(
        mainPageElements.networkSwitcher.networkName,
        network.networkName,
      );
    } else {
      await puppeteer.waitForText(
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

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.networksButton);
    await puppeteer.waitAndClick(networksPageElements.addNetworkButton);
    await puppeteer.waitAndType(
      addNetworkPageElements.networkNameInput,
      network.networkName,
    );
    await puppeteer.waitAndType(
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrl,
    );
    await puppeteer.waitAndType(
      addNetworkPageElements.chainIdInput,
      network.chainId,
    );

    if (network.symbol) {
      await puppeteer.waitAndType(
        addNetworkPageElements.symbolInput,
        network.symbol,
      );
    }

    if (network.blockExplorer) {
      await puppeteer.waitAndType(
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorer,
      );
    }

    await puppeteer.waitAndClick(addNetworkPageElements.saveButton);
    await puppeteer.waitAndClick(settingsPageElements.closeButton);

    setNetwork(network);

    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );

    await switchToCypressIfNotActive();
    return true;
  },
  async disconnectWalletFromDapp() {
    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    await puppeteer.waitAndClick(mainPageElements.connectedSites.trashButton);
    await puppeteer.waitAndClick(
      mainPageElements.connectedSites.disconnectButton,
    );

    // close popup if present
    if (
      (await puppeteer
        .metamaskWindow()
        .$(mainPageElements.connectedSites.modal)) !== null
    ) {
      await puppeteer.waitAndClick(mainPageElements.connectedSites.closeButton);
    }

    await switchToCypressIfNotActive();
    return true;
  },
  async disconnectWalletFromAllDapps() {
    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    const trashButtons = await puppeteer
      .metamaskWindow()
      .$$(mainPageElements.connectedSites.trashButton);
    // eslint-disable-next-line no-unused-vars
    for (const trashButton of trashButtons) {
      await puppeteer.waitAndClick(mainPageElements.connectedSites.trashButton);
      await puppeteer.waitAndClick(
        mainPageElements.connectedSites.disconnectButton,
      );
    }

    await switchToCypressIfNotActive();
    return true;
  },
  activateCustomNonce: async () => {
    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.advancedButton);
    if (
      (await puppeteer
        .metamaskWindow()
        .$(advancedPageElements.customNonceToggleOn)) === null
    ) {
      await puppeteer.waitAndClick(advancedPageElements.customNonceToggleOff);
    }
    await puppeteer.waitAndClick(settingsPageElements.closeButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);

    await switchToCypressIfNotActive();
    return true;
  },
  resetAccount: async () => {
    await switchToMetamaskIfNotActive();

    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.advancedButton);
    await puppeteer.waitAndClick(advancedPageElements.resetAccountButton);
    await puppeteer.waitAndClick(resetAccountModalElements.resetButton);
    await puppeteer.waitAndClick(settingsPageElements.closeButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);

    await switchToCypressIfNotActive();
    return true;
  },
  confirmSignatureRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      signaturePageElements.confirmSignatureRequestButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectSignatureRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      signaturePageElements.rejectSignatureRequestButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  confirmPermissionToSpend: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectPermissionToSpend: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      notificationPageElements.rejectToSpendButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  acceptAccess: async allAccounts => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    if (allAccounts === true) {
      await puppeteer.waitAndClick(
        notificationPageElements.selectAllCheck,
        notificationPage,
      );
    }
    await puppeteer.waitAndClick(
      notificationPageElements.nextButton,
      notificationPage,
    );
    await puppeteer.waitAndClick(
      permissionsPageElements.connectButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmTransaction: async gasConfig => {
    const isKovanTestnet = getNetwork().networkName === 'kovan';
    // todo: remove waitForTimeout below after improving switchToMetamaskNotification
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    if (isKovanTestnet) {
      await puppeteer.waitAndSetValue(
        '1',
        confirmPageElements.gasFeeInput,
        notificationPage,
      );
    } else if (gasConfig && gasConfig.gasFee) {
      await puppeteer.waitAndSetValue(
        gasConfig.gasFee.toString(),
        confirmPageElements.gasFeeInput,
        notificationPage,
      );
    } else {
      await puppeteer.waitAndClick(
        confirmPageElements.gasFeeArrowUpButton,
        notificationPage,
        10,
      );
    }

    if (gasConfig && gasConfig.gasLimit) {
      await puppeteer.waitAndSetValue(
        gasConfig.gasLimit.toString(),
        confirmPageElements.gasLimitInput,
        notificationPage,
      );
    }
    // metamask reloads popup after changing a fee, you have to wait for this event otherwise transaction will fail
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    await notificationPage.waitForFunction(
      `document.querySelector('${confirmPageElements.gasLimitInput}').value != "0"`,
    );
    await puppeteer.waitAndClick(
      confirmPageElements.confirmButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectTransaction: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      confirmPageElements.rejectButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    return true;
  },
  confirmEncryptionPublicKeyRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      encryptionPublicKeyPageElements.confirmEncryptionPublicKeyButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },

  rejectEncryptionPublicKeyRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      encryptionPublicKeyPageElements.rejectEncryptionPublicKeyButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  confirmDecryptionRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      decryptPageElements.confirmDecryptionRequestButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectDecryptionRequest: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      decryptPageElements.rejectDecryptionRequestButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  allowToAddNetwork: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
    );
    return true;
  },
  rejectToAddNetwork: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
    );
    return true;
  },
  allowToSwitchNetwork: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectToSwitchNetwork: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
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

    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.accountDetailsButton,
    );
    walletAddress = await puppeteer.waitAndGetValue(
      mainPageElements.accountModal.walletAddressInput,
    );
    await puppeteer.waitAndClick(mainPageElements.accountModal.closeButton);

    await switchToCypressIfNotActive();

    return walletAddress;
  },
  initialSetup: async ({ secretWordsOrPrivateKey, network, password }) => {
    const isCustomNetwork =
      (process.env.NETWORK_NAME &&
        process.env.RPC_URL &&
        process.env.CHAIN_ID) ||
      typeof network == 'object';

    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.assignActiveTabName('metamask');
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    if (
      (await puppeteer.metamaskWindow().$(unlockPageElements.unlockPage)) ===
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
      await puppeteer.switchToCypressWindow();
      return true;
    } else {
      await module.exports.unlock(password);
      walletAddress = await module.exports.getWalletAddress();
      await puppeteer.switchToCypressWindow();
      return true;
    }
  },
};

async function switchToMetamaskIfNotActive() {
  if (await puppeteer.isCypressWindowActive()) {
    await puppeteer.switchToMetamaskWindow();
    switchBackToCypressWindow = true;
  }
  return switchBackToCypressWindow;
}

async function switchToCypressIfNotActive() {
  if (switchBackToCypressWindow) {
    await puppeteer.switchToCypressWindow();
    switchBackToCypressWindow = false;
  }
  return switchBackToCypressWindow;
}
