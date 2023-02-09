const log = require('debug')('synpress:phantom');
const playwright = require('./playwright');

const {
  welcomePageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  firstTimeFlowImportPageElements,
  firstTimeFlowCreatePagePageElements,
  secureYourWalletPageElements,
  revealSeedPageElements,
} = require('../pages/phantom/first-time-flow-page');
const { mainPageElements } = require('../pages/phantom/main-page');
const { unlockPageElements } = require('../pages/phantom/unlock-page');
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
  buttons,
  transactionPageElements,
  menu,
  incorrectModePageElements,
} = require('../pages/phantom/notification-page');
const {
  settingsPageElements,
  advancedPageElements,
  experimentalSettingsPageElements,
  resetAccountModalElements,
  addNetworkPageElements,
} = require('../pages/phantom/settings-page');
const {
  confirmationPageElements,
} = require('../pages/phantom/confirmation-page');
const { setNetwork } = require('../helpers');

let extensionInitialUrl;
let extensionId;
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
  goTo: async url => {
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(url),
    ]);
    await playwright.waitUntilStable();
  },
  goToHome: async () => {
    await module.exports.goTo(extensionHomeUrl);
  },
  goToSettings: async () => {
    await module.exports.goTo(extensionSettingsUrl);
  },
  goToAdvancedSettings: async () => {
    await module.exports.goTo(extensionAdvancedSettingsUrl);
  },
  goToExperimentalSettings: async () => {
    await module.exports.goTo(extensionExperimentalSettingsUrl);
  },
  goToAddNetwork: async () => {
    await module.exports.goTo(extensionAddNetworkUrl);
  },
  goToNewAccount: async () => {
    await module.exports.goTo(extensionNewAccountUrl);
  },
  goToImportAccount: async () => {
    await module.exports.goTo(extensionImportAccountUrl);
  },
  goToImportToken: async () => {
    await module.exports.goTo(extensionImportTokenUrl);
  },
  getExtensionDetails: async () => {
    extensionInitialUrl = await playwright.metamaskWindow().url();
    extensionId = extensionInitialUrl.match('//(.*?)/')[1];
    extensionHomeUrl = `chrome-extension://${extensionId}/notification.html`;
    extensionSettingsUrl = `${extensionHomeUrl}#settings`;
    extensionAdvancedSettingsUrl = `${extensionSettingsUrl}/advanced`;
    extensionExperimentalSettingsUrl = `${extensionSettingsUrl}/experimental`;
    extensionAddNetworkUrl = `${extensionSettingsUrl}/networks/add-network`;
    extensionNewAccountUrl = `${extensionHomeUrl}#new-account`;
    extensionImportAccountUrl = `${extensionNewAccountUrl}/import`;
    extensionImportTokenUrl = `${extensionHomeUrl}#import-token`;

    return {
      extensionInitialUrl,
      extensionId,
      extensionSettingsUrl,
      extensionAdvancedSettingsUrl,
      extensionExperimentalSettingsUrl,
      extensionAddNetworkUrl,
      extensionNewAccountUrl,
      extensionImportAccountUrl,
      extensionImportTokenUrl,
    };
  },
  // Phantom doesn't need this, it's well coded :)
  fixBlankPage: async () => {
    return;
  },
  acceptAccess: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(buttons.primaryButton, notificationPage);
    return true;
  },
  importWallet: async (secretWords, password) => {
    await playwright.waitAndClick(firstTimeFlowPageElements.importWalletButton);

    // STEP: Input mnemonic words and click Import
    // todo: add support for more secret words (15/18/21/24)
    for (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndType(
        firstTimeFlowImportPageElements.secretWordsInput(index),
        word,
      );
    }
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.confirmWordsButton,
    );

    // STEP: Wait for confirm input
    // shortcut confirmation
    await new Promise(resolve => setTimeout(resolve, 200)); // the transitioning is too fast
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.confirmWordsButton,
      // 'button:text("Import Selected Accounts")',
    );

    // STEP: Input password, confirm and continue
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.termsCheckbox,
    );
    // continue to next screen
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.continueAfterPasswordButton,
    );
    // shortcut confirmation
    await new Promise(resolve => setTimeout(resolve, 500)); // the transitioning is too fast
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.continueOnShortcutConfirm,
    );
    // finish
    await new Promise(resolve => setTimeout(resolve, 500)); // the transitioning is too fast
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.continueOnShortcutConfirm,
    );
    return true;
  },
  closePopupAndTooltips: async () => {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise popup may not be detected properly and not closed
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.popup.container)
        .isVisible()
    ) {
      const popupBackground = playwright
        .metamaskWindow()
        .locator(mainPageElements.popup.background);
      const popupBackgroundBox = await popupBackground.boundingBox();
      await playwright
        .metamaskWindow()
        .mouse.click(popupBackgroundBox.x + 1, popupBackgroundBox.y + 1);
    }
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.tippyTooltip.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(mainPageElements.tippyTooltip.closeButton);
    }
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.actionableMessage.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        mainPageElements.actionableMessage.closeButton,
      );
    }
    return true;
  },
  getWalletAddress: async () => {
    await switchToPhantomIfNotActive();
    await playwright.metamaskWindow().hover(mainPageElements.accountBar.title);
    await new Promise(resolve => setTimeout(resolve, 100));
    await playwright.waitAndClick(mainPageElements.accountBar.ethRow);
    walletAddress = await playwright
      .metamaskWindow()
      .evaluate('navigator.clipboard.readText()');
    await switchToCypressIfNotActive();
    return walletAddress;
  },
  initialSetup: async ({
    secretWordsOrPrivateKey,
    network,
    password,
    enableAdvancedSettings,
  }) => {
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
      await playwright
        .metamaskWindow()
        .locator(firstTimeFlowPageElements.importWalletButton)
        .isVisible()
    ) {
      /**
       * SEED PHRASE IMPORT
       */
      if (secretWordsOrPrivateKey.includes(' ')) {
        // secret words
        await module.exports.importWallet(secretWordsOrPrivateKey, password);
      }

      await switchToPhantomIfNotActive();

      // skip what's new header
      if (
        await playwright
          .metamaskWindow()
          .locator(mainPageElements.whatsNew.header)
      ) {
        await playwright
          .metamaskWindow()
          .click(mainPageElements.whatsNew.continueButton);
      }
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else if (
      /**
       * PASSWORD UNLOCK
       */
      await playwright
        .metamaskWindow()
        .locator(unlockPageElements.passwordInput)
        .isVisible()
    ) {
      await module.exports.unlock(password);
      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else {
      if (
        (await playwright
          .metamaskWindow()
          .locator(mainPageElements.walletOverview)
          .isVisible()) &&
        !process.env.RESET_PHANTOM
      ) {
        await switchToPhantomIfNotActive();
        walletAddress = await module.exports.getWalletAddress();
        await playwright.switchToCypressWindow();
        return true;
      } else {
        // todo: reset phantom state
      }
    }
  },
  confirmSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.buttons.confirmSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectSignatureRequest: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.buttons.rejectSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmTransaction: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      transactionPageElements.buttons.rejectSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmIncorrectNetworkStage: async () => {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      incorrectModePageElements.buttons.close,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  unlock: async password => {
    await playwright.waitAndType(unlockPageElements.passwordInput, password);
    await playwright.waitAndClick(
      unlockPageElements.unlockButton,
      await playwright.metamaskWindow(),
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  lock: async () => {
    await playwright.waitAndClick(
      menu.buttons.settings,
      await playwright.metamaskWindow(),
    );
    await playwright.waitAndClick(
      menu.buttons.sidebar.settings,
      await playwright.metamaskWindow(),
    );
    await playwright.waitAndClick(
      settingsPageElements.buttons.lockWallet,
      await playwright.metamaskWindow(),
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
};

async function switchToPhantomIfNotActive() {
  await playwright.switchToMetamaskWindow();
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
