const log = require('debug')('synpress:phantom');
const playwright = require('./playwright');

const {
  firstTimeFlowPageElements,
  firstTimeFlowImportPageElements,
} = require('../pages/phantom/first-time-flow-page');
const { mainPageElements } = require('../pages/phantom/main-page');
const { unlockPageElements } = require('../pages/phantom/unlock-page');
const {
  signaturePageElements,
  buttons,
  transactionPageElements,
  menu,
  incorrectModePageElements,
  app,
} = require('../pages/phantom/notification-page');
const { settingsPageElements } = require('../pages/phantom/settings-page');
const { selectWalletElements } = require('../pages/phantom/select-wallet-page');

const PROVIDER = 'phantom';

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
      playwright.windows(PROVIDER).waitForNavigation(),
      playwright.windows(PROVIDER).goto(url),
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
  clearExtensionData: async () => {
    await playwright.clearExtensionData(PROVIDER);
  },
  getExtensionDetails: async () => {
    extensionInitialUrl = await playwright.windows(PROVIDER).url();
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
  acceptAccess: async () => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      buttons.primaryButton,
      notificationPage,
    );
    return true;
  },
  importWallet: async (secretWords, password) => {
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowPageElements.importWalletButton,
    );
    // STEP: Input mnemonic words and click Import
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
      firstTimeFlowImportPageElements.confirmWordsButton,
    );

    // STEP: Wait for confirm input
    // shortcut confirmation
    await new Promise(resolve => setTimeout(resolve, 200)); // the transitioning is too fast
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.confirmWordsButton,
      // 'button:text("Import Selected Accounts")',
    );

    // STEP: Input password, confirm and continue
    await new Promise(resolve => setTimeout(resolve, 1000)); // the transitioning is too fast
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
    // continue to next screen
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.continueAfterPasswordButton,
    );
    // shortcut confirmation
    await new Promise(resolve => setTimeout(resolve, 1000)); // the transitioning is too fast
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.continueOnShortcutConfirm,
    );
    // finish
    await new Promise(resolve => setTimeout(resolve, 1000)); // the transitioning is too fast
    await playwright.waitAndClick(
      PROVIDER,
      firstTimeFlowImportPageElements.continueOnShortcutConfirm,
    );
    return true;
  },
  closePopupAndTooltips: async () => {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise popup may not be detected properly and not closed
    await playwright.windows(PROVIDER).waitForTimeout(1000);
    if (
      await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.popup.container)
        .isVisible()
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
      await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.tippyTooltip.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.tippyTooltip.closeButton,
      );
    }
    if (
      await playwright
        .windows(PROVIDER)
        .locator(mainPageElements.actionableMessage.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.actionableMessage.closeButton,
      );
    }
    return true;
  },
  getWalletAddress: async (chain = 'eth') => {
    await switchToPhantomIfNotActive();
    await playwright.windows(PROVIDER).hover(mainPageElements.accountBar.title);
    await new Promise(resolve => setTimeout(resolve, 100));

    if (chain === 'eth') {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.accountBar.ethRow,
      );
    } else if (chain === 'solana') {
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.accountBar.solanaRow,
      );
    }

    walletAddress = await playwright
      .windows(PROVIDER)
      .evaluate('navigator.clipboard.readText()');
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
    await playwright.init(playwrightInstance);
    await playwright.assignWindows(PROVIDER);
    await playwright.assignActiveTabName(PROVIDER);
    await module.exports.getExtensionDetails();
    await playwright.fixBlankPage(
      PROVIDER,
      playwright.windows(PROVIDER),
      app.root,
    );
    await playwright.switchToWindow(PROVIDER);

    if (
      await playwright
        .windows(PROVIDER)
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

      // skip rebrand
      try {
        await playwright
          .windows(PROVIDER)
          .click(mainPageElements.welcome.rebrandAnnouncement, {
            timeout: 1_000,
          });
      } catch {}

      // skip welcome page
      try {
        await playwright
          .windows(PROVIDER)
          .click(mainPageElements.welcome.takeTheTourButton, {
            timeout: 1_000,
          });
        await playwright
          .windows(PROVIDER)
          .click(mainPageElements.welcome.takeTheTourButtonNext, {
            timeout: 1_000,
          });
        await playwright
          .windows(PROVIDER)
          .click(mainPageElements.welcome.takeTheTourButtonNext, {
            timeout: 1_000,
          });
        await playwright
          .windows(PROVIDER)
          .click(mainPageElements.welcome.takeTheTourButtonNext, {
            timeout: 1_000,
          });
      } catch {}

      walletAddress = await module.exports.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else if (
      /**
       * PASSWORD UNLOCK
       */
      await playwright
        .windows(PROVIDER)
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
          .windows(PROVIDER)
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
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      signaturePageElements.buttons.confirmSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectSignatureRequest: async () => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      signaturePageElements.buttons.rejectSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmTransaction: async () => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      transactionPageElements.buttons.rejectSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  rejectTransaction: async () => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      transactionPageElements.buttons.rejectSign,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  confirmIncorrectNetworkStage: async () => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);
    await playwright.waitAndClick(
      PROVIDER,
      incorrectModePageElements.buttons.close,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },
  unlock: async password => {
    await playwright.waitAndType(
      PROVIDER,
      unlockPageElements.passwordInput,
      password,
    );
    await playwright.waitAndClick(
      PROVIDER,
      unlockPageElements.unlockButton,
      await playwright.windows(PROVIDER),
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  lock: async () => {
    await playwright.waitAndClick(
      PROVIDER,
      menu.buttons.settings,
      await playwright.windows(PROVIDER),
    );
    await playwright.waitAndClick(
      PROVIDER,
      menu.buttons.sidebar.settings,
      await playwright.windows(PROVIDER),
    );
    await playwright.waitAndClick(
      PROVIDER,
      settingsPageElements.buttons.lockWallet,
      await playwright.windows(PROVIDER),
    );
    await module.exports.closePopupAndTooltips();
    return true;
  },
  selectWallet: async wallet => {
    const notificationPage = await playwright.switchToNotification(PROVIDER);

    if (wallet === 'metamask') {
      await playwright.waitAndClick(
        PROVIDER,
        selectWalletElements.buttons.continueWithMetamask,
        notificationPage,
      );
      return true;
    }

    if (wallet === 'phantom') {
      await playwright.waitAndClick(
        PROVIDER,
        selectWalletElements.buttons.continueWithPhantom,
        notificationPage,
      );
      return true;
    }
  },
  selectDefaultWallet: async wallet => {
    if (!Object.keys(mainPageElements.defaultWallet).includes(wallet)) {
      throw new Error(
        'Wallet not supported, support ' +
          Object.keys(mainPageElements.defaultWallet).join(', '),
      );
    }

    await switchToPhantomIfNotActive();

    // click settings
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.settingsMenuButton,
    );

    // click gear in sidebar settings
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.settingsSidebarButton,
    );

    // click default app wallet row
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.defaultAppWalletRow,
    );

    // click option
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.defaultWallet[wallet],
    );

    // go back to main menu
    await backToMainFromSettings();
  },
  disconnectWalletFromDapp: async () => {
    await switchToPhantomIfNotActive();
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.settingsMenuButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.settingsSidebarButton,
    );
    await playwright.waitAndClick(
      PROVIDER,
      mainPageElements.settingsMenu.trustedAppsRow,
    );

    // click trusted app
    const rowButtonLocator = await playwright
      .windows(PROVIDER)
      .locator(mainPageElements.connectedSites.rowButton);
    await playwright
      .windows(PROVIDER)
      .waitForSelector(mainPageElements.connectedSites.rowButton);
    const hasConnectedSite = await rowButtonLocator.isVisible();

    let isDisconnected = false;
    if (hasConnectedSite) {
      console.log(
        '[disconnectWalletFromDapp] Wallet is connected to a dapp, disconnecting...',
      );

      // click row button
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.connectedSites.rowButton,
      );

      // click disconnect
      await playwright.waitAndClick(
        PROVIDER,
        mainPageElements.connectedSites.trustedAppsRevokeButton,
      );
      isDisconnected = true;
    } else {
      console.log(
        '[disconnectWalletFromDapp] Wallet is not connected to a dapp, skipping...',
      );
    }

    // back to main
    await backToMainFromSettings();

    await switchToCypressIfNotActive();

    return isDisconnected;
  },
};

async function switchToPhantomIfNotActive() {
  await playwright.switchToWindow(PROVIDER);
  if (await playwright.isCypressWindowActive()) {
    await playwright.switchToWindow(PROVIDER);
    switchBackToCypressWindow = true;
  }
  return switchBackToCypressWindow;
}

export async function switchToCypressIfNotActive() {
  if (switchBackToCypressWindow) {
    await playwright.switchToCypressWindow();
    switchBackToCypressWindow = false;
  }
  return switchBackToCypressWindow;
}

async function backToMainFromSettings() {
  // click back
  await playwright.waitAndClick(
    PROVIDER,
    mainPageElements.connectedSites.trustedAppsBackButton,
  );

  // click close menu
  await playwright.waitAndClick(
    PROVIDER,
    mainPageElements.settingsMenu.settingsSidebarCloseButton,
  );
}
