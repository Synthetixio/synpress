/* eslint-disable testing-library/no-await-sync-query */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line testing-library/no-await-sync-query
/* eslint-disable testing-library/prefer-screen-queries */
const puppeteer = require('./puppeteer');
const onboardingElements = require('../pages/blank/setup-wallet-configuration');
const { setNetwork, getNetwork } = require('../helpers');
const homePage = require('../pages/blank/home-page');
const documentUtils = require('../pages/documentUtils');
const accountsPage = require('../pages/blank/accounts-page');
const sendTransactionPage = require('../pages/blank/send-page');
let walletAddress;
let switchBackToCypressWindow;

const copyWalletAddressToClipboard = async () => {
  const document = await puppeteer.document();
  const accountAddressButton = await homePage.getAccountAddressButton(document);
  await puppeteer.click(accountAddressButton);
  const clipboardData = await puppeteer.readClipboard();
  puppeteer.blankWindow().waitForTimeout(3000);
  return clipboardData;
};

module.exports = {
  walletAddress: () => {
    return walletAddress;
  },
  fixBlankPage: async () => {
    await puppeteer.blankWindow().waitForTimeout(1000);
  },
  confirmWelcomePage: async () => {
    const document = await puppeteer.document();
    await puppeteer.click(onboardingElements.getStartedButton(document));
    await puppeteer.click(onboardingElements.modalCosentButton(document));
    return true;
  },
  unlock: async password => {
    await puppeteer.blankWindow().waitForTimeout(2000);
    const document = await puppeteer.document();
    await puppeteer.type(
      onboardingElements.unlockWalletForm.password(document),
      password,
    );
    await puppeteer.click(
      onboardingElements.unlockWalletForm.submitButton(document),
    );
    //wait for login-in
    return puppeteer.blankWindow().waitForTimeout(5000);
  },
  importWallet: async (secretWords, password) => {
    const document = await puppeteer.document();
    await puppeteer.click(onboardingElements.importWalletButton(document));
    //fill form
    await puppeteer.type(
      onboardingElements.importWalletForm.seedPhrase(document),
      secretWords,
    );
    await puppeteer.type(
      onboardingElements.importWalletForm.password(document),
      password,
    );
    await puppeteer.type(
      onboardingElements.importWalletForm.confirmPassword(document),
      password,
    );
    await puppeteer.click(
      onboardingElements.importWalletForm.termsAndConditionsCheckbox(document),
    );
    //submit form
    await puppeteer.click(
      onboardingElements.importWalletForm.submitButton(document),
    );
    await puppeteer.blankWindow().waitForTimeout(3000);
    return true;
  },
  changeNetwork: async network => {
    await switchToBlankIfNotActive();
    const document = await puppeteer.document();
    if (typeof network === 'string') {
      network = network.toLowerCase();
    } else if (typeof network === 'object') {
      network.networkName = network.networkName.toLowerCase();
    }
    const networkSelector = await homePage.networkSelector(document);
    await puppeteer.click(networkSelector);
    let networkNode = await homePage.findNetworkInSelector(
      networkSelector,
      network,
    );
    if (!networkNode) {
      const showTestNetworks = await homePage.showTestNetworkCheckbox(
        networkSelector,
      );
      await puppeteer.click(showTestNetworks);
      networkNode = await homePage.findNetworkInSelector(
        networkSelector,
        network,
      );
    }

    await networkNode.click();
    setNetwork(network);
    await switchToCypressIfNotActive();
    return true;
  },
  isBlankSetupCompleted: async () => {
    const document = await puppeteer.document();
    return onboardingElements.isSetupCompleted(document);
  },
  getNetwork: async () => {
    await puppeteer.blankWindow().waitForTimeout(5000);
    await switchToBlankIfNotActive(true);
    const document = await puppeteer.document(puppeteer.blankWindow());
    const net = await homePage.getSelectedNetwork(document);
    await switchToCypressIfNotActive();
    return net;
  },
  getWalletAddress: async () => {
    await switchToBlankIfNotActive(true);
    const clipboardData = await copyWalletAddressToClipboard();
    await switchToCypressIfNotActive();
    return clipboardData;
  },
  getAccountName: async () => {
    await switchToBlankIfNotActive(true);
    const accountName = await homePage.getAccountName();
    await switchToCypressIfNotActive();
    return accountName;
  },
  createAccount: async () => {
    await switchToBlankIfNotActive(true);
    const document = await puppeteer.document();
    await puppeteer.click(homePage.getAccountIcon(document));
    await puppeteer.click(accountsPage.getCreateNewAccountButton(document));
    await puppeteer.blankWindow().waitForTimeout(2000);
    const creationForm = await accountsPage.getCreationForm(document);
    await puppeteer.click(
      await accountsPage.getConfirmCreationButton(creationForm),
    );
    console.time('start-end');
    console.log('checking...');
    await documentUtils.awaitLoadingButtonFinish(creationForm);
    console.timeEnd('start-end');
    await puppeteer.blankWindow().waitForTimeout(5000);
    const accountName = await homePage.getAccountName();
    await switchToCypressIfNotActive();
    return accountName;
  },
  switchAccount: async accountName => {
    await switchToBlankIfNotActive(true);
    const document = await puppeteer.document();
    await puppeteer.click(homePage.getAccountIcon(document));
    await puppeteer.click(
      accountsPage.getSwitchAccountButton(document, accountName),
    );
    const assignedAccountName = await homePage.getAccountName();
    await switchToCypressIfNotActive();
    return assignedAccountName;
  },
  initialSetup: async ({ secretWordsOrPrivateKey, network, password }) => {
    const isCustomNetwork =
      (process.env.NETWORK_NAME &&
        process.env.RPC_URL &&
        process.env.CHAIN_ID) ||
      typeof network == 'object';

    await puppeteer.init();
    await puppeteer.assignWindows();
    await puppeteer.assignActiveTabName('blank');
    await puppeteer.blankWindow().waitForTimeout(3000);
    const setupCompleted = await module.exports.isBlankSetupCompleted();

    if (setupCompleted) {
      await puppeteer.goToPopup();
      await module.exports.unlock(password);
      //await the app to be ready for tests
      await puppeteer.blankWindow().waitForTimeout(20000);
      await puppeteer.switchToCypressWindow();
      return true;
    }

    if (!setupCompleted) {
      await module.exports.confirmWelcomePage();
      if (secretWordsOrPrivateKey.includes(' ')) {
        // secret words
        await module.exports.importWallet(secretWordsOrPrivateKey, password);
      } else {
        // private key
        await module.exports.createWallet(password);
        await module.exports.importAccount(secretWordsOrPrivateKey);
      }
      await puppeteer.goToPopup();
      await puppeteer.switchToCypressWindow();
      return true;
    }
  },
  sendTransaction: async (accountNameTo, amount = '0.1') => {
    await switchToBlankIfNotActive(true);
    const page = puppeteer.blankWindow();
    const document = await puppeteer.document();
    await puppeteer.click(homePage.getSendTransactionButton(document));
    await puppeteer.click(
      sendTransactionPage.getTargetAccountTransaction(document, accountNameTo),
    );
    await puppeteer.click(sendTransactionPage.getNextButton(document));
    const amountInput = await sendTransactionPage.getAmountInput(document);
    try {
      await puppeteer.type(amountInput, amount);
    } catch (e) {
      console.log(e, amount);
      return Promise.reject(e);
    }
    await puppeteer.blankWindow().waitForTimeout(5000);
    await puppeteer.click(sendTransactionPage.getConfirmButton(document));
    await puppeteer.blankWindow().waitForTimeout(3000);
    await puppeteer.switchToCypressWindow();
    return true;
  },
  getLastTransactionId: async () => {
    await switchToBlankIfNotActive(true);
    const document = await puppeteer.document();
    console.log('HERE1');
    try {
      const txId = await homePage.getLastTransactionId(document);
      return txId;
    } catch (e) {
      //do not fail if there are not transactions
      console.log('EEEE', e);
      return '';
    } finally {
      await switchToCypressIfNotActive();
    }
  },
};

async function switchToBlankIfNotActive(forced = false) {
  if ((await puppeteer.isCypressWindowActive()) || forced) {
    await puppeteer.switchToBlankWindow();
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
