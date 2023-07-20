const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');

const {
  seedFormElements,
  seedCompletedFormElements,
  manageWalletsForm,
} = require('../pages/terrastation/seed-page');

const expect = require('@playwright/test').expect;

let browser;
let mainWindow;
let terraStationExtension;
let terraStationExtensionNewWallet;
let terraStationExtensionSeed;
let terraStationExtensionPrivateKey;
let terraStationExtensionMultiSig;
let terraStationExtensionLedger;
let activeTabName;

module.exports = {
  browser() {
    return browser;
  },
  mainWindow() {
    return mainWindow;
  },
  terraStationExtension() {
    return terraStationExtension;
  },
  terraStationExtensionNewWallet() {
    return terraStationExtensionNewWallet;
  },
  terraStationExtensionSeed() {
    return terraStationExtensionSeed;
  },
  terraStationExtensionPrivateKey() {
    return terraStationExtensionPrivateKey;
  },
  terraStationExtensionMultiSig() {
    return terraStationExtensionMultiSig;
  },
  terraStationExtensionLedger() {
    return terraStationExtensionLedger;
  },
  activeTabName() {
    return activeTabName;
  },
  async assignActiveTabName(tabName) {
    activeTabName = tabName;
    return true;
  },
  async init(playwrightInstance) {
    const chromium = playwrightInstance
      ? playwrightInstance
      : require('@playwright/test').chromium;
    const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version'); //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json();
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;
    if (process.env.SLOW_MODE) {
      if (!isNaN(process.env.SLOW_MODE)) {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: Number(process.env.SLOW_MODE),
        });
      } else {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: 50,
        });
      }
    } else {
      browser = await chromium.connectOverCDP(webSocketDebuggerUrl);
    }
    return browser.isConnected();
  },
  async assignStartPage() {
    let terraStationExtensionUrl;
    let serviceWorkers = await browser.contexts()[0].serviceWorkers();
    for (let worker of serviceWorkers) {
      const url = worker._initializer.url;

      // Check if the URL contains 'background.js'
      if (url.includes('background.js')) {
        terraStationExtensionUrl = url.replace('background.js', 'index.html#/');
        break; // Exit the loop once the correct service worker is found
      }
    }

    const blankPage = await browser.contexts()[0].newPage();
    await blankPage.goto(terraStationExtensionUrl);
    let pages = await browser.contexts()[0].pages();
    pages.forEach(page => {
      if (page.url().includes('index.html')) {
        terraStationExtension = page;
      }
    });
  },
  async assignOtherPages() {
    await terraStationExtension.bringToFront();
    await terraStationExtension.getByText('New wallet').click();
    await terraStationExtension.getByText('Import from seed phrase').click();
    await terraStationExtension.getByText('Import from private key').click();
    await terraStationExtension.getByText('New multisig wallet').click();
    await terraStationExtension.getByText('Access with ledger').click();

    let pages = await browser.contexts()[0].pages();
    pages.forEach(page => {
      if (page.url().includes('auth/new')) {
        terraStationExtensionNewWallet = page;
      }
      if (page.url().includes('auth/recover')) {
        terraStationExtensionSeed = page;
      }
      if (page.url().includes('auth/import')) {
        terraStationExtensionPrivateKey = page;
      }
      if (page.url().includes('auth/multisig/new')) {
        terraStationExtensionMultiSig = page;
      }
      if (page.url().includes('auth/ledger')) {
        terraStationExtensionLedger = page;
      }
    });
  },
  async clear() {
    browser = null;
    return true;
  },

  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await module.exports.assignActiveTabName('cypress');
    }
    return true;
  },
  async switchToTerraStationWindow() {
    await terraStationExtension.bringToFront();
    await module.exports.assignActiveTabName('terraStation');
    return true;
  },
  async bringToFrontAndReload(page) {
    page.bringToFront();
    page.reload();
  },

  async setupQaWalletAndVerify() {
    await this.fillSeedForm('Test wallet 1', 'Testtest123!');
    await this.bringToFrontAndReload(terraStationExtension);
    await this.verifyWalletAdded();
  },

  async fillSeedForm(walletName, password, seed = process.env.SEED_PHRASE) {
    await terraStationExtensionSeed.bringToFront();
    await terraStationExtensionSeed.waitForLoadState();
    await terraStationExtensionSeed.fill(
      seedFormElements.inputName,
      walletName,
    );
    await terraStationExtensionSeed.fill(
      seedFormElements.inputPassword,
      password,
    );
    await terraStationExtensionSeed.fill(
      seedFormElements.inputconfirmPassword,
      password,
    );
    await terraStationExtensionSeed.fill(
      seedFormElements.inputMnemonicSeed,
      seed,
    );
    await terraStationExtensionSeed.click(seedFormElements.submitButton),
      await terraStationExtensionSeed.waitForURL('**/recover#3');

    expect(
      await terraStationExtensionSeed.getByTestId('DoneAllIcon'),
    ).toBeVisible();
    expect(
      terraStationExtensionSeed.getByRole('button', {
        name: 'Connect',
        exact: true,
      }),
    ).toBeVisible();
    await terraStationExtensionSeed
      .getByRole('button', { name: 'Connect', exact: true })
      .click();
  },

  async verifyWalletAdded() {
    expect(
      await terraStationExtension
        .getByText('Test wallet 1')
        .filter({ hasText: 'Test wallet 1' }),
    ).toBeVisible();
    await terraStationExtension.getByText('Test wallet 1').click();
    expect(
      await terraStationExtension.getByText('Manage Wallets'),
    ).toBeVisible();
    expect(
      await terraStationExtension.getByRole('button', {
        name: 'Test wallet 1 terra1...6cw6qmfdnl9un23yxs',
      }),
    ).toBeVisible();
    expect(await terraStationExtension.getByText('Add a wallet')).toBeVisible();
    await terraStationExtension.click(
      manageWalletsForm.menageWalletsCloseButton,
    );
  },
};
