const log = require('debug')('synpress:metamask');
const playwright = require('./playwright');
const sleep = require('util').promisify(setTimeout);

const {
  onboardingWelcomePageElements,
  metametricsPageElements,
  firstTimeFlowImportPageElements,
  revealSeedPageElements,
  endOfFlowPageElements,
  pinExtensionPageElements,
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
  recipientPopupElements,
  addTokenPageElements,
} = require('../pages/metamask/notification-page');
const {
  settingsPageElements,
  advancedPageElements,
  experimentalSettingsPageElements,
  resetAccountModalElements,
  addNetworkPageElements,
} = require('../pages/metamask/settings-page');
const {
  confirmationPageElements,
} = require('../pages/metamask/confirmation-page');
const {
  setNetwork,
  addNetwork,
  findNetwork,
  checkNetworkAdded,
  getCurrentNetwork,
} = require('../helpers');

const PROVIDER = 'metamask';

let extensionId;
let extensionVersion;
let extensionHomeUrl;
let extensionSettingsUrl;
let extensionAdvancedSettingsUrl;
let extensionExperimentalSettingsUrl;
let extensionAddNetworkUrl;
let extensionNewAccountUrl;
let extensionImportAccountUrl;
let extensionImportTokenUrl;
let walletAddress;
let switchBackToCypressWindow;

