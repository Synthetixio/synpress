const puppeteer = require('./puppeteer');

const { pageElements } = require('../pages/metamask/page');
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
} = require('../pages/metamask/notification-page');
const {
  settingsPageElements,
  advancedPageElements,
  resetAccountModalElements,
  networksPageElements,
  addNetworkPageElements,
} = require('../pages/metamask/settings-page');
const { setNetwork, getNetwork } = require('../helpers');

let walletAddress;

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
  unlock: async password => {
    await module.exports.fixBlankPage();
    await puppeteer.waitAndType(unlockPageElements.passwordInput, password);
    await puppeteer.waitAndClick(unlockPageElements.unlockButton);
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

    await puppeteer.waitFor(pageElements.loadingSpinner);
    await puppeteer.waitAndClick(endOfFlowPageElements.allDoneButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);

    // close popup if present
    if (
      (await puppeteer.metamaskWindow().$(mainPageElements.popup.container)) !==
      null
    ) {
      await puppeteer.waitAndClick(mainPageElements.popup.closeButton);
    }
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

    await puppeteer.waitFor(pageElements.loadingSpinner);
    await puppeteer.waitAndClick(secureYourWalletPageElements.nextButton);
    await puppeteer.waitAndClick(revealSeedPageElements.remindLaterButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);

    // close popup if present
    if (
      (await puppeteer.metamaskWindow().$(mainPageElements.popup.container)) !==
      null
    ) {
      await puppeteer.waitAndClick(mainPageElements.popup.closeButton);
    }
    return true;
  },
  importFromPrivateKey: async privateKey => {
    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.accountMenu.importAccountButton,
    );

    await puppeteer.waitAndType(
      mainPageElements.importAccount.input,
      privateKey,
    );
    await puppeteer.waitAndClick(mainPageElements.importAccount.importButton);
    return true;
  },
  changeNetwork: async network => {
    setNetwork(network);
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

    return true;
  },
  addNetwork: async network => {
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
    await puppeteer.waitAndType(
      addNetworkPageElements.symbolInput,
      network.symbol,
    );
    await puppeteer.waitAndType(
      addNetworkPageElements.blockExplorerInput,
      network.blockExplorer,
    );
    await puppeteer.waitAndClick(addNetworkPageElements.saveButton);
    await puppeteer.waitAndClick(settingsPageElements.closeButton);
    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );
    return true;
  },
  async disconnectWalletFromDapp() {
    await puppeteer.switchToMetamaskWindow();
    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    await puppeteer.waitAndClick(mainPageElements.connectedSites.trashButton);
    await puppeteer.waitAndClick(
      mainPageElements.connectedSites.disconnectButton,
    );
    await puppeteer.waitAndClick(mainPageElements.connectedSites.closeButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  async disconnectWalletFromAllDapps() {
    await puppeteer.switchToMetamaskWindow();
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
    await puppeteer.waitAndClick(mainPageElements.connectedSites.closeButton);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  activateCustomNonce: async () => {
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
    return true;
  },
  resetAccount: async () => {
    await puppeteer.waitAndClick(mainPageElements.accountMenu.button);
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton);
    await puppeteer.waitAndClick(settingsPageElements.advancedButton);
    await puppeteer.waitAndClick(advancedPageElements.resetAccountButton);
    await puppeteer.waitAndClick(resetAccountModalElements.resetButton);
    await puppeteer.waitAndClick(settingsPageElements.closeButton);
    await puppeteer.waitFor(mainPageElements.walletOverview);
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
    await puppeteer.metamaskWindow().waitForTimeout(3000);
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
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  acceptAccess: async () => {
    const notificationPage = await puppeteer.switchToMetamaskNotification();
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
  confirmTransaction: async () => {
    const isKovanTestnet = getNetwork().networkName === 'kovan';
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    const currentGasFee = await puppeteer.waitAndGetValue(
      confirmPageElements.gasFeeInput,
      notificationPage,
    );
    const newGasFee = isKovanTestnet
      ? '1'
      : (Number(currentGasFee) + 10).toString();
    await puppeteer.waitClearAndType(
      newGasFee,
      confirmPageElements.gasFeeInput,
      notificationPage,
    );
    // metamask reloads popup after changing a fee, you have to wait for this event otherwise transaction will fail
    await puppeteer.metamaskWindow().waitForTimeout(3000);
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
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  getWalletAddress: async () => {
    await puppeteer.waitAndClick(mainPageElements.optionsMenu.button);
    await puppeteer.waitAndClick(
      mainPageElements.optionsMenu.accountDetailsButton,
    );
    walletAddress = await puppeteer.waitAndGetValue(
      mainPageElements.accountModal.walletAddressInput,
    );
    await puppeteer.waitAndClick(mainPageElements.accountModal.closeButton);
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
        await module.exports.importFromPrivateKey(secretWordsOrPrivateKey);
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
