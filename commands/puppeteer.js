const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');
const { getDocument } = require('pptr-testing-library');

let puppeteerBrowser;
let mainWindow;
let blankWindow;
let activeTabName;

module.exports = {
  puppeteerBrowser: () => {
    return puppeteerBrowser;
  },
  mainWindow: () => {
    return mainWindow;
  },
  blankWindow: () => {
    return blankWindow;
  },
  activeTabName: () => {
    return activeTabName;
  },
  init: async () => {
    try {
      const debuggerDetails = await fetch('http://localhost:9222/json/version'); //DevSkim: ignore DS137138
      const debuggerDetailsConfig = await debuggerDetails.json();
      const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

      puppeteerBrowser = await puppeteer.connect({
        browserWSEndpoint: webSocketDebuggerUrl,
        ignoreHTTPSErrors: true,
        defaultViewport: null,
      });

      return puppeteerBrowser;
    } catch (e) {
      console.error(e);
    }
  },
  clear: async () => {
    puppeteerBrowser = null;
    return true;
  },
  assignWindows: async () => {
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      console.log(page.url());
      if (page.url().includes('integration')) {
        mainWindow = page;
      } else if (page.url().includes('tests')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        blankWindow = page;
      }
    }
    return true;
  },
  assignActiveTabName: async tabName => {
    activeTabName = tabName;
    return true;
  },
  goToPopup: async () => {
    console.log(blankWindow.url());
    const url = new URL(blankWindow.url());
    return await blankWindow.goto(
      url.href.replaceAll(url.hash, ' ').replaceAll('tab', 'popup'),
    );
  },
  clearWindows: async () => {
    mainWindow = null;
    blankWindow = null;
    return true;
  },
  isBlankWindowActive: async () => {
    if (activeTabName === 'blank') {
      return true;
    } else {
      return false;
    }
  },
  isCypressWindowActive: async () => {
    if (activeTabName === 'cypress') {
      return true;
    } else {
      return false;
    }
  },
  switchToCypressWindow: async () => {
    await mainWindow.bringToFront();
    await module.exports.assignActiveTabName('cypress');
    return true;
  },
  switchToBlankWindow: async () => {
    await blankWindow.bringToFront();
    await module.exports.assignActiveTabName('blank');
    return true;
  },
  switchToBlankNotification: async () => {
    // todo: wait for page to be initialized before triggering waitFor
    // todo: wait for spinning loader to be gone before triggering waitFor
    // todo: get rid of waitForTimeout after fixing above
    // todo: all of the above are issues related to blank notification of tx confirmation
    await module.exports.blankWindow().waitForTimeout(3000);
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        return page;
      }
    }
  },
  document: async (page = blankWindow) => {
    const document = await getDocument(page);
    return document;
  },
  click: async element => {
    return (await element).click();
  },
  type: async (element, value) => {
    return (await element).type(value);
  },
};