const metamask = {
  async resetState() {
    log('Resetting state of metamask');
    extensionId = undefined;
    extensionVersion = undefined;
    extensionHomeUrl = undefined;
    extensionSettingsUrl = undefined;
    extensionAdvancedSettingsUrl = undefined;
    extensionExperimentalSettingsUrl = undefined;
    extensionAddNetworkUrl = undefined;
    extensionNewAccountUrl = undefined;
    extensionImportAccountUrl = undefined;
    extensionImportTokenUrl = undefined;
    walletAddress = undefined;
    switchBackToCypressWindow = undefined;
  },
  extensionId: () => {
    return extensionId;
  },
  extensionUrls: () => {
    return {
      extensionHomeUrl,
      extensionSettingsUrl,
      extensionAdvancedSettingsUrl,
      extensionExperimentalSettingsUrl,
      extensionAddNetworkUrl,
      extensionNewAccountUrl,
      extensionImportAccountUrl,
      extensionImportTokenUrl,
    };
  },
  walletAddress: () => {
    return walletAddress;
  },
  async goTo(url) {
    await Promise.all([
      playwright.windows(PROVIDER).waitForNavigation(),
      playwright.windows(PROVIDER).goto(url),
    ]);
    await playwright.waitUntilStable(PROVIDER);
  },
  async goToHome() {
    await module.exports.goTo(extensionHomeUrl);
  },
  async goToSettings() {
    await module.exports.goTo(extensionSettingsUrl);
  },
  async goToAdvancedSettings() {
    await module.exports.goTo(extensionAdvancedSettingsUrl);
  },
  async goToExperimentalSettings() {
    await module.exports.goTo(extensionExperimentalSettingsUrl);
  },
  async goToAddNetwork() {
    await module.exports.goTo(extensionAddNetworkUrl);
  },
  async goToNewAccount() {
    await module.exports.goTo(extensionNewAccountUrl);
  },
  async goToImportAccount() {
    await module.exports.goTo(extensionImportAccountUrl);
  },
  async goToImportToken() {
    await module.exports.goTo(extensionImportTokenUrl);
  },
  clearExtensionData: async () => {
    await playwright.clearExtensionData(PROVIDER);
  },
  async getExtensionDetails() {
    const metamaskExtensionData = (await playwright.getExtensionsData())
      .metamask;

    extensionId = metamaskExtensionData.id;
    extensionVersion = metamaskExtensionData.version;
    extensionHomeUrl = `chrome-extension://${extensionId}/home.html`;
    extensionSettingsUrl = `${extensionHomeUrl}#settings`;
    extensionAdvancedSettingsUrl = `${extensionSettingsUrl}/advanced`;
    extensionExperimentalSettingsUrl = `${extensionSettingsUrl}/experimental`;
    extensionAddNetworkUrl = `${extensionSettingsUrl}/networks/add-network`;
    extensionNewAccountUrl = `${extensionHomeUrl}#new-account`;
    extensionImportAccountUrl = `${extensionNewAccountUrl}/import`;
    extensionImportTokenUrl = `${extensionHomeUrl}#import-token`;

    return {
      extensionId,
      extensionVersion,
      extensionSettingsUrl,
      extensionAdvancedSettingsUrl,
      extensionExperimentalSettingsUrl,
      extensionAddNetworkUrl,
      extensionNewAccountUrl,
      extensionImportAccountUrl,
      extensionImportTokenUrl,
    };
  },
  async closePopupAndTooltips() {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise popup may not be detected properly and not closed
    await playwright.windows(PROVIDER).waitForTimeout(1000);

    let smartTxOptInBtn =
      '.mm-smart-transactions-opt-in-modal .mm-box--rounded-pill';
    if (
      (await playwright.windows(PROVIDER).locator(smartTxOptInBtn).count()) > 0
    ) {
      await playwright.waitAndClick(PROVIDER, smartTxOptInBtn);
    }

    if (
      (await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.popup.container)
        .count()) > 0
    ) {
      const popupBackground = playwright
        .windows(PROVIDER)
        .locator(mainPageElements.popup.background);
      const popupBackgroundBox = await popupBackground.boundingBox();
      await playwright
        .windows(PROVIDER)
        .mouse.click(popupBackgroundBox.x + 1, popupBackgroundBox.y + 1);
    }
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.tippyTooltip.closeButton)
        .count()) > 0
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.tippyTooltip.closeButton,
      );
    }
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.actionableMessage.closeButton)
        .count()) > 0
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.actionableMessage.closeButton,
      );
    }

    // Closes "You have switched to [network]" popup.
    // It appears if you connect to a new network for the first time.
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(recipientPopupElements.popupCloseButton)
        .count()) > 0
    ) {
      await playwright.waitAndClick(recipientPopupElements.popupCloseButton);
    }

    return true;
  },
  async closeModal() {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise modal may not be detected properly and not closed
    await playwright.windows(PROVIDER).waitForTimeout(1000);
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.connectedSites.modal)
        .count()) > 0
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.connectedSites.closeButton,
      );
    }
    return true;
  },
  async unlock(password) {
    await playwright.fixBlankPage(PROVIDER);
    await playwright.fixCriticalError(PROVIDER);
    await playwright.waitAndType(
      PROVIDER,
      unlockPageElements.passwordInput,
      password,
    );
    await playwright.waitAndClick(
      PROVIDER,
      unlockPageElements.unlockButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  async lock() {
    await playwright.fixBlankPage(PROVIDER);
    await playwright.fixCriticalError(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.accountMenu.button,
      await playwright.windows(PROVIDER),
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.accountMenu.lockButton,
      await playwright.windows(PROVIDER),
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  async optOutAnalytics() {
    await playwright.waitAndClick(
      PROVIDER,
      metametricsPageElements.optOutAnalyticsButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    return true;
  },
  async importWallet(secretWords, password) {
    await playwright.waitAndClick(
      PROVIDER,
      onboardingWelcomePageElements.importWalletButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.optOutAnalytics();
    // todo: add support for more secret words (15/18/21/24)
    for (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndType(
        PROVIDER,
        firstTimeFlowImportPageElements.secretWordsInput(index),
        word,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.confirmSecretRecoverPhraseButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndType(
      PROVIDER,
      firstTimeFlowImportPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      PROVIDER,
      firstTimeFlowImportPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.termsCheckbox,
    );
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.importButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      PROVIDER,
      endOfFlowPageElements.allDoneButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      PROVIDER,
      pinExtensionPageElements.nextTabButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      pinExtensionPageElements.doneButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  async createWallet(password) {
    await playwright.waitAndClick(
      PROVIDER,
      onboardingWelcomePageElements.createWalletButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.optOutAnalytics();
    await playwright.waitAndType(
      PROVIDER,
      firstTimeFlowImportPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      PROVIDER,
      firstTimeFlowImportPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.termsCheckbox,
    );
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.createButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      PROVIDER,
      revealSeedPageElements.remindLaterButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      revealSeedPageElements.skipBackupCheckbox,
    );
    await playwright.waitAndClick(
      PROVIDER,
      revealSeedPageElements.confirmSkipBackupButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      PROVIDER,
      endOfFlowPageElements.allDoneButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      PROVIDER,
      pinExtensionPageElements.nextTabButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      pinExtensionPageElements.doneButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  async importAccount(privateKey) {
    await switchToMetamaskIfNotActive();
    await module.exports.goToHome();
    await module.exports.closePopupAndTooltips();
    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(
      mainPageElements.accountMenu.addAccountButton,
    );
    await playwright.waitAndClickByText(
      mainPageElements.accountMenu.addNewAccountButton,
      'Import account',
    );
    await playwright.waitAndType(
      PROVIDER,
      mainPageElements.importAccount.input,
      privateKey,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.importAccount.importButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  },
  async createAccount(accountName) {
    await switchToMetamaskIfNotActive();
    await module.exports.goToHome();
    await module.exports.closePopupAndTooltips();
    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    await playwright.waitAndClick(
      mainPageElements.accountMenu.addAccountButton,
    );
    await playwright.waitAndClick(
      mainPageElements.accountMenu.addNewAccountButton,
    );
    if (accountName) {
      accountName = accountName.toLowerCase();
      await playwright.waitAndType(
        PROVIDER,
        mainPageElements.createAccount.input,
        accountName,
      );
    }
    const formErrorEl = await playwright.waitFor(
      PROVIDER,
      mainPageElements.createAccount.createAccountError,
    );
    const formErrorTxt = await formErrorEl.innerText();
    const accountExists =
      'This account name already exists' === formErrorTxt ||
      'This account name is reserved' === formErrorTxt;

    if (accountExists) {
      log(`[createAccount] ${formErrorTxt}`);
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.createAccount.cancelButton,
      );
    } else {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.createAccount.createButton,
      );
    }

    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return accountExists ? formErrorTxt : true;
  },
  async renameAccount(newAccountName) {
    await switchToMetamaskIfNotActive();

    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.accountDetailsButton,
    );

    await playwright.waitAndClick(mainPageElements.renameAccount.invokeInput);

    await playwright.waitClearAndType(
      newAccountName,
      mainPageElements.renameAccount.input,
    );

    const formErrorEl = await playwright.waitFor(
      PROVIDER,
      mainPageElements.renameAccount.error,
    );
    const formErrorTxt = await formErrorEl.innerText();
    const accountExists =
      'This account name already exists' === formErrorTxt ||
      'This account name is reserved' === formErrorTxt;

    if (accountExists) {
      log(`[createAccount] ${formErrorTxt}`);
    } else {
      await playwright.waitAndClick(
        mainPageElements.renameAccount.confirmButton,
      );
    }

    await playwright.waitAndClick(mainPageElements.accountModal.closeButton);
    await switchToCypressIfNotActive();
    return accountExists ? formErrorTxt : true;
  },
  async switchAccount(accountNameOrAccountNumber) {
    if (typeof accountNameOrAccountNumber === 'string') {
      accountNameOrAccountNumber = accountNameOrAccountNumber.toLowerCase();
    }
    await switchToMetamaskIfNotActive();
    // note: closePopupAndTooltips() is required after changing createAccount() to use direct urls (popup started appearing)
    // ^ this change also introduced 500ms delay for closePopupAndTooltips() function
    await module.exports.closePopupAndTooltips();
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.accountMenu.button,
    );
    if (typeof accountNameOrAccountNumber === 'number') {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.accountMenu.accountButton(accountNameOrAccountNumber),
      );
    } else {
      await playwright.waitAndClickByText(
        PROVIDER,
        mainPageElements.accountMenu.accountName,
        accountNameOrAccountNumber,
      );
    }
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  },
  async changeNetwork(network) {
    // check if network is available in presets
    if (typeof network === 'string') {
      network = await findNetwork(network);
    }

    // handle a case if network is already changed
    const currentNetwork = getCurrentNetwork();
    if (network === currentNetwork) {
      return false;
    }

    const networkAdded = await checkNetworkAdded(network);
    if (!networkAdded) {
      await module.exports.addNetwork(network);
      return true;
    }

    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.networkSwitcher.button,
    );

    await playwright.waitAndClickByText(
      PROVIDER,
      mainPageElements.networkSwitcher.dropdownMenuItem,
      metamaskPage,
    );
    await playwright.waitAndClick(`[data-testid*="${network.name}"]`);
    await playwright.waitForText(
      PROVIDER,
      mainPageElements.networkSwitcher.networkName,
      network.name,
    );

    await playwright.waitUntilStable();
    await module.exports.closePopupAndTooltips();
    // set network to currently active
    await setNetwork(network);
    await switchToCypressIfNotActive();
    return true;
  },
  async addNetwork(network) {
    // check if available in presets
    if (typeof network === 'string') {
      network = await findNetwork(network);
    }

    // backward compatibility with older synpress versions
    if (
      typeof network === 'object' &&
      (network.name || network.networkName) &&
      network.rpcUrl &&
      network.chainId &&
      network.symbol
    ) {
      network = {
        id: network.chainId,
        name: network.name || network.networkName,
        nativeCurrency: {
          symbol: network.symbol,
        },
        rpcUrls: {
          public: { http: [network.rpcUrl] },
          default: { http: [network.rpcUrl] },
        },
        testnet: network.isTestnet,
      };

      if (network.blockExplorer) {
        network.blockExplorers = {
          etherscan: { url: network.blockExplorer },
          default: { url: network.blockExplorer },
        };
      }
    }

    // dont add network if already present
    const networkAlreadyAdded = await checkNetworkAdded(network);
    if (networkAlreadyAdded) {
      await module.exports.changeNetwork(network);
      return false;
    }

    // add network to presets
    await addNetwork(network);

    await switchToMetamaskIfNotActive();

    await module.exports.goToAddNetwork();
    await playwright.waitAndType(
      PROVIDER,
      addNetworkPageElements.networkNameInput,
      network.name,
    );

    await playwright.waitAndType(
      PROVIDER,
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrls.default.http[0],
    );
    await playwright.waitAndType(
      PROVIDER,
      addNetworkPageElements.chainIdInput,
      network.id,
    );
    await playwright.waitAndType(
      addNetworkPageElements.symbolInput,
      network.nativeCurrency.symbol,
    );
    if (network.blockExplorer) {
      await playwright.waitAndType(
        PROVIDER,
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorers.default.url,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      addNetworkPageElements.saveButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(addNetworkPageElements.switchButton);
    await module.exports.closePopupAndTooltips();
    await playwright.waitForText(
      PROVIDER,
      mainPageElements.networkSwitcher.networkName,
      network.name,
    );
    // set as currently active network
    await setNetwork(network);
    await switchToCypressIfNotActive();
    return true;
  },
  async disconnectWalletFromDapp() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.button,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.connectedSites.disconnectLabel)
        .count()) > 0
    ) {
      console.log(
        '[disconnectWalletFromDapp] Wallet is connected to a dapp, disconnecting..',
      );
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.connectedSites.disconnectLabel,
      );
      await playwright.waitAndClick(
        PROVIDER,
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
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.button,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    const disconnectLabels = await playwright
      .windows(PROVIDER)
      .$$(mainPageElements.connectedSites.disconnectLabel);
    if (disconnectLabels.length) {
      console.log(
        '[disconnectWalletFromAllDapps] Wallet is connected to dapps, disconnecting..',
      );
      // eslint-disable-next-line no-unused-vars
      for (const disconnectLabel of disconnectLabels) {
        await playwright.waitAndClick(
          PROVIDER,
          mainPageElements.connectedSites.disconnectLabel,
        );
        await playwright.waitAndClick(
          PROVIDER,
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
  async activateShowHexData(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.showHexDataToggleOn,
      advancedPageElements.showHexDataToggleOff,
      skipSetup,
    );
  },
  async activateTestnetConversion(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.showTestnetConversionOn,
      advancedPageElements.showTestnetConversionOff,
      skipSetup,
    );
  },
  async activateShowTestnetNetworks(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.showTestnetNetworksOn,
      advancedPageElements.showTestnetNetworksOff,
      skipSetup,
    );
  },
  async activateCustomNonce(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.customNonceToggleOn,
      advancedPageElements.customNonceToggleOff,
      skipSetup,
    );
  },
  async activateDismissBackupReminder(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.dismissBackupReminderOn,
      advancedPageElements.dismissBackupReminderOff,
      skipSetup,
    );
  },
  async activateEthSignRequests(skipSetup) {
    return await activateAdvancedSetting(
      advancedPageElements.ethSignRequestsToggleOn,
      advancedPageElements.ethSignRequestsToggleOff,
      skipSetup,
    );
  },
  async activateImprovedTokenAllowance(skipSetup) {
    return await activateAdvancedSetting(
      experimentalSettingsPageElements.improvedTokenAllowanceToggleOn,
      experimentalSettingsPageElements.improvedTokenAllowanceToggleOff,
      skipSetup,
      true,
    );
  },
  async resetAccount() {
    await switchToMetamaskIfNotActive();
    await module.exports.goToAdvancedSettings();
    await playwright.waitAndClick(
      PROVIDER,
      advancedPageElements.resetAccountButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      resetAccountModalElements.resetButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      settingsPageElements.closeButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  },
  async confirmSignatureRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    if (
      (await playwright
        .notificationwindows(PROVIDER)
        .locator(signaturePageElements.signatureRequestScrollDownButton)
        .count()) > 0
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        signaturePageElements.signatureRequestScrollDownButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      signaturePageElements.confirmSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectSignatureRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      signaturePageElements.rejectSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async confirmDataSignatureRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    if (
      (await playwright
        .notificationwindows(PROVIDER)
        .locator(signaturePageElements.signatureRequestScrollDownButton)
        .count()) > 0
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        signaturePageElements.signatureRequestScrollDownButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      dataSignaturePageElements.confirmDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectDataSignatureRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      dataSignaturePageElements.rejectDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async importToken(tokenConfig) {
    let tokenData = {};
    await switchToMetamaskIfNotActive();
    await module.exports.goToHome();
    await module.exports.closePopupAndTooltips();
    await playwright.waitAndClick(mainPageElements.importToken.tokenTab);
    await playwright.waitAndClick(mainPageElements.importToken.button);
    if (typeof tokenConfig === 'string') {
      await playwright.waitAndType(
        PROVIDER,
        mainPageElements.importToken.tokenContractAddressInput,
        tokenConfig,
      );
      tokenData.tokenContractAddress = tokenConfig;
      tokenData.tokenSymbol = await playwright.waitAndGetInputValue(
        mainPageElements.importToken.tokenSymbolInput,
      );
    } else {
      await playwright.waitAndType(
        PROVIDER,
        mainPageElements.importToken.tokenContractAddressInput,
        tokenConfig.address,
      );
      tokenData.tokenContractAddress = tokenConfig.address;
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.importToken.tokenEditButton,
        await playwright.windows(PROVIDER),
        {
          force: true,
        },
      );
      await playwright.waitClearAndType(
        tokenConfig.symbol,
        mainPageElements.importToken.tokenSymbolInput,
      );
      tokenData.tokenSymbol = tokenConfig.symbol;
    }
    tokenData.tokenDecimals = await playwright.waitAndGetInputValue(
      mainPageElements.importToken.tokenDecimalInput,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.importToken.addCustomTokenButton,
      await playwright.windows(PROVIDER),
    );
    await playwright.waitAndClick(
      mainPageElements.importToken.confirmImportTokenContent,
      await playwright.windows(PROVIDER),
    );
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    tokenData.imported = true;
    return tokenData;
  },
  async confirmAddToken() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      addTokenPageElements.confirmAddTokenButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectAddToken() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      addTokenPageElements.rejectAddTokenButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async confirmPermissionToSpend({
    spendLimit,
    shouldWaitForPopupClosure = false,
  } = {}) {
    const notificationPage = playwright.switchToNotification(PROVIDER);
    // experimental mode on
    if (
      (await playwright
        .notificationwindows(PROVIDER)
        .locator(notificationPageElements.customSpendingLimitInput)
        .count()) > 0
    ) {
      if (spendLimit) {
        await playwright.waitAndSetValue(
          spendLimit,
          notificationPageElements.customSpendingLimitInput,
          notificationPage,
        );
      }
      await playwright.waitAndClick(
        PROVIDER,
        notificationPageElements.allowToSpendButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      notificationPageElements.allowToSpendButton,
      notificationPage,
      shouldWaitForPopupClosure ? undefined : { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectPermissionToSpend() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      notificationPageElements.rejectToSpendButton,
      notificationPage,
    );
    return true;
  },
  async acceptAccess(options) {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    if (options && options.allAccounts) {
      await playwright.waitAndClick(
        PROVIDER,
        notificationPageElements.selectAllCheckbox,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      PROVIDER,
      notificationPageElements.nextButton,
      notificationPage,
      { waitForEvent: 'navi' },
    );

    if (options && options.signInSignature) {
      log(
        [
          '[deprecation-warning]: `options.signInSignature` is no longer used will be deprecated soon',
          'Use `options.confirmSignatureRequest` or `options.confirmDataSignatureRequest`',
        ].join('\n'),
      );
    }

    if (
      options &&
      (options.signInSignature || options.confirmSignatureRequest)
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        permissionsPageElements.connectButton,
        notificationPage,
        { waitForEvent: 'navi' },
      );
      await module.exports.confirmSignatureRequest();
      return true;
    }

    if (options && options.confirmDataSignatureRequest) {
      await playwright.waitAndClick(
        PROVIDER,
        permissionsPageElements.connectButton,
        notificationPage,
        { waitForEvent: 'navi' },
      );
      await module.exports.confirmDataSignatureRequest();
      return true;
    }

    if (options && options.switchNetwork) {
      await playwright.waitAndClick(
        permissionsPageElements.connectButton,
        notificationPage,
        { waitForEvent: 'navi' },
      );
      await playwright.waitAndClick(
        confirmationPageElements.footer.approveButton,
        notificationPage,
        { waitForEvent: 'close' },
      );
      return true;
    }

    await playwright.waitAndClick(
      permissionsPageElements.connectButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectAccess() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      notificationPageElements.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async confirmTransaction({
    gasConfig,
    shouldWaitForPopupClosure = false,
  } = {}) {
    let txData = {};
    const notificationPage = await playwright.switchToNotification(PROVIDER);

    await proceedAnyway();

    if (gasConfig) {
      log(
        '[confirmTransaction] gasConfig is present, determining transaction type..',
      );
      if (
        (await playwright
          .notificationwindows(PROVIDER)
          .locator(confirmPageElements.editGasFeeLegacyButton)
          .count()) > 0
      ) {
        log('[confirmTransaction] Looks like legacy tx');
        if (typeof gasConfig === 'object') {
          log('[confirmTransaction] Editing legacy tx..');
          await playwright.waitAndClick(
            PROVIDER,
            confirmPageElements.editGasFeeLegacyButton,
            notificationPage,
          );
          if (
            (await playwright
              .notificationwindows(PROVIDER)
              .locator(confirmPageElements.editGasFeeLegacyOverrideAckButton)
              .count()) > 0
          ) {
            log(
              '[confirmTransaction] Override acknowledgement modal is present, closing..',
            );
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.editGasFeeLegacyOverrideAckButton,
              notificationPage,
            );
          }
          if (gasConfig.gasLimit) {
            log('[confirmTransaction] Changing gas limit..');
            await playwright.waitAndSetValue(
              gasConfig.gasLimit.toString(),
              confirmPageElements.gasLimitLegacyInput,
              notificationPage,
            );
          }
          if (gasConfig.gasPrice) {
            log('[confirmTransaction] Changing gas price..');
            await playwright.waitAndSetValue(
              gasConfig.gasPrice.toString(),
              confirmPageElements.gasPriceLegacyInput,
              notificationPage,
            );
          }
          await playwright.waitAndClick(
            PROVIDER,
            confirmPageElements.saveCustomGasFeeButton,
            notificationPage,
          );
        } else {
          log(
            "[confirmTransaction] Legacy tx doesn't support eip-1559 fees (low, market, aggressive, site), using default values..",
          );
        }
      } else {
        log('[confirmTransaction] Looks like eip-1559 tx');
        await playwright.waitAndClick(
          PROVIDER,
          confirmPageElements.editGasFeeButton,
          notificationPage,
        );
        if (typeof gasConfig === 'string') {
          if (gasConfig === 'low') {
            log('[confirmTransaction] Changing gas fee to low..');
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.gasOptionLowButton,
              notificationPage,
            );
          } else if (gasConfig === 'market') {
            log('[confirmTransaction] Changing gas fee to market..');
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.gasOptionMediumButton,
              notificationPage,
            );
          } else if (gasConfig === 'aggressive') {
            log('[confirmTransaction] Changing gas fee to aggressive..');
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.gasOptionHighButton,
              notificationPage,
            );
          } else if (gasConfig === 'site') {
            log('[confirmTransaction] Changing gas fee to site suggested..');
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.gasOptionDappSuggestedButton,
              notificationPage,
            );
          }
        } else {
          log('[confirmTransaction] Editing eip-1559 tx..');
          await playwright.waitAndClick(
            PROVIDER,
            confirmPageElements.gasOptionCustomButton,
            notificationPage,
          );
          if (gasConfig.gasLimit) {
            log('[confirmTransaction] Changing gas limit..');
            await playwright.waitAndClick(
              PROVIDER,
              confirmPageElements.editGasLimitButton,
              notificationPage,
            );
            await playwright.waitAndSetValue(
              gasConfig.gasLimit.toString(),
              confirmPageElements.gasLimitInput,
              notificationPage,
            );
          }
          if (gasConfig.baseFee) {
            log('[confirmTransaction] Changing base fee..');
            await playwright.waitAndSetValue(
              gasConfig.baseFee.toString(),
              confirmPageElements.baseFeeInput,
              notificationPage,
            );
          }
          if (gasConfig.priorityFee) {
            log('[confirmTransaction] Changing priority fee..');
            await playwright.waitAndSetValue(
              gasConfig.priorityFee.toString(),
              confirmPageElements.priorityFeeInput,
              notificationPage,
            );
          }
          await playwright.waitAndClick(
            PROVIDER,
            confirmPageElements.saveAdvanceCustomGasFeeButton,
            notificationPage,
          );
        }
      }
    }
    log('[confirmTransaction] Checking if recipient address is present..');
    if (
      (await playwright
        .notificationwindows(PROVIDER)
        .locator(confirmPageElements.recipientButton)
        .count()) > 0
    ) {
      log('[confirmTransaction] Getting recipient address..');

      const tooltip = await playwright.waitAndGetAttributeValue(
        PROVIDER,
        confirmPageElements.recipientAddressTooltipContainerButton,
        'aria-describedby',
        notificationPage,
        true,
      );

      // Handles the case where the recipient address is saved and has a "nickname".
      if (tooltip === 'tippy-tooltip-2') {
        txData.recipientPublicAddress = await playwright.waitAndGetValue(
          confirmPageElements.recipientButton,
          notificationPage,
        );
      } else {
        await playwright.waitAndClick(
          confirmPageElements.recipientButton,
          notificationPage,
        );
        txData.recipientPublicAddress = await playwright.waitAndGetInputValue(
          recipientPopupElements.recipientPublicAddress,
          notificationPage,
        );
        await playwright.waitAndClick(
          recipientPopupElements.popupCloseButton,
          notificationPage,
        );
      }
    }
    log('[confirmTransaction] Checking if network name is present..');
    if (
      (await playwright
        .notificationwindows(PROVIDER)
        .locator(confirmPageElements.networkLabel)
        .count()) > 0
    ) {
      log('[confirmTransaction] Getting network name..');
      txData.networkName = await playwright.waitAndGetValue(
        PROVIDER,
        confirmPageElements.networkLabel,
        notificationPage,
      );
    }
    // todo: handle setting of custom nonce here
    log('[confirmTransaction] Getting transaction nonce..');
    txData.customNonce = await playwright.waitAndGetAttributeValue(
      PROVIDER,
      confirmPageElements.customNonceInput,
      'placeholder',
      notificationPage,
    );
    // todo: fix getting tx data on function multicall
    // log('[confirmTransaction] Checking if tx data is present..');
    // if (
    //   await playwright
    //     .windows(PROVIDER)
    //     .locator(confirmPageElements.dataButton)
    //     .count() > 0
    // ) {
    //   log('[confirmTransaction] Fetching tx data..');
    //   await playwright.waitAndClick(PROVIDER,
    //     confirmPageElements.dataButton,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting origin value..');
    //   txData.origin = await playwright.waitAndGetValue(PROVIDER,
    //     confirmPageElements.originValue,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting bytes value..');
    //   txData.bytes = await playwright.waitAndGetValue(PROVIDER,
    //     confirmPageElements.bytesValue,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting hex data value..');
    //   txData.hexData = await playwright.waitAndGetValue(PROVIDER,
    //     confirmPageElements.hexDataValue,
    //     notificationPage,
    //   );
    //   await playwright.waitAndClick(PROVIDER,
    //     confirmPageElements.detailsButton,
    //     notificationPage,
    //   );
    // }

    await proceedAnyway();

    log('[confirmTransaction] Confirming transaction..');
    await playwright.waitAndClick(
      PROVIDER,
      confirmPageElements.confirmButton,
      notificationPage,
      shouldWaitForPopupClosure ? undefined : { waitForEvent: 'close' },
    );
    txData.confirmed = true;
    log('[confirmTransaction] Transaction confirmed!');
    return txData;

    async function proceedAnyway() {
      // click on i want to proceed anyway when transaction gas estimation error is thrown
      let proceedAnywayButton1 =
        'div.transaction-detail > div > div > div > div > button';
      let proceedAnywayButton2 =
        'div.transaction-alerts > div.mm-box.mm-banner-base.mm-banner-alert.mm-banner-alert--severity-danger.mm-box--padding-3.mm-box--padding-left-2.mm-box--display-flex.mm-box--gap-2.mm-box--background-color-error-muted.mm-box--rounded-sm > div > button';

      if (
        (await playwright
          .metamaskNotificationWindow()
          .locator(proceedAnywayButton1)
          .count()) > 0
      ) {
        await playwright.waitAndClick(proceedAnywayButton1, notificationPage);
      }
      if (
        (await playwright
          .metamaskNotificationWindow()
          .locator(proceedAnywayButton2)
          .count()) > 0
      ) {
        await playwright.waitAndClick(proceedAnywayButton2, notificationPage);
      }
    }
  },
  async confirmTransactionAndWaitForMining(gasConfig) {
    // Before we switch to MetaMask tab we have to make sure the notification window has opened.
    //
    // Chaining `confirmTransactionAndWaitForMining` results in quick tabs switching
    // which breaks MetaMask and the notification window does not open
    // until we switch back to the "Cypress" tab.
    await playwright.switchToNotification(PROVIDER);

    await switchToMetamaskIfNotActive();
    await playwright
      .windows(PROVIDER)
      .locator(mainPageElements.tabs.activityButton)
      .click();

    let retries = 0;
    const retiresLimit = 600;

    // 120 seconds
    while (retries < retiresLimit) {
      const unapprovedTxs = await playwright
        .windows(PROVIDER)
        .getByText('Unapproved')
        .count();
      if (unapprovedTxs === 1) {
        break;
      }
      await sleep(200);
      retries++;
    }

    if (retries === retiresLimit) {
      throw new Error(
        'New unapproved transaction was not detected in 120 seconds.',
      );
    }

    const txData = await module.exports.confirmTransaction(gasConfig);

    // 120 seconds
    while (retries < retiresLimit) {
      const pendingTxs = await playwright
        .windows(PROVIDER)
        .getByText('Pending')
        .count();
      const queuedTxs = await playwright
        .windows(PROVIDER)
        .getByText('Queued')
        .count();
      if (pendingTxs === 0 && queuedTxs === 0) {
        break;
      }
      await sleep(200);
      retries++;
    }

    if (retries === retiresLimit) {
      throw new Error('Transaction was not mined in 120 seconds.');
    }

    await switchToCypressIfNotActive();

    log('[confirmTransactionAndWaitForMining] Transaction confirmed!');
    return txData;
  },
  async rejectTransaction() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      confirmPageElements.rejectButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async openTransactionDetails(txIndex) {
    await switchToMetamaskIfNotActive();
    await playwright
      .windows(PROVIDER)
      .locator(mainPageElements.tabs.activityButton)
      .click();

    let visibleTxs = await playwright
      .windows(PROVIDER)
      .locator(
        `${mainPageElements.activityTab.completedTransactionsList} > div`,
      )
      .filter({
        has: playwright.windows(PROVIDER).locator('div.transaction-list-item'),
      })
      .all();
    while (txIndex >= visibleTxs.length) {
      try {
        await playwright
          .windows(PROVIDER)
          .locator(
            `${mainPageElements.activityTab.completedTransactionsList} > div`,
          )
          .click();
      } catch (error) {
        log('[openTransactionDetails] Clicking "View more" failed!');
        throw new Error(
          `Transaction with index ${txIndex} is not found. There are only ${visibleTxs.length} transactions.`,
        );
      }

      visibleTxs = await playwright
        .windows(PROVIDER)
        .locator(
          `${mainPageElements.activityTab.completedTransactionsList} > div`,
        )
        .filter({
          has: playwright.windows(PROVIDER).locator('div.list-item__heading'),
        })
        .all();
    }

    await visibleTxs[txIndex].click();

    await playwright
      .windows(PROVIDER)
      .locator(mainPageElements.popup.container)
      .waitFor({ state: 'visible', timeout: 10000 });

    return true;
  },
  async closeTransactionDetailsPopup() {
    await switchToMetamaskIfNotActive();
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  },
  async confirmEncryptionPublicKeyRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      encryptionPublicKeyPageElements.confirmEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectEncryptionPublicKeyRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      encryptionPublicKeyPageElements.rejectEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async confirmDecryptionRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      decryptPageElements.confirmDecryptionRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectDecryptionRequest() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      decryptPageElements.rejectDecryptionRequestButton,
      notificationPage,
    );
    return true;
  },
  async confirmPermissionToApproveAll() {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
    );
    await playwright.waitAndClick(
      notificationPageElements.approveWarningToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectPermissionToApproveAll() {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
    );
    await playwright.waitAndClick(
      notificationPageElements.rejectWarningToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async confirmRevokePermissionToAll() {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async rejectRevokePermissionToAll() {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.rejectToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async allowToAddNetwork({ waitForEvent } = {}) {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    if (waitForEvent) {
      await playwright.waitAndClick(
        PROVIDER,
        confirmationPageElements.footer.approveButton,
        notificationPage,
        { waitForEvent },
      );
    } else {
      await playwright.waitAndClick(
        PROVIDER,
        confirmationPageElements.footer.approveButton,
        notificationPage,
      );
    }
    return true;
  },
  async rejectToAddNetwork() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async allowToSwitchNetwork() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      confirmationPageElements.footer.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );

    // TODO: Add test for the new network popup. Requires changes to the MetaMask Test Dapp.
    await module.exports.closePopupAndTooltips();

    return true;
  },
  async rejectToSwitchNetwork() {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  async allowToAddAndSwitchNetwork() {
    await module.exports.allowToAddNetwork();
    await module.exports.allowToSwitchNetwork();
    return true;
  },
  async getWalletAddress() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.button,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.optionsMenu.accountDetailsButton,
    );
    walletAddress = await playwright.waitAndGetValue(
      PROVIDER,
      mainPageElements.accountModal.walletAddressInput,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.accountModal.closeButton,
    );
    await switchToCypressIfNotActive();
    return walletAddress;
  },
  async initialSetup(
    playwrightInstance,
    {
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    },
  ) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }
    await playwright.assignWindows(PROVIDER);
    await playwright.assignActiveTabName(PROVIDER);
    await module.exports.getExtensionDetails();
    await playwright.fixBlankPage(PROVIDER, playwright.windows(PROVIDER));
    await playwright.switchToWindow(PROVIDER);
    await playwright.fixCriticalError(PROVIDER, playwright.windows(PROVIDER));

    if (
      (await playwright
        .windows(PROVIDER)
        .locator(onboardingWelcomePageElements.onboardingWelcomePage)
        .count()) > 0
    ) {
      // check terms checkbox
      await playwright.waitAndClick(
        PROVIDER,
        onboardingWelcomePageElements.onboardingTermsCheckbox,
      );
      if (secretWordsOrPrivateKey.includes(' ')) {
        // secret words
        await module.exports.importWallet(secretWordsOrPrivateKey, password);
      } else {
        // private key
        await module.exports.createWallet(password);
        await module.exports.importAccount(secretWordsOrPrivateKey);
      }

      await setupSettings(enableAdvancedSettings, enableExperimentalSettings);
      await module.exports.changeNetwork(network);

      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else if (
      (await playwright
        .windows(PROVIDER)
        .locator(unlockPageElements.passwordInput)
        .count()) > 0
    ) {
      await module.exports.unlock(password);
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else {
      if (
        (await playwright
          .windows(PROVIDER)
          .locator(mainPageElements.walletOverview)
          .count()) > 0 &&
        !process.env.RESET_METAMASK
      ) {
        await switchToMetamaskIfNotActive();
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
    await playwright.switchToWindow(PROVIDER);
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

async function activateAdvancedSetting(
  toggleOn,
  toggleOff,
  skipSetup,
  experimental,
) {
  if (!skipSetup) {
    await switchToMetamaskIfNotActive();
    if (experimental) {
      await metamask.goToExperimentalSettings();
    } else {
      await metamask.goToAdvancedSettings();
    }
  }
  if ((await playwright.windows(PROVIDER).locator(toggleOn).count()) === 0) {
    await playwright.waitAndClick(PROVIDER, toggleOff);
  }
  if (!skipSetup) {
    await playwright.waitAndClick(
      PROVIDER,
      settingsPageElements.closeButton,
      await playwright.windows(PROVIDER),
      {
        waitForEvent: 'navi',
      },
    );
    await metamask.closePopupAndTooltips();
    await switchToCypressIfNotActive();
  }
  return true;
}

async function setupSettings(
  enableAdvancedSettings,
  enableExperimentalSettings,
) {
  await switchToMetamaskIfNotActive();
  await metamask.goToAdvancedSettings();
  await metamask.activateShowHexData(true);

  // metamask < v11
  if (
    (await playwright
      .windows(PROVIDER)
      .locator(advancedPageElements.showTestnetNetworksOn)
      .count()) > 0
  ) {
    await metamask.activateShowTestnetNetworks(true);
  }
  await metamask.activateCustomNonce(true);
  await metamask.activateDismissBackupReminder(true);
  if (enableAdvancedSettings) {
    // metamask < v11
    if (
      (await playwright
        .windows(PROVIDER)
        .locator(advancedPageElements.showTestnetConversionOn)
        .count()) > 0
    ) {
      await metamask.activateTestnetConversion(true);
    }
  }
  if (enableExperimentalSettings) {
    await metamask.goToExperimentalSettings();
    await metamask.activateImprovedTokenAllowance(true);
  }
  await playwright.waitAndClick(
    PROVIDER,
    settingsPageElements.closeButton,
    await playwright.windows(PROVIDER),
    {
      waitForEvent: 'navi',
    },
  );
  await metamask.closePopupAndTooltips();
  await switchToCypressIfNotActive();
  return true;
}

module.exports = metamask;
