const path = require('path');
const fs = require('fs');
const helpers = require('../helpers');
const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');
const { pageElements } = require('../pages/metamask/page');
const {
  welcomePageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  firstTimeFlowFormPageElements,
  revealSeedPageElements,
} = require('../pages/metamask/first-time-flow-page');
const { mainPageElements } = require('../pages/metamask/main-page');
const { unlockPageElements } = require('../pages/metamask/unlock-page');
const {
  notificationPageElements,
  permissionsPageElements,
} = require('../pages/metamask/notification-page');

let puppeteerBrowser;
let mainWindow;
let metamaskWindow;
let walletAddress;

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', async (browser = {}, arguments_) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      console.log('TRUE'); // required by cypress ¯\_(ツ)_/¯
      arguments_.args.push('--window-size=1920,1080');
      return arguments_;
    }

    if (browser.name === 'electron') {
      arguments_['width'] = 1920;
      arguments_['height'] = 1080;
      arguments_['resizable'] = false;
      return arguments_;
    }

    // metamask welcome screen blocks cypress from loading
    if (browser.name === 'chrome') {
      arguments_.args.push('--disable-background-timer-throttling');
      arguments_.args.push('--disable-backgrounding-occluded-windows');
      arguments_.args.push('--disable-renderer-backgrounding');
    }

    // NOTE: extensions cannot be loaded in headless Chrome
    const metamaskPath = await prepareMetamask();
    arguments_.extensions.push(metamaskPath);
    return arguments_;
  });

  on('task', {
    initPuppeteer: async () => {
      const connected = await initPuppeteer();
      return connected;
    },
    assignWindows: async () => {
      const assigned = await assignWindows();
      return assigned;
    },
    switchToCypressWindow: async () => {
      const switched = await switchToCypressWindow();
      return switched;
    },
    switchToMetamaskWindow: async () => {
      const switched = await switchToMetamaskWindow();
      return switched;
    },
    switchToMetamaskNotification: async () => {
      const notificationPage = await switchToMetamaskNotification();
      return notificationPage;
    },
    confirmMetamaskWelcomePage: async () => {
      const confirmed = await confirmMetamaskWelcomePage();
      return confirmed;
    },
    unlockMetamask: async password => {
      const unlocked = await unlockMetamask(password);
      return unlocked;
    },
    importMetamaskWallet: async ({ secretWords, password }) => {
      const imported = await importMetamaskWallet(secretWords, password);
      return imported;
    },
    changeMetamaskNetwork: async network => {
      const networkChanged = await changeMetamaskNetwork(network);
      return networkChanged;
    },
    acceptMetamaskAccess: async () => {
      const accepted = await acceptMetamaskAccess();
      return accepted;
    },
    getMetamaskWalletAddress: async () => {
      const walletAddress = await getMetamaskWalletAddress();
      return walletAddress;
    },
    setupMetamask: async ({ secretWords, network, password }) => {
      if (secretWords === undefined && process.env.SECRET_WORDS) {
        secretWords = process.env.SECRET_WORDS;
      }

      await initPuppeteer();
      await assignWindows();
      // no suitable element to wait for
      await metamaskWindow.waitForTimeout(1000);
      if ((await metamaskWindow.$(unlockPageElements.unlockPage)) === null) {
        await confirmMetamaskWelcomePage();
        await importMetamaskWallet(secretWords, password);
        await changeMetamaskNetwork(network);
        walletAddress = await getMetamaskWalletAddress();
        await switchToCypressWindow();
        return true;
      } else {
        await unlockMetamask(password);
        walletAddress = await getMetamaskWalletAddress();
        await switchToCypressWindow();
        return true;
      }
    },
    fetchMetamaskWalletAddress: async () => {
      return walletAddress;
    },
  });

  // setup config
  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL;
  }

  if (process.env.DEV) {
    config.retries.runMode = 0;
    config.retries.openMode = 0;
  } else {
    config.retries.runMode = 1;
    config.retries.openMode = 1;
  }

  return config;
};

