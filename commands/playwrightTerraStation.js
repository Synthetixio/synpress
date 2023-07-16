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
  async clear() {
    browser = null;
    return true;
  },
//   async assignWindows() {
//     let pages = await browser.contexts()[0].pages();
//     console.log("OVO SU PAGEVI")
//     console.log(pages)
//     console.log("OVO SU PAGEVI")
//     for (const page of pages) {
//       if (page.url().includes('runner')) {
//         mainWindow = page;
//       } else if (page.url().includes('extension')) {
//         terraStationWindow = page;
//       } else if (page.url().includes('notification')) {
//         terraStationNotificationWindow = page;
//       }
//     }
//     return true;
//   },

  async assignWindowsAndContext() {
    const context = await browser.newContext();
    const extensionPage = await context.newPage();
    await extensionPage.goto(mainPageElements.welcomePageElements.welcomeExtensionPageUrl);
    terraStationExtension = extensionPage;
    return true;
  },
}