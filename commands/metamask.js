const puppeteer = require('./puppeteer');

const { pageElements } = require('../pages/metamask/page');
const {
  welcomePageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  firstTimeFlowFormPageElements,
  endOfFlowPageElements,
} = require('../pages/metamask/first-time-flow-page');
const { mainPageElements } = require('../pages/metamask/main-page');
const { unlockPageElements } = require('../pages/metamask/unlock-page');
const {
  notificationPageElements,
  permissionsPageElements,
  confirmPageElements,
} = require('../pages/metamask/notification-page');
const { setNetwork, getNetwork } = require('../helpers');

let walletAddress;

module.exports = {
  walletAddress,
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
    }
    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network,
    );
    return true;
  },
  acceptAccess: async () => {
    await puppeteer.metamaskWindow().waitForTimeout(3000);
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
    const isTestnet = getNetwork().isTestnet;
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    const currentGasFee = await puppeteer.waitAndGetValue(
      confirmPageElements.gasFeeInput,
      notificationPage,
    );
    const newGasFee = isTestnet
      ? '10'
      : (Number(currentGasFee) + 10).toString();
    await puppeteer.waitAndSetValue(
      newGasFee,
      confirmPageElements.gasFeeInput,
      notificationPage,
    );
    await puppeteer.waitAndClick(
      confirmPageElements.confirmButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  rejectTransaction: async () => {
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    const notificationPage = await puppeteer.switchToMetamaskNotification();
    await puppeteer.waitAndClick(
      confirmPageElements.rejectButton,
      notificationPage,
    );
    await puppeteer.metamaskWindow().waitForTimeout(3000);
    return true;
  },
  getWalletAddress: async () => {
    await puppeteer.waitAndClick(mainPageElements.options.button);
    await puppeteer.waitAndClick(mainPageElements.options.accountDetailsButton);
    walletAddress = await puppeteer.waitAndGetValue(
      mainPageElements.accountModal.walletAddressInput,
    );
    await puppeteer.waitAndClick(mainPageElements.accountModal.closeButton);
    return walletAddress;
  },
  initialSetup: async ({ secretWords, network, password }) => {
    if (secretWords === undefined && process.env.SECRET_WORDS) {
      secretWords = process.env.SECRET_WORDS;
    }
    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.metamaskWindow().waitForTimeout(1000);
    if (
      (await puppeteer.metamaskWindow().$(unlockPageElements.unlockPage)) ===
      null
    ) {
      await module.exports.confirmWelcomePage();
      await module.exports.importWallet(secretWords, password);
      await module.exports.changeNetwork(network);
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