async function waitFor(selector, page = metamaskWindow) {
  await page.waitForFunction(
    `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
    { visible: true },
  );
  // puppeteer going too fast breaks metamask in corner cases
  await page.waitForTimeout(300);
}

async function waitAndClick(selector, page = metamaskWindow) {
  await waitFor(selector, page);
  await page.evaluate(
    selector => document.querySelector(selector).click(),
    selector,
  );
}

async function waitAndType(selector, value, page = metamaskWindow) {
  await waitFor(selector, page);
  const element = await page.$(selector);
  await element.type(value);
}

async function waitAndGetValue(selector, page = metamaskWindow) {
  await waitFor(selector, page);
  const element = await page.$(selector);
  const property = await element.getProperty('value');
  const value = await property.jsonValue();
  return value;
}

async function waitForText(selector, text, page = metamaskWindow) {
  await waitFor(selector, page);
  await page.waitForFunction(
    `document.querySelector('${selector}').innerText.toLowerCase().includes('${text}')`,
  );
}

async function prepareMetamask() {
  const release = await helpers.getMetamaskReleases();
  const downloadsDirectory = path.resolve(__dirname, 'downloads');
  if (!fs.existsSync(downloadsDirectory)) {
    fs.mkdirSync(downloadsDirectory);
  }
  const downloadDestination = path.join(downloadsDirectory, release.filename);
  await helpers.download(release.downloadUrl, downloadDestination);
  const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
  await helpers.extract(downloadDestination, metamaskDirectory);
  return metamaskDirectory;
}

async function initPuppeteer() {
  const debuggerDetails = await fetch('http://localhost:9222/json/version');
  const debuggerDetailsConfig = await debuggerDetails.json();
  const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

  puppeteerBrowser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    ignoreHTTPSErrors: true,
    // eslint-disable-next-line unicorn/no-null
    defaultViewport: null,
  });
  return puppeteerBrowser.isConnected();
}

async function assignWindows() {
  let pages = await puppeteerBrowser.pages();
  for (const page of pages) {
    if (page.url().includes('integration')) {
      mainWindow = page;
    } else if (page.url().includes('extension')) {
      metamaskWindow = page;
    }
  }
  return true;
}

async function switchToCypressWindow() {
  await mainWindow.bringToFront();
  return true;
}

async function switchToMetamaskWindow() {
  await metamaskWindow.bringToFront();
  return true;
}

async function switchToMetamaskNotification() {
  let pages = await puppeteerBrowser.pages();
  for (const page of pages) {
    if (page.url().includes('notification')) {
      await page.bringToFront();
      return page;
    }
  }
}

async function confirmMetamaskWelcomePage() {
  await fixBlankMetamask();
  await waitAndClick(welcomePageElements.confirmButton);
  return true;
}

async function unlockMetamask(password) {
  await fixBlankMetamask();
  await waitAndType(unlockPageElements.passwordInput, password);
  await waitAndClick(unlockPageElements.unlockButton);
  return true;
}

async function importMetamaskWallet(secretWords, password) {
  await waitAndClick(firstTimeFlowPageElements.importWalletButton);
  await waitAndClick(metametricsPageElements.optOutAnalyticsButton);
  await waitAndType(
    firstTimeFlowFormPageElements.secretWordsInput,
    secretWords,
  );
  await waitAndType(firstTimeFlowFormPageElements.passwordInput, password);
  await waitAndType(
    firstTimeFlowFormPageElements.confirmPasswordInput,
    password,
  );
  await waitAndClick(firstTimeFlowFormPageElements.termsCheckbox);
  await waitAndClick(firstTimeFlowFormPageElements.importButton);

  // metamask hangs, reload as workaround
  // await waitAndClick(endOfFlowPageElements.allDoneButton);
  await waitFor(pageElements.loadingSpinner);
  await metamaskWindow.reload();
  await waitAndClick(revealSeedPageElements.remindLaterButton);
  await waitFor(mainPageElements.walletOverview);

  // close popup if present
  if ((await metamaskWindow.$(mainPageElements.popup.container)) !== null) {
    await waitAndClick(mainPageElements.popup.closeButton);
  }
  return true;
}

async function changeMetamaskNetwork(network) {
  await waitAndClick(mainPageElements.networkSwitcher.button);
  if (network === 'main') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(0));
  } else if (network === 'ropsten') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(1));
  } else if (network === 'kovan') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(2));
  } else if (network === 'rinkeby') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(3));
  } else if (network === 'goerli') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(4));
  } else if (network === 'localhost') {
    await waitAndClick(mainPageElements.networkSwitcher.networkButton(5));
  }
  await waitForText(mainPageElements.networkSwitcher.networkName, network);
  return true;
}

async function acceptMetamaskAccess() {
  await metamaskWindow.waitForTimeout(3000);
  const notificationPage = await switchToMetamaskNotification();
  await waitAndClick(notificationPageElements.nextButton, notificationPage);
  await waitAndClick(permissionsPageElements.connectButton, notificationPage);
  return true;
}

async function getMetamaskWalletAddress() {
  await waitAndClick(mainPageElements.options.button);
  await waitAndClick(mainPageElements.options.accountDetailsButton);
  const walletAddress = await waitAndGetValue(
    mainPageElements.accountModal.walletAddressInput,
  );
  await waitAndClick(mainPageElements.accountModal.closeButton);
  return walletAddress;
}

// workaround for metamask random blank page on first run
async function fixBlankMetamask() {
  await metamaskWindow.waitForTimeout(1000);
  for (let times = 0; times < 5; times++) {
    if ((await metamaskWindow.$(welcomePageElements.app)) === null) {
      await metamaskWindow.reload();
      await metamaskWindow.waitForTimeout(2000);
    } else {
      break;
    }
  }
}
