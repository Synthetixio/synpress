const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const mainPageElements = require('../pages/terrastation/main-page')
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let terraStationWindow;
let terraStationNotificationWindow;
let activeTabName;

let retries = 0;

module.exports = {
  browser() {
    return browser;
  },
  mainWindow() {
    return mainWindow;
  },
  terraStationWindow() {
    return terraStationWindow;
  },
  terraStationNotificationWindow() {
    return terraStationNotificationWindow;
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
  async clear() {
    browser = null;
    return true;
  },
  async assignWindows() {
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('runner')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        terraStationWindow = page;
      } else if (page.url().includes('notification')) {
        terraStationNotificationWindow = page;
      }
    }
    return true;
  },
  async isCypressWindowActive() {
    return activeTabName === 'cypress';
  },
  async isTerraStationWindowActive() {
    return activeTabName === 'terraStation';
  },
  async isMetamaskNotificationWindowActive() {
    return activeTabName === 'terraStation-notif';
  },
  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await module.exports.assignActiveTabName('cypress');
    }
    return true;
  },
  async switchToTerraStationkWindow() {
    await terraStationWindow.bringToFront();
    await module.exports.assignActiveTabName('terraStation');
    return true;
  },
  async waitUntilTerraStationWindowIsStable(page = terraStationWindow) {
    await module.exports.waitToBeHidden(mainPageElements.mainPageElements.portfolioValue, page); // shown on reload
    // network error handler
  },
  async waitUntilStable(page) {
    if (page && page.url().includes('notification')) {
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      await module.exports.waitUntilNotificationWindowIsStable();
    }
    await metamaskWindow.waitForLoadState('load');
    await metamaskWindow.waitForLoadState('domcontentloaded');
    await metamaskWindow.waitForLoadState('networkidle');
    await module.exports.waitUntilMetamaskWindowIsStable();
    if (mainWindow) {
      await mainWindow.waitForLoadState('load');
      await mainWindow.waitForLoadState('domcontentloaded');
      // todo: this may slow down tests and not be necessary but could improve stability
      // await mainWindow.waitForLoadState('networkidle');
    }
  },
}