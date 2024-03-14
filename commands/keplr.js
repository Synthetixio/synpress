const log = require('debug')('synpress:keplr');
const playwright = require('./playwright-keplr');
const { onboardingElements } = require('../pages/keplr/first-time-flow-page');
const {
  notificationPageElements,
} = require('../pages/keplr/notification-page');
const { homePageElements } = require('../pages/keplr/home-page');
const clipboardy = require('clipboardy');

let extensionId;
let extensionVersion;
let registrationUrl;
let permissionsUrl;
let popupUrl;
let walletsPageUrl;
let switchBackToCypressWindow;
let walletAddress;

const keplr = {
  async resetState() {
    log('Resetting state of keplr');
    extensionId = undefined;
    extensionVersion = undefined;
    registrationUrl = undefined;
    permissionsUrl = undefined;
    popupUrl = undefined;
    walletAddress = undefined;
    walletsPageUrl = undefined;
  },
  walletAddress: () => {
    return walletAddress;
  },
  extensionId: () => {
    return extensionId;
  },
  extensionUrls: () => {
    return {
      registrationUrl,
      permissionsUrl,
      popupUrl,
    };
  },
  async goTo(url) {
    await Promise.all([
      playwright.keplrWindow().waitForNavigation(),
      playwright.keplrWindow().goto(url),
    ]);
    await playwright.waitUntilStable();
  },
  async goToRegistration() {
    await module.exports.goTo(registrationUrl);
  },
  async goToPermissions() {
    await module.exports.goTo(permissionsUrl);
  },
  async goToHome() {
    await module.exports.goTo(popupUrl);
  },
  async goToWalletsPage() {
    await module.exports.goTo(walletsPageUrl);
  },
  async switchToKeplrIfNotActive() {
    if (playwright.isCypressWindowActive()) {
      await playwright.switchToKeplrWindow();
      switchBackToCypressWindow = true;
    }
    return switchBackToCypressWindow;
  },
  async getExtensionDetails() {
    const keplrExtensionData = (await playwright.getExtensionsData()).keplr;

    extensionId = keplrExtensionData.id;
    extensionVersion = keplrExtensionData.version;
    registrationUrl = `chrome-extension://${extensionId}/register.html`;
    permissionsUrl = `chrome-extension://${extensionId}/popup.html#/setting/security/permission`;
    popupUrl = `chrome-extension://${extensionId}/popup.html`;
    walletsPageUrl = `chrome-extension://${extensionId}/popup.html#/wallet/select`;

    return {
      extensionId,
      extensionVersion,
      registrationUrl,
      permissionsUrl,
      popupUrl,
      walletsPageUrl,
    };
  },
  async disconnectWalletFromDapp() {
    await module.exports.goToPermissions();
    await playwright.waitAndClickByText(
      'Disconnect All',
      playwright.keplrWindow(),
    );
    return true;
  },
  async importWallet(
    secretWordsOrPrivateKey,
    password,
    newAccount,
    walletName,
  ) {
    await module.exports.goToRegistration();
    await playwright.waitAndClickByText(
      newAccount
        ? onboardingElements.createWalletButton
        : onboardingElements.existingWalletButton,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndClickByText(
      newAccount
        ? onboardingElements.importRecoveryPhraseButton
        : onboardingElements.useRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );

    newAccount &&
      (await playwright.waitAndClickByText(
        onboardingElements.useRecoveryPhraseButton,
        await playwright.keplrWindow(),
      ));

    if (secretWordsOrPrivateKey.includes(' ')) {
      await module.exports.importWalletWithPhrase(
        secretWordsOrPrivateKey,
        password,
      );
    } else {
      await module.exports.importWalletWithPrivateKey(
        secretWordsOrPrivateKey,
        password,
      );
    }

    await playwright.waitAndType(onboardingElements.walletInput, walletName);

    const passwordFieldExists =
      await playwright.waitForAndCheckElementExistence(
        onboardingElements.passwordInput,
      );

    if (passwordFieldExists) {
      await playwright.waitAndType(onboardingElements.passwordInput, password);
      await playwright.waitAndType(
        onboardingElements.confirmPasswordInput,
        password,
      );
    }

    await playwright.waitAndClick(
      onboardingElements.submitWalletDataButton,
      await playwright.keplrWindow(),
      { number: 1 },
    );

    await playwright.waitForByText(
      onboardingElements.phraseSelectChain,
      await playwright.keplrWindow(),
    );

    await module.exports.handleSelectChain();

    await playwright.waitForByText(
      onboardingElements.phraseAccountCreated,
      await playwright.keplrWindow(),
    );

    return true;
  },
  async handleSelectChain() {
    const chainNameExists = await playwright.waitForAndCheckElementExistence(
      onboardingElements.chainNameSelector,
    );

    if (chainNameExists) {
      await playwright.waitAndClickByText(
        onboardingElements.chainName,
        playwright.keplrWindow(),
      );
      await playwright.waitAndClick(
        onboardingElements.submitChainButton,
        playwright.keplrWindow(),
      );
      const importButtonExists =
        await playwright.waitForAndCheckElementExistence(
          onboardingElements.importButtonSelector,
        );

      if (importButtonExists) {
        await playwright.waitAndClick(
          onboardingElements.importButtonSelector,
          playwright.keplrWindow(),
        );
      }
    } else {
      await playwright.waitAndClick(
        onboardingElements.submitChainButton,
        playwright.keplrWindow(),
      );
    }
  },
  async importWalletWithPhrase(secretWords) {
    await playwright.waitAndClickByText(
      onboardingElements.phraseCount24,
      await playwright.keplrWindow(),
    );

    for (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndTypeByLocator(
        onboardingElements.textAreaSelector,
        word,
        index,
      );
    }

    await playwright.waitAndClick(
      onboardingElements.submitPhraseButton,
      await playwright.keplrWindow(),
    );
  },
  async importWalletWithPrivateKey(privateKey) {
    await playwright.waitAndClickByText(
      onboardingElements.phrasePrivateKey,
      await playwright.keplrWindow(),
      true,
    );

    await playwright.waitAndTypeByLocator(
      onboardingElements.textAreaSelector,
      privateKey,
    );

    await playwright.waitAndClick(
      onboardingElements.submitPhraseButton,
      await playwright.keplrWindow(),
    );
  },
  async acceptAccess() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await playwright.waitAndClick(
      notificationPageElements.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },

  async rejectAccess() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await notificationPage.close();
    return true;
  },

  async confirmTransaction() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await playwright.waitAndClick(
      notificationPageElements.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },

  async rejectTransaction() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await notificationPage.close();
    return true;
  },

  async getWalletAddress(chainName) {
    playwright.switchToKeplrWindow();
    await module.exports.goToHome();
    const newTokensSelctorExists =
      await playwright.waitForAndCheckElementExistence(
        homePageElements.newTokensFoundSelector,
      );

    if (newTokensSelctorExists) {
      await module.exports.addNewTokensFound(false);
    }

    await playwright.waitAndClickByText(notificationPageElements.copyAddress);
    await playwright.waitAndClick(
      notificationPageElements.walletSelectors(chainName),
    );

    walletAddress = clipboardy.readSync();
    await playwright.switchToCypressWindow();
    return walletAddress;
  },

  async initialSetup(
    playwrightInstance,
    { secretWordsOrPrivateKey, password, newAccount, walletName },
  ) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }

    await playwright.assignWindows();
    await playwright.switchToKeplrWindow();
    await module.exports.getExtensionDetails();
    await module.exports.importWallet(
      secretWordsOrPrivateKey,
      password,
      newAccount,
      walletName,
    );
    await playwright.switchToCypressWindow();
  },

  async switchWallet({ walletName }) {
    const originalURL = playwright.keplrWindow().url();
    await module.exports.switchToKeplrIfNotActive();
    await module.exports.goToWalletsPage();

    await playwright.waitAndClickByText(
      walletName,
      playwright.keplrWindow(),
      true,
    );

    await playwright.waitForURLLoad(originalURL);
    await playwright.switchToCypressWindow();

    return true;
  },
  async addNewTokensFound(switchScreens = true) {
    if (switchScreens) {
      module.exports.switchToKeplrIfNotActive();
      await module.exports.goToHome();
    }
    await playwright.waitAndClickByText(homePageElements.newTokensFound);
    await playwright.waitAndClickWithDelay(
      homePageElements.selectAllTokensCheck,
      2000,
      { number: -1, force: true },
    );
    await playwright.waitAndClickByText(
      homePageElements.addChainsButton,
      playwright.keplrWindow(),
      true,
    );

    if (switchScreens) {
      await playwright.switchToCypressWindow();
    }

    return true;
  },

  async getTokenAmount({ tokenName }) {
    await module.exports.switchToKeplrIfNotActive();
    await module.exports.goToHome();

    const tokenLabel = await playwright.waitFor(
      homePageElements.tokenNameLabel(tokenName),
    );
    const parentElement = tokenLabel.locator(
      homePageElements.tokenParentSelector,
    );
    const innerTexts = await parentElement.allInnerTexts();
    const textArray = innerTexts[0].split('\n');

    const tokenValue = textArray[3];
    const parsedTokenValue = Number(tokenValue.replace(/,/g, ''));
    await playwright.switchToCypressWindow();
    return parsedTokenValue;
  },
};

module.exports = keplr;
