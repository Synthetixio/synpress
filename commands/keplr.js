const log = require('debug')('synpress:keplr');
const playwright = require('./playwright-keplr');
const { onboardingElements } = require('../pages/keplr/first-time-flow-page');
const {
  notificationPageElements,
} = require('../pages/keplr/notification-page');

let extensionId;
let extensionVersion;

const keplr = {
  async resetState() {
    log('Resetting state of keplr');
    extensionId = undefined;
    extensionVersion = undefined;
  },
  extensionId: () => {
    return extensionId;
  },
  extensionUrls: () => {
    return {
      extensionImportAccountUrl,
    };
  },

  async getExtensionDetails() {
    const keplrExtensionData = (await playwright.getExtensionsData()).keplr;

    extensionId = keplrExtensionData.id;
    extensionVersion = keplrExtensionData.version;

    return {
      extensionId,
      extensionVersion,
    };
  },

  async importWallet(secretWords, password) {
    await playwright.waitAndClickByText(
      onboardingElements.createWalletButton,
      await playwright.keplrWindow(),
    );
    await playwright.waitAndClickByText(
      onboardingElements.importRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
    await playwright.waitAndClickByText(
      onboardingElements.useRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
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

    await playwright.waitAndType(
      onboardingElements.walletInput,
      onboardingElements.walletName,
    );
    await playwright.waitAndType(onboardingElements.passwordInput, password);
    await playwright.waitAndType(
      onboardingElements.confirmPasswordInput,
      password,
    );

    await playwright.waitAndClick(
      onboardingElements.submitWalletDataButton,
      await playwright.keplrWindow(),
      { number: 1 },
    );

    await playwright.waitForByText(
      onboardingElements.phraseSelectChain,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndClick(
      onboardingElements.submitChainButton,
      await playwright.keplrWindow(),
    );

    await playwright.waitForByText(
      onboardingElements.phraseAccountCreated,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndClick(
      onboardingElements.finishButton,
      await playwright.keplrWindow(),
      { dontWait: true },
    );

    return true;
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

  async confirmTransaction() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await playwright.waitAndClick(
      notificationPageElements.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  },

  async initialSetup(
    playwrightInstance,
    { secretWordsOrPrivateKey, password },
  ) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }

    await playwright.assignWindows();
    await playwright.assignActiveTabName('keplr');
    await module.exports.getExtensionDetails();
    await module.exports.importWallet(secretWordsOrPrivateKey, password);
  },
};

module.exports = keplr;