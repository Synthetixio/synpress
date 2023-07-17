const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const mainPageElements = require('../pages/terrastation/main-page')
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let terraStationExtension;
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
  terraStationExtension() {
    return terraStationExtension;
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
  async assignPages() {
    let terraStationExtensionUrl;
    let serviceWorkers = await browser.contexts()[0].serviceWorkers();
    serviceWorkers.forEach(worker => {
      const url = worker._initializer.url;
      terraStationExtensionUrl = url.replace('background.js', 'index.html#/');
    });
    const blankPage = await browser.contexts()[0].newPage()
    await blankPage.goto(terraStationExtensionUrl)
    let pages = await browser.contexts()[0].pages()
    pages.forEach( page => {
      if (page.url().includes('index.html')) {
        terraStationExtension = page;
      }
    })
    
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
}