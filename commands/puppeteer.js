const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');

let puppeteerBrowser;
let mainWindow;
let metamaskWindow;

module.exports = {
  puppeteerBrowser: () => {
    return puppeteerBrowser;
  },
  mainWindow: () => {
    return mainWindow;
  },
  metamaskWindow: () => {
    return metamaskWindow;
  },
  init: async () => {
    const debuggerDetails = await fetch('http://localhost:9222/json/version'); //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json();
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

    puppeteerBrowser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });
    return puppeteerBrowser.isConnected();
  },
  clear: async () => {
    puppeteerBrowser = null;
  },
  assignWindows: async () => {
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      if (page.url().includes('integration')) {
        mainWindow = page;
      } else if (page.url().includes('tests')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        metamaskWindow = page;
      }
    }
    return true;
  },
  getBrowser: async () => {
    return {
      puppeteerBrowser,
    };
  },
  getWindows: async () => {
    return {
      mainWindow,
      metamaskWindow,
    };
  },
  clearWindows: async () => {
    mainWindow = null;
    metamaskWindow = null;
  },
  getActiveTabPage: async () => {
    let pages = await puppeteerBrowser.pages();
    const visiblePages = pages.filter(async page => {
      const state = await page.evaluate(() => document.visibilityState);
      // todo: seem to be bugged out with cypress first tab always having visiblityState visible
      return state === 'visible';
    });
    const activeTabPage = visiblePages[0];
    return activeTabPage;
  },
  isMetamaskWindowActive: async () => {
    let activeTabPage = await module.exports.getActiveTabPage();
    if (
      activeTabPage.url().includes('extension') ||
      activeTabPage.url().includes('notification')
    ) {
      return true;
    } else {
      return false;
    }
  },
  isCypressWindowActive: async () => {
    let activeTabPage = await module.exports.getActiveTabPage();
    if (activeTabPage.url().includes('integration')) {
      return true;
    } else {
      return false;
    }
  },
  switchToCypressWindow: async () => {
    await mainWindow.bringToFront();
    return true;
  },
  switchToMetamaskWindow: async () => {
    await metamaskWindow.bringToFront();
    return true;
  },
  switchToMetamaskNotification: async () => {
    // todo: wait for page to be initialized before triggering waitFor
    // todo: wait for spinning loader to be gone before triggering waitFor
    // todo: get rid of waitForTimeout after fixing above
    // todo: all of the above are issues related to metamask notification of tx confirmation
    await module.exports.metamaskWindow().waitForTimeout(3000);
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        return page;
      }
    }
  },
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    // puppeteer going too fast breaks metamask in corner cases
    await page.waitForTimeout(300);
  },
  waitAndClick: async (selector, page = metamaskWindow, numberOfClicks) => {
    await module.exports.waitFor(selector, page);
    if (numberOfClicks) {
      let i = 0;
      while (i < numberOfClicks) {
        i++;
        await page.evaluate(
          selector => document.querySelector(selector).click(),
          selector,
        );
      }
    } else {
      await page.evaluate(
        selector => document.querySelector(selector).click(),
        selector,
      );
    }
  },
  waitAndClickByText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(() => {
      [...document.querySelectorAll(selector)]
        .find(element => element.textContent === text)
        .click();
    });
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.$(selector);
    await element.type(value);
  },
  waitAndGetValue: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.$(selector);
    const property = await element.getProperty('value');
    const value = await property.jsonValue();
    return value;
  },
  waitAndSetValue: async (text, selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(
      selector => (document.querySelector(selector).value = ''),
      selector,
    );
    await page.focus(selector);
    await page.keyboard.type(text);
  },
  waitAndClearWithBackspace: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
    }
  },
  waitClearAndType: async (text, selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const input = await page.$(selector);
    await input.click({ clickCount: 3 });
    await input.type(text);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.waitForFunction(
      `document.querySelector('${selector}').innerText.toLowerCase().includes('${text}')`,
    );
  },
};
